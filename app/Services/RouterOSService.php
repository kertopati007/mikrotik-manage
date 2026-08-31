<?php

namespace App\Services;

use Exception;

class RouterOSService
{
    protected string $host;

    protected int $port;

    protected string $username;

    protected string $password;

    protected bool $ssl;

    protected int $timeout;

    /** @var resource|null */
    protected $socket = null;

    protected bool $connected = false;

    protected ?string $lastError = null;

    public function __construct(
        string $host,
        string $username = 'admin',
        string $password = '',
        int $port = 8728,
        bool $ssl = false,
        int $timeout = 4
    ) {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->port = $port;
        $this->ssl = $ssl;
        $this->timeout = $timeout;
    }

    /**
     * Establish connection to the RouterOS API.
     */
    public function connect(): bool
    {
        $this->lastError = null;

        $protocol = $this->ssl ? 'ssl://' : 'tcp://';
        $target = $protocol.$this->host.':'.$this->port;

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ]);

        $errno = 0;
        $errstr = '';

        $this->socket = @stream_socket_client(
            $target,
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (! $this->socket) {
            $this->lastError = "Connection failed to {$this->host}:{$this->port} ($errstr [code $errno])";

            return false;
        }

        stream_set_timeout($this->socket, $this->timeout);

        // Perform authentication
        try {
            if (! $this->login()) {
                $this->disconnect();

                return false;
            }
        } catch (Exception $e) {
            $this->lastError = 'Authentication error: '.$e->getMessage();
            $this->disconnect();

            return false;
        }

        $this->connected = true;

        return true;
    }

    /**
     * Authenticate with RouterOS (supports ROS v6.43+ and legacy challenge).
     */
    protected function login(): bool
    {
        // Modern RouterOS (v6.43+) plain login
        $this->writeSentence(['/login', '=name='.$this->username, '=password='.$this->password]);
        $response = $this->readSentence();

        if (isset($response['!done'])) {
            if (isset($response['!done']['ret'])) {
                // Legacy RouterOS challenge-response required (pre 6.43)
                $challenge = pack('H*', $response['!done']['ret']);
                $md5 = md5(chr(0).$this->password.$challenge);
                $this->writeSentence([
                    '/login',
                    '=name='.$this->username,
                    '=response=00'.$md5,
                ]);
                $legacyResponse = $this->readSentence();

                if (isset($legacyResponse['!done'])) {
                    return true;
                }

                if (isset($legacyResponse['!trap'])) {
                    $this->lastError = $legacyResponse['!trap']['message'] ?? 'Authentication failed';

                    return false;
                }
            }

            return true;
        }

        if (isset($response['!trap'])) {
            $this->lastError = $response['!trap']['message'] ?? 'Login rejected by router';

            return false;
        }

        $this->lastError = 'Unexpected login response from RouterOS';

        return false;
    }

    /**
     * Send command to RouterOS API and return associative array results.
     */
    public function comm(string $command, array $params = []): array
    {
        if (! $this->connected && ! $this->connect()) {
            throw new Exception($this->lastError ?? 'Not connected to RouterOS');
        }

        $words = [$command];
        foreach ($params as $key => $value) {
            if (is_int($key)) {
                $words[] = $value;
            } else {
                $words[] = "={$key}={$value}";
            }
        }

        $this->writeSentence($words);
        $result = [];

        while (true) {
            $sentence = $this->readSentence();

            if (isset($sentence['!re'])) {
                $result[] = $sentence['!re'];
            } elseif (isset($sentence['!done'])) {
                if (isset($sentence['!done']['ret'])) {
                    $result['ret'] = $sentence['!done']['ret'];
                }
                break;
            } elseif (isset($sentence['!trap'])) {
                $msg = $sentence['!trap']['message'] ?? 'RouterOS command error';
                throw new Exception('RouterOS Trap: '.$msg);
            } elseif (isset($sentence['!fatal'])) {
                $this->connected = false;
                throw new Exception('RouterOS Fatal: '.($sentence['!fatal']['message'] ?? 'Connection closed by router'));
            } elseif (empty($sentence)) {
                break;
            }
        }

        return $result;
    }

    /**
     * Write a sentence (array of words) to socket.
     */
    protected function writeSentence(array $words): void
    {
        foreach ($words as $word) {
            $this->writeWord($word);
        }
        $this->writeWord(''); // End of sentence marker
    }

    /**
     * Write single length-encoded word to socket.
     */
    protected function writeWord(string $word): void
    {
        $len = strlen($word);

        if ($len < 0x80) {
            $header = chr($len);
        } elseif ($len < 0x4000) {
            $header = chr(0x80 | ($len >> 8)).chr($len & 0xFF);
        } elseif ($len < 0x200000) {
            $header = chr(0xC0 | ($len >> 16)).chr(($len >> 8) & 0xFF).chr($len & 0xFF);
        } elseif ($len < 0x10000000) {
            $header = chr(0xE0 | ($len >> 24)).chr(($len >> 16) & 0xFF).chr(($len >> 8) & 0xFF).chr($len & 0xFF);
        } else {
            $header = chr(0xF0).chr(($len >> 24) & 0xFF).chr(($len >> 16) & 0xFF).chr(($len >> 8) & 0xFF).chr($len & 0xFF);
        }

        @fwrite($this->socket, $header.$word);
    }

    /**
     * Read sentence from socket.
     */
    protected function readSentence(): array
    {
        $sentence = [];
        $type = null;
        $attributes = [];

        while (true) {
            $word = $this->readWord();

            if ($word === '') {
                break;
            }

            if (str_starts_with($word, '!')) {
                $type = $word;
            } elseif (str_starts_with($word, '=')) {
                $parts = explode('=', substr($word, 1), 2);
                $key = $parts[0];
                $val = $parts[1] ?? '';
                $attributes[$key] = $val;
            } elseif (str_starts_with($word, '.tag=')) {
                $attributes['.tag'] = substr($word, 5);
            }
        }

        if ($type) {
            $sentence[$type] = $attributes;
        }

        return $sentence;
    }

    /**
     * Read single length-encoded word from socket.
     */
    protected function readWord(): string
    {
        if (! $this->socket || feof($this->socket)) {
            return '';
        }

        $byte = @fread($this->socket, 1);
        if ($byte === false || strlen($byte) === 0) {
            return '';
        }

        $c = ord($byte);
        $len = 0;

        if ($c < 0x80) {
            $len = $c;
        } elseif (($c & 0xC0) === 0x80) {
            $b2 = ord(@fread($this->socket, 1));
            $len = (($c & 0x3F) << 8) + $b2;
        } elseif (($c & 0xE0) === 0xC0) {
            $b2 = ord(@fread($this->socket, 1));
            $b3 = ord(@fread($this->socket, 1));
            $len = (($c & 0x1F) << 16) + ($b2 << 8) + $b3;
        } elseif (($c & 0xF0) === 0xE0) {
            $b2 = ord(@fread($this->socket, 1));
            $b3 = ord(@fread($this->socket, 1));
            $b4 = ord(@fread($this->socket, 1));
            $len = (($c & 0x0F) << 24) + ($b2 << 16) + ($b3 << 8) + $b4;
        } elseif (($c & 0xF8) === 0xF0) {
            $b2 = ord(@fread($this->socket, 1));
            $b3 = ord(@fread($this->socket, 1));
            $b4 = ord(@fread($this->socket, 1));
            $b5 = ord(@fread($this->socket, 1));
            $len = ($b2 << 24) + ($b3 << 16) + ($b4 << 8) + $b5;
        }

        if ($len === 0) {
            return '';
        }

        $word = '';
        $remaining = $len;

        while ($remaining > 0 && ! feof($this->socket)) {
            $chunk = @fread($this->socket, min($remaining, 8192));
            if ($chunk === false || strlen($chunk) === 0) {
                break;
            }
            $word .= $chunk;
            $remaining -= strlen($chunk);
        }

        return $word;
    }

    /**
     * Test connection and retrieve basic identity & resource info.
     */
    public function testConnection(): array
    {
        $startTime = microtime(true);

        if (! $this->connect()) {
            return [
                'success' => false,
                'latency_ms' => 0,
                'message' => $this->lastError ?? 'Could not connect to router',
                'identity' => null,
                'version' => null,
                'board_name' => null,
            ];
        }

        $latency = round((microtime(true) - $startTime) * 1000);

        try {
            $identity = $this->comm('/system/identity/print');
            $identityName = $identity[0]['name'] ?? 'MikroTik';

            $resource = $this->comm('/system/resource/print');
            $version = $resource[0]['version'] ?? 'Unknown';
            $boardName = $resource[0]['board-name'] ?? ($resource[0]['platform'] ?? 'RouterOS');

            $this->disconnect();

            return [
                'success' => true,
                'latency_ms' => $latency,
                'message' => 'Successfully connected to RouterOS',
                'identity' => $identityName,
                'version' => $version,
                'board_name' => $boardName,
            ];
        } catch (Exception $e) {
            $this->disconnect();

            return [
                'success' => false,
                'latency_ms' => $latency,
                'message' => $e->getMessage(),
                'identity' => null,
                'version' => null,
                'board_name' => null,
            ];
        }
    }

    /**
     * Get all structured dashboard information from the router.
     */
    public function getDashboardData(): array
    {
        if (! $this->connected && ! $this->connect()) {
            throw new Exception($this->lastError ?? 'Connection to Router failed');
        }

        $data = [
            'identity' => 'MikroTik',
            'resource' => [],
            'routerboard' => [],
            'interfaces' => [],
            'ip_addresses' => [],
            'dhcp_leases' => [],
            'hotspot_active' => [],
            'ppp_active' => [],
            'health' => [],
            'is_mock' => false,
        ];

        // 1. Identity
        try {
            $identityRes = $this->comm('/system/identity/print');
            $data['identity'] = $identityRes[0]['name'] ?? 'MikroTik';
        } catch (Exception $e) {
            // Ignore optional failure
        }

        // 2. Resource
        try {
            $resourceRes = $this->comm('/system/resource/print');
            $data['resource'] = $resourceRes[0] ?? [];
        } catch (Exception $e) {
            // Ignore optional failure
        }

        // 3. Routerboard details
        try {
            $rbRes = $this->comm('/system/routerboard/print');
            $data['routerboard'] = $rbRes[0] ?? [];
        } catch (Exception $e) {
            // Ignore optional failure
        }

        // 4. Interfaces
        try {
            $data['interfaces'] = $this->comm('/interface/print');
        } catch (Exception $e) {
            $data['interfaces'] = [];
        }

        // 5. IP Addresses
        try {
            $data['ip_addresses'] = $this->comm('/ip/address/print');
        } catch (Exception $e) {
            $data['ip_addresses'] = [];
        }

        // 6. DHCP Leases
        try {
            $data['dhcp_leases'] = $this->comm('/ip/dhcp-server/lease/print');
        } catch (Exception $e) {
            $data['dhcp_leases'] = [];
        }

        // 7. Hotspot Active
        try {
            $data['hotspot_active'] = $this->comm('/ip/hotspot/active/print');
        } catch (Exception $e) {
            $data['hotspot_active'] = [];
        }

        // 8. PPP Active
        try {
            $data['ppp_active'] = $this->comm('/ppp/active/print');
        } catch (Exception $e) {
            $data['ppp_active'] = [];
        }

        // 9. System Health (Voltage, Temp)
        try {
            $healthRes = $this->comm('/system/health/print');
            $data['health'] = $healthRes[0] ?? [];
        } catch (Exception $e) {
            $data['health'] = [];
        }

        return $data;
    }

    /**
     * Ping a remote host from the router.
     */
    public function ping(string $targetHost, int $count = 4): array
    {
        if (! $this->connected && ! $this->connect()) {
            throw new Exception($this->lastError ?? 'Connection to Router failed');
        }

        return $this->comm('/ping', [
            'address' => $targetHost,
            'count' => $count,
        ]);
    }

    /**
     * Reboot the router.
     */
    public function reboot(): bool
    {
        if (! $this->connected && ! $this->connect()) {
            throw new Exception($this->lastError ?? 'Connection to Router failed');
        }

        try {
            $this->comm('/system/reboot');

            return true;
        } catch (Exception $e) {
            // Router will drop connection immediately on reboot which is normal
            return true;
        }
    }

    /**
     * Get all Firewall rules: Filter, NAT, Address Lists, and Interfaces.
     */
    public function getFirewallData(): array
    {
        if (! $this->connected && ! $this->connect()) {
            throw new Exception($this->lastError ?? 'Connection to Router failed');
        }

        $data = [
            'filter_rules' => [],
            'nat_rules' => [],
            'address_lists' => [],
            'interfaces' => [],
            'is_mock' => false,
        ];

        try {
            $data['filter_rules'] = $this->comm('/ip/firewall/filter/print');
        } catch (Exception $e) {
            $data['filter_rules'] = [];
        }

        try {
            $data['nat_rules'] = $this->comm('/ip/firewall/nat/print');
        } catch (Exception $e) {
            $data['nat_rules'] = [];
        }

        try {
            $data['address_lists'] = $this->comm('/ip/firewall/address-list/print');
        } catch (Exception $e) {
            $data['address_lists'] = [];
        }

        try {
            $data['interfaces'] = $this->comm('/interface/print');
        } catch (Exception $e) {
            $data['interfaces'] = [];
        }

        return $data;
    }

    /**
     * Firewall Filter CRUD operations.
     */
    public function addFirewallFilter(array $params): array
    {
        return $this->comm('/ip/firewall/filter/add', $params);
    }

    public function setFirewallFilter(string $id, array $params): array
    {
        $params['.id'] = $id;

        return $this->comm('/ip/firewall/filter/set', $params);
    }

    public function removeFirewallFilter(string $id): array
    {
        return $this->comm('/ip/firewall/filter/remove', ['.id' => $id]);
    }

    public function toggleFirewallFilter(string $id, bool $enable): array
    {
        $action = $enable ? '/ip/firewall/filter/enable' : '/ip/firewall/filter/disable';

        return $this->comm($action, ['.id' => $id]);
    }

    /**
     * Firewall NAT CRUD operations.
     */
    public function addFirewallNat(array $params): array
    {
        return $this->comm('/ip/firewall/nat/add', $params);
    }

    public function setFirewallNat(string $id, array $params): array
    {
        $params['.id'] = $id;

        return $this->comm('/ip/firewall/nat/set', $params);
    }

    public function removeFirewallNat(string $id): array
    {
        return $this->comm('/ip/firewall/nat/remove', ['.id' => $id]);
    }

    public function toggleFirewallNat(string $id, bool $enable): array
    {
        $action = $enable ? '/ip/firewall/nat/enable' : '/ip/firewall/nat/disable';

        return $this->comm($action, ['.id' => $id]);
    }

    /**
     * Firewall Address List CRUD operations.
     */
    public function addAddressList(array $params): array
    {
        return $this->comm('/ip/firewall/address-list/add', $params);
    }

    public function setAddressList(string $id, array $params): array
    {
        $params['.id'] = $id;

        return $this->comm('/ip/firewall/address-list/set', $params);
    }

    public function removeAddressList(string $id): array
    {
        return $this->comm('/ip/firewall/address-list/remove', ['.id' => $id]);
    }

    public function toggleAddressList(string $id, bool $enable): array
    {
        $action = $enable ? '/ip/firewall/address-list/enable' : '/ip/firewall/address-list/disable';

        return $this->comm($action, ['.id' => $id]);
    }

    // ==========================================
    // PPP MANAGEMENT
    // ==========================================

    /**
     * Get all PPP Management data: secrets, active connections, profiles, and interfaces.
     */
    public function getPPPData(): array
    {
        if (! $this->connected && ! $this->connect()) {
            throw new Exception($this->lastError ?? 'Connection to Router failed');
        }

        $data = [
            'secrets' => [],
            'active_users' => [],
            'profiles' => [],
            'interfaces' => [],
            'is_mock' => false,
        ];

        try {
            $data['secrets'] = $this->comm('/ppp/secret/print');
        } catch (Exception $e) {
            $data['secrets'] = [];
        }

        try {
            $data['active_users'] = $this->comm('/ppp/active/print');
        } catch (Exception $e) {
            $data['active_users'] = [];
        }

        try {
            $data['profiles'] = $this->comm('/ppp/profile/print');
        } catch (Exception $e) {
            $data['profiles'] = [];
        }

        try {
            $data['interfaces'] = $this->comm('/interface/print');
        } catch (Exception $e) {
            $data['interfaces'] = [];
        }

        return $data;
    }

    /**
     * PPP Secret CRUD operations.
     */
    public function addPPPSecret(array $params): array
    {
        return $this->comm('/ppp/secret/add', $params);
    }

    public function setPPPSecret(string $id, array $params): array
    {
        $params['.id'] = $id;

        return $this->comm('/ppp/secret/set', $params);
    }

    public function removePPPSecret(string $id): array
    {
        return $this->comm('/ppp/secret/remove', ['.id' => $id]);
    }

    public function togglePPPSecret(string $id, bool $enable): array
    {
        $action = $enable ? '/ppp/secret/enable' : '/ppp/secret/disable';

        return $this->comm($action, ['.id' => $id]);
    }

    public function removePPPActive(string $id): array
    {
        return $this->comm('/ppp/active/remove', ['.id' => $id]);
    }

    /**
     * PPP Profile CRUD operations.
     */
    public function addPPPProfile(array $params): array
    {
        return $this->comm('/ppp/profile/add', $params);
    }

    public function setPPPProfile(string $id, array $params): array
    {
        $params['.id'] = $id;

        return $this->comm('/ppp/profile/set', $params);
    }

    public function removePPPProfile(string $id): array
    {
        return $this->comm('/ppp/profile/remove', ['.id' => $id]);
    }

    /**
     * Monitor traffic for a given interface or PPP connection.
     */
    public function getPPPTraffic(string $interfaceName): array
    {
        if (! $this->connected && ! $this->connect()) {
            throw new Exception($this->lastError ?? 'Connection to Router failed');
        }

        try {
            $res = $this->comm('/interface/monitor-traffic', [
                'interface' => $interfaceName,
                'once' => '',
            ]);
            if (isset($res[0])) {
                $rxBps = (int) ($res[0]['rx-bits-per-second'] ?? 0);
                $txBps = (int) ($res[0]['tx-bits-per-second'] ?? 0);

                return [
                    'interface' => $interfaceName,
                    'rx_bps' => $rxBps,
                    'tx_bps' => $txBps,
                    'rx_formatted' => self::formatBps($rxBps),
                    'tx_formatted' => self::formatBps($txBps),
                    'timestamp' => time(),
                ];
            }
        } catch (Exception $e) {
            // Fallback if monitor-traffic isn't supported for dynamic interface
        }

        return [
            'interface' => $interfaceName,
            'rx_bps' => 0,
            'tx_bps' => 0,
            'rx_formatted' => '0 Bps',
            'tx_formatted' => '0 Bps',
            'timestamp' => time(),
        ];
    }

    public static function formatBps(int $bps): string
    {
        if ($bps >= 1_000_000_000) {
            return round($bps / 1_000_000_000, 2).' Gbps';
        }
        if ($bps >= 1_000_000) {
            return round($bps / 1_000_000, 2).' Mbps';
        }
        if ($bps >= 1_000) {
            return round($bps / 1_000, 2).' Kbps';
        }

        return $bps.' bps';
    }

    /**
     * Provide realistic mock/demo PPP data.
     */
    public static function getMockPPPData(): array
    {
        return [
            'is_mock' => true,
            'secrets' => [
                [
                    '.id' => '*1',
                    'name' => 'pppoe_client_01',
                    'password' => 'secret123',
                    'service' => 'pppoe',
                    'profile' => '10Mbps-Home',
                    'local-address' => '10.0.0.1',
                    'remote-address' => '100.64.0.10',
                    'comment' => 'Pelanggan Rumah Pak Budi',
                    'disabled' => 'false',
                    'last-logged-out' => '2026-08-30 08:12:00',
                ],
                [
                    '.id' => '*2',
                    'name' => 'pppoe_client_02',
                    'password' => 'mypass99',
                    'service' => 'pppoe',
                    'profile' => '20Mbps-Biz',
                    'local-address' => '10.0.0.1',
                    'remote-address' => '100.64.0.11',
                    'comment' => 'Toko Kelontong Abadi',
                    'disabled' => 'false',
                    'last-logged-out' => '2026-08-28 14:05:22',
                ],
                [
                    '.id' => '*3',
                    'name' => 'vpn_admin_remote',
                    'password' => 'VpnSecure!2026',
                    'service' => 'l2tp',
                    'profile' => 'default-encryption',
                    'local-address' => '10.10.20.1',
                    'remote-address' => '10.10.20.5',
                    'comment' => 'Akses Remote Admin IT',
                    'disabled' => 'false',
                    'last-logged-out' => '2026-08-31 10:00:00',
                ],
                [
                    '.id' => '*4',
                    'name' => 'pppoe_client_03',
                    'password' => 'pass3321',
                    'service' => 'pppoe',
                    'profile' => '5Mbps-Basic',
                    'local-address' => '10.0.0.1',
                    'remote-address' => '100.64.0.12',
                    'comment' => 'Pak Joko (Isolir Temp)',
                    'disabled' => 'true',
                    'last-logged-out' => '2026-08-25 19:40:11',
                ],
                [
                    '.id' => '*5',
                    'name' => 'sstp_branch_office',
                    'password' => 'BranchPass#88',
                    'service' => 'sstp',
                    'profile' => 'default-encryption',
                    'local-address' => '172.16.1.1',
                    'remote-address' => '172.16.1.2',
                    'comment' => 'Inter-branch VPN Tunnel',
                    'disabled' => 'false',
                    'last-logged-out' => '2026-08-20 11:15:30',
                ],
            ],
            'active_users' => [
                [
                    '.id' => '*10',
                    'name' => 'pppoe_client_01',
                    'service' => 'pppoe',
                    'caller-id' => '74:83:C2:55:01:A0',
                    'address' => '100.64.0.10',
                    'uptime' => '5d 02:11:00',
                    'encoding' => 'MPPE128 stateless',
                    'session-id' => '0x81000001',
                    'radius' => 'false',
                ],
                [
                    '.id' => '*11',
                    'name' => 'pppoe_client_02',
                    'service' => 'pppoe',
                    'caller-id' => '90:4C:E5:10:99:BF',
                    'address' => '100.64.0.11',
                    'uptime' => '3d 18:40:00',
                    'encoding' => 'MPPE128 stateless',
                    'session-id' => '0x81000002',
                    'radius' => 'false',
                ],
                [
                    '.id' => '*12',
                    'name' => 'vpn_admin_remote',
                    'service' => 'l2tp',
                    'caller-id' => '180.252.112.44',
                    'address' => '10.10.20.5',
                    'uptime' => '01:45:12',
                    'encoding' => 'IPsec-SHA1-AES256',
                    'session-id' => '0x81000003',
                    'radius' => 'false',
                ],
            ],
            'profiles' => [
                ['.id' => '*1', 'name' => 'default', 'rate-limit' => ''],
                ['.id' => '*2', 'name' => 'default-encryption', 'rate-limit' => ''],
                ['.id' => '*3', 'name' => '5Mbps-Basic', 'rate-limit' => '512k/5M'],
                ['.id' => '*4', 'name' => '10Mbps-Home', 'rate-limit' => '1M/10M'],
                ['.id' => '*5', 'name' => '20Mbps-Biz', 'rate-limit' => '2M/20M'],
            ],
            'interfaces' => [
                ['name' => '<pppoe-pppoe_client_01>', 'type' => 'pppoe-in'],
                ['name' => '<pppoe-pppoe_client_02>', 'type' => 'pppoe-in'],
                ['name' => '<l2tp-vpn_admin_remote>', 'type' => 'l2tp-in'],
                ['name' => 'ether1-WAN', 'type' => 'ether'],
                ['name' => 'ether2-LAN-Master', 'type' => 'ether'],
            ],
        ];
    }

    /**
     * Provide realistic mock/demo firewall data.
     */
    public static function getMockFirewallData(): array
    {
        return [
            'is_mock' => true,
            'filter_rules' => [
                [
                    '.id' => '*1',
                    'chain' => 'input',
                    'action' => 'accept',
                    'connection-state' => 'established,related,untracked',
                    'comment' => 'defconf: accept established,related,untracked',
                    'disabled' => 'false',
                    'bytes' => '4152890',
                    'packets' => '32840',
                ],
                [
                    '.id' => '*2',
                    'chain' => 'input',
                    'action' => 'drop',
                    'connection-state' => 'invalid',
                    'comment' => 'defconf: drop invalid',
                    'disabled' => 'false',
                    'bytes' => '1420',
                    'packets' => '28',
                ],
                [
                    '.id' => '*3',
                    'chain' => 'input',
                    'action' => 'accept',
                    'protocol' => 'icmp',
                    'comment' => 'defconf: accept ICMP',
                    'disabled' => 'false',
                    'bytes' => '84200',
                    'packets' => '1200',
                ],
                [
                    '.id' => '*4',
                    'chain' => 'input',
                    'action' => 'drop',
                    'in-interface' => 'ether1-WAN',
                    'src-address-list' => '!Admin_WhiteList',
                    'comment' => 'Block non-whitelisted WAN access',
                    'disabled' => 'false',
                    'bytes' => '95420',
                    'packets' => '1520',
                ],
                [
                    '.id' => '*5',
                    'chain' => 'forward',
                    'action' => 'fasttrack-connection',
                    'connection-state' => 'established,related',
                    'comment' => 'defconf: fasttrack',
                    'disabled' => 'false',
                    'bytes' => '128450120',
                    'packets' => '984500',
                ],
                [
                    '.id' => '*6',
                    'chain' => 'forward',
                    'action' => 'accept',
                    'connection-state' => 'established,related,untracked',
                    'comment' => 'defconf: accept established,related, untracked',
                    'disabled' => 'false',
                    'bytes' => '5401200',
                    'packets' => '42000',
                ],
                [
                    '.id' => '*7',
                    'chain' => 'forward',
                    'action' => 'drop',
                    'src-address-list' => 'Blocked_Scanners',
                    'comment' => 'Drop malicious scanners',
                    'disabled' => 'false',
                    'bytes' => '12800',
                    'packets' => '180',
                ],
            ],
            'nat_rules' => [
                [
                    '.id' => '*1',
                    'chain' => 'srcnat',
                    'action' => 'masquerade',
                    'out-interface' => 'ether1-WAN',
                    'comment' => 'defconf: masquerade (Internet Sharing)',
                    'disabled' => 'false',
                    'bytes' => '195820400',
                    'packets' => '1284900',
                ],
                [
                    '.id' => '*2',
                    'chain' => 'dstnat',
                    'action' => 'dst-nat',
                    'protocol' => 'tcp',
                    'in-interface' => 'ether1-WAN',
                    'dst-port' => '8080',
                    'to-addresses' => '192.168.88.35',
                    'to-ports' => '80',
                    'comment' => 'Web Server Port Forward (WAN 8080 -> LAN 80)',
                    'disabled' => 'false',
                    'bytes' => '1420500',
                    'packets' => '9800',
                ],
                [
                    '.id' => '*3',
                    'chain' => 'dstnat',
                    'action' => 'dst-nat',
                    'protocol' => 'tcp',
                    'in-interface' => 'ether1-WAN',
                    'dst-port' => '2222',
                    'to-addresses' => '192.168.88.15',
                    'to-ports' => '22',
                    'comment' => 'Admin SSH Forwarding',
                    'disabled' => 'true',
                    'bytes' => '0',
                    'packets' => '0',
                ],
            ],
            'address_lists' => [
                [
                    '.id' => '*1',
                    'list' => 'Admin_WhiteList',
                    'address' => '192.168.88.15',
                    'comment' => 'Admin Workstation',
                    'disabled' => 'false',
                    'creation-time' => '2026-08-01 10:00:00',
                ],
                [
                    '.id' => '*2',
                    'list' => 'Admin_WhiteList',
                    'address' => '103.140.22.19',
                    'comment' => 'Office Remote Static IP',
                    'disabled' => 'false',
                    'creation-time' => '2026-08-05 14:22:10',
                ],
                [
                    '.id' => '*3',
                    'list' => 'Blocked_Scanners',
                    'address' => '45.154.255.88',
                    'timeout' => '6d 22:15:00',
                    'comment' => 'Port scanner detected',
                    'disabled' => 'false',
                    'creation-time' => '2026-08-18 04:12:30',
                ],
                [
                    '.id' => '*4',
                    'list' => 'Blocked_Scanners',
                    'address' => '185.220.101.5',
                    'timeout' => '2d 11:40:00',
                    'comment' => 'SSH brute-force',
                    'disabled' => 'false',
                    'creation-time' => '2026-08-19 18:05:12',
                ],
                [
                    '.id' => '*5',
                    'list' => 'Local_Networks',
                    'address' => '192.168.88.0/24',
                    'comment' => 'Office LAN Range',
                    'disabled' => 'false',
                    'creation-time' => '2026-08-01 08:00:00',
                ],
            ],
            'interfaces' => [
                ['name' => 'ether1-WAN'],
                ['name' => 'ether2-LAN-Master'],
                ['name' => 'ether3-Hotspot'],
                ['name' => 'ether4-Server'],
                ['name' => 'ether5-Backup'],
                ['name' => 'bridge-local'],
            ],
        ];
    }

    /**
     * Provide realistic mock/demo dashboard data for testing when physical router is offline.
     */
    public static function getMockDashboardData(string $name = 'Demo MikroTik Router', string $host = '192.168.88.1'): array
    {
        return [
            'identity' => $name,
            'is_mock' => true,
            'resource' => [
                'uptime' => '14d 06:42:19',
                'version' => '7.15.3 (stable)',
                'build-time' => '2025-06-12 11:20:00',
                'free-memory' => (string) (184 * 1024 * 1024),
                'total-memory' => (string) (256 * 1024 * 1024),
                'cpu' => 'MIPS 1004Kc V2.15',
                'cpu-count' => '4',
                'cpu-frequency' => '880',
                'cpu-load' => (string) rand(8, 38),
                'free-hdd-space' => (string) (12.4 * 1024 * 1024),
                'total-hdd-space' => (string) (16.0 * 1024 * 1024),
                'architecture-name' => 'mmips',
                'board-name' => 'hEX (RB750Gr3)',
                'platform' => 'MikroTik',
            ],
            'routerboard' => [
                'routerboard' => 'true',
                'model' => 'RB750Gr3',
                'serial-number' => 'E4280C51D90A',
                'current-firmware' => '7.15.3',
                'upgrade-firmware' => '7.15.3',
            ],
            'health' => [
                'voltage' => '24.2',
                'temperature' => '42',
            ],
            'interfaces' => [
                [
                    'name' => 'ether1-WAN',
                    'type' => 'ether',
                    'running' => 'true',
                    'disabled' => 'false',
                    'mac-address' => '48:8F:5A:11:22:01',
                    'rx-byte' => (string) (1420950200 + rand(1000, 50000)),
                    'tx-byte' => (string) (489201400 + rand(1000, 20000)),
                    'rx-packet' => '1420950',
                    'tx-packet' => '489201',
                    'comment' => 'ISP Fiber Uplink',
                ],
                [
                    'name' => 'ether2-LAN-Master',
                    'type' => 'ether',
                    'running' => 'true',
                    'disabled' => 'false',
                    'mac-address' => '48:8F:5A:11:22:02',
                    'rx-byte' => (string) (510200400 + rand(1000, 30000)),
                    'tx-byte' => (string) (1380900200 + rand(1000, 60000)),
                    'rx-packet' => '510200',
                    'tx-packet' => '1380900',
                    'comment' => 'Switch Core',
                ],
                [
                    'name' => 'ether3-Hotspot',
                    'type' => 'ether',
                    'running' => 'true',
                    'disabled' => 'false',
                    'mac-address' => '48:8F:5A:11:22:03',
                    'rx-byte' => '245100900',
                    'tx-byte' => '620100400',
                    'rx-packet' => '245100',
                    'tx-packet' => '620100',
                    'comment' => 'AP Access Point',
                ],
                [
                    'name' => 'ether4-Server',
                    'type' => 'ether',
                    'running' => 'true',
                    'disabled' => 'false',
                    'mac-address' => '48:8F:5A:11:22:04',
                    'rx-byte' => '8500200',
                    'tx-byte' => '12400500',
                    'rx-packet' => '8500',
                    'tx-packet' => '12400',
                    'comment' => 'Local Server',
                ],
                [
                    'name' => 'ether5-Backup',
                    'type' => 'ether',
                    'running' => 'false',
                    'disabled' => 'false',
                    'mac-address' => '48:8F:5A:11:22:05',
                    'rx-byte' => '0',
                    'tx-byte' => '0',
                    'rx-packet' => '0',
                    'tx-packet' => '0',
                    'comment' => 'Spare Port',
                ],
                [
                    'name' => 'bridge-local',
                    'type' => 'bridge',
                    'running' => 'true',
                    'disabled' => 'false',
                    'mac-address' => '48:8F:5A:11:22:02',
                    'rx-byte' => '760000000',
                    'tx-byte' => '2010000000',
                    'rx-packet' => '760000',
                    'tx-packet' => '2010000',
                    'comment' => 'Main Local Bridge',
                ],
            ],
            'ip_addresses' => [
                ['address' => '103.140.22.18/29', 'network' => '103.140.22.16', 'interface' => 'ether1-WAN'],
                ['address' => '192.168.88.1/24', 'network' => '192.168.88.0', 'interface' => 'bridge-local'],
                ['address' => '10.10.10.1/24', 'network' => '10.10.10.0', 'interface' => 'ether3-Hotspot'],
            ],
            'dhcp_leases' => [
                ['address' => '192.168.88.10', 'mac-address' => 'E8:84:A5:10:44:B2', 'host-name' => 'MacBook-Pro', 'status' => 'bound', 'expires-after' => '2d 18:20:10'],
                ['address' => '192.168.88.15', 'mac-address' => '70:85:C2:59:12:F1', 'host-name' => 'Admin-PC', 'status' => 'bound', 'expires-after' => '1d 12:05:44'],
                ['address' => '192.168.88.22', 'mac-address' => 'BC:D0:74:3E:AA:99', 'host-name' => 'Printer-Epson-L3150', 'status' => 'bound', 'expires-after' => '2d 23:59:00'],
                ['address' => '192.168.88.35', 'mac-address' => '00:11:32:9C:12:33', 'host-name' => 'Synology-NAS', 'status' => 'bound', 'expires-after' => '2d 20:12:00'],
                ['address' => '192.168.88.50', 'mac-address' => 'AC:12:03:DD:EE:77', 'host-name' => 'Samsung-S24-Ultra', 'status' => 'bound', 'expires-after' => '0d 05:40:12'],
            ],
            'hotspot_active' => [
                ['user' => 'voucher_1hour_01', 'address' => '10.10.10.15', 'mac-address' => 'D4:F5:47:88:1A:22', 'uptime' => '00:42:10', 'bytes-in' => '45120000', 'bytes-out' => '182900000'],
                ['user' => 'voucher_daily_09', 'address' => '10.10.10.18', 'mac-address' => 'F0:99:B6:11:45:C3', 'uptime' => '04:12:00', 'bytes-in' => '120500000', 'bytes-out' => '650100000'],
                ['user' => 'staff_budi', 'address' => '10.10.10.25', 'mac-address' => '9C:35:EB:23:44:11', 'uptime' => '07:30:22', 'bytes-in' => '310400000', 'bytes-out' => '1250000000'],
            ],
            'ppp_active' => [
                ['name' => 'pppoe_user_home1', 'service' => 'pppoe', 'caller-id' => '74:83:C2:55:01:A0', 'address' => '100.64.0.10', 'uptime' => '5d 02:11:00'],
                ['name' => 'pppoe_user_home2', 'service' => 'pppoe', 'caller-id' => '90:4C:E5:10:99:BF', 'address' => '100.64.0.11', 'uptime' => '3d 18:40:00'],
            ],
        ];
    }

    /**
     * Disconnect and close the socket.
     */
    public function disconnect(): void
    {
        if ($this->socket) {
            @fclose($this->socket);
            $this->socket = null;
        }
        $this->connected = false;
    }

    public function __destruct()
    {
        $this->disconnect();
    }

    public function isConnected(): bool
    {
        return $this->connected;
    }

    public function getLastError(): ?string
    {
        return $this->lastError;
    }
}
