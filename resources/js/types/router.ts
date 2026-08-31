export interface Router {
    id: number;
    name: string;
    host: string;
    port: number;
    username: string;
    use_ssl: boolean;
    status: 'connected' | 'disconnected' | 'error';
    is_active: boolean;
    last_connected_at?: string | null;
    last_error?: string | null;
    created_at?: string;
}

export interface RouterSystemResource {
    uptime?: string;
    version?: string;
    'build-time'?: string;
    'free-memory'?: string;
    'total-memory'?: string;
    cpu?: string;
    'cpu-count'?: string;
    'cpu-frequency'?: string;
    'cpu-load'?: string;
    'free-hdd-space'?: string;
    'total-hdd-space'?: string;
    'architecture-name'?: string;
    'board-name'?: string;
    platform?: string;
}

export interface RouterBoard {
    routerboard?: string;
    model?: string;
    'serial-number'?: string;
    'current-firmware'?: string;
    'upgrade-firmware'?: string;
}

export interface RouterHealth {
    voltage?: string;
    temperature?: string;
}

export interface RouterInterface {
    name: string;
    type: string;
    running: string | boolean;
    disabled: string | boolean;
    'mac-address'?: string;
    'rx-byte'?: string | number;
    'tx-byte'?: string | number;
    'rx-packet'?: string | number;
    'tx-packet'?: string | number;
    comment?: string;
}

export interface RouterIpAddress {
    address: string;
    network?: string;
    interface: string;
}

export interface RouterDhcpLease {
    address: string;
    'mac-address': string;
    'host-name'?: string;
    status?: string;
    'expires-after'?: string;
}

export interface RouterHotspotUser {
    user: string;
    address: string;
    'mac-address'?: string;
    uptime?: string;
    'bytes-in'?: string | number;
    'bytes-out'?: string | number;
}

export interface RouterPppUser {
    name: string;
    service?: string;
    'caller-id'?: string;
    address?: string;
    uptime?: string;
}

export interface RouterDashboardData {
    identity: string;
    resource: RouterSystemResource;
    routerboard: RouterBoard;
    health?: RouterHealth;
    interfaces: RouterInterface[];
    ip_addresses: RouterIpAddress[];
    dhcp_leases: RouterDhcpLease[];
    hotspot_active: RouterHotspotUser[];
    ppp_active: RouterPppUser[];
    is_mock?: boolean;
    connection_failed?: boolean;
    error_message?: string;
}

export interface FirewallFilterRule {
    '.id'?: string;
    chain: string;
    action: string;
    protocol?: string;
    'src-address'?: string;
    'dst-address'?: string;
    'src-port'?: string;
    'dst-port'?: string;
    'in-interface'?: string;
    'out-interface'?: string;
    'src-address-list'?: string;
    'dst-address-list'?: string;
    'connection-state'?: string;
    log?: string | boolean;
    'log-prefix'?: string;
    comment?: string;
    disabled?: string | boolean;
    invalid?: string | boolean;
    dynamic?: string | boolean;
    bytes?: string | number;
    packets?: string | number;
}

export interface FirewallNatRule {
    '.id'?: string;
    chain: string;
    action: string;
    protocol?: string;
    'src-address'?: string;
    'dst-address'?: string;
    'src-port'?: string;
    'dst-port'?: string;
    'in-interface'?: string;
    'out-interface'?: string;
    'to-addresses'?: string;
    'to-ports'?: string;
    log?: string | boolean;
    'log-prefix'?: string;
    comment?: string;
    disabled?: string | boolean;
    invalid?: string | boolean;
    dynamic?: string | boolean;
    bytes?: string | number;
    packets?: string | number;
}

export interface FirewallAddressList {
    '.id'?: string;
    list: string;
    address: string;
    timeout?: string;
    'creation-time'?: string;
    comment?: string;
    disabled?: string | boolean;
    dynamic?: string | boolean;
}

export interface FirewallData {
    filter_rules: FirewallFilterRule[];
    nat_rules: FirewallNatRule[];
    address_lists: FirewallAddressList[];
    interfaces: Array<{ name: string }>;
    is_mock?: boolean;
    connection_failed?: boolean;
    error_message?: string;
}

export interface PPPSecret {
    '.id'?: string;
    name: string;
    password?: string;
    service?: string;
    profile?: string;
    'local-address'?: string;
    'remote-address'?: string;
    comment?: string;
    disabled?: string | boolean;
    'last-logged-out'?: string;
    routes?: string;
}

export interface PPPActive {
    '.id'?: string;
    name: string;
    service?: string;
    'caller-id'?: string;
    address?: string;
    uptime?: string;
    encoding?: string;
    'session-id'?: string;
    'limit-bytes-in'?: string | number;
    'limit-bytes-out'?: string | number;
    radius?: string | boolean;
}

export interface PPPProfile {
    '.id'?: string;
    name: string;
    'local-address'?: string;
    'remote-address'?: string;
    'rate-limit'?: string;
    'only-one'?: string | boolean;
    'dns-server'?: string;
    'use-encryption'?: string | boolean;
    comment?: string;
}

export interface PPPData {
    secrets: PPPSecret[];
    active_users: PPPActive[];
    profiles: PPPProfile[];
    interfaces: Array<{ name: string; type?: string }>;
    is_mock?: boolean;
    connection_failed?: boolean;
    error_message?: string;
}

export interface PPPTrafficData {
    interface: string;
    rx_bps: number;
    tx_bps: number;
    rx_formatted: string;
    tx_formatted: string;
    timestamp: number;
}


