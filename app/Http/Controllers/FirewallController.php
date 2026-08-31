<?php

namespace App\Http\Controllers;

use App\Models\Router;
use App\Services\RouterOSService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FirewallController extends Controller
{
    /**
     * Display the main Firewall Management page (Filter Rules, NAT, Address Lists).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $routers = $user ? $user->routers()->orderBy('name')->get() : collect();

        $activeRouterId = session('active_router_id');
        $activeRouter = null;

        if ($activeRouterId) {
            $activeRouter = $routers->firstWhere('id', $activeRouterId);
        }

        if (!$activeRouter) {
            $activeRouter = $routers->firstWhere('is_active', true);
        }

        $firewallData = null;
        $connectionError = null;

        if ($activeRouter) {
            try {
                if (str_contains(strtolower($activeRouter->host), 'demo') || $activeRouter->host === '127.0.0.1' || $activeRouter->connection_type === 'mock') {
                    $firewallData = RouterOSService::getMockFirewallData();
                } else {
                    $service = $activeRouter->getService(4);
                    $firewallData = $service->getFirewallData();
                }
            } catch (Exception $e) {
                $connectionError = $e->getMessage();
                $firewallData = RouterOSService::getMockFirewallData();
                $firewallData['connection_failed'] = true;
                $firewallData['error_message'] = $connectionError;
            }
        }

        return Inertia::render('firewall/Index', [
            'activeRouter' => $activeRouter ? [
                'id' => $activeRouter->id,
                'name' => $activeRouter->name,
                'host' => $activeRouter->host,
                'port' => $activeRouter->port,
                'username' => $activeRouter->username,
                'use_ssl' => $activeRouter->use_ssl,
                'status' => $activeRouter->status,
                'is_active' => $activeRouter->is_active,
                'last_connected_at' => $activeRouter->last_connected_at?->toIso8601String(),
                'last_error' => $activeRouter->last_error,
            ] : null,
            'routers' => $routers->map(fn (Router $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'host' => $r->host,
                'port' => $r->port,
                'username' => $r->username,
                'use_ssl' => $r->use_ssl,
                'status' => $r->status,
                'is_active' => (bool) $r->is_active,
                'last_connected_at' => $r->last_connected_at?->diffForHumans(),
                'last_error' => $r->last_error,
            ]),
            'firewallData' => $firewallData,
            'connectionError' => $connectionError,
        ]);
    }

    /**
     * Poll live firewall dataset (for fast updates).
     */
    public function getStats(Request $request): JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return response()->json(['error' => 'No active router'], 404);
        }

        try {
            if (str_contains(strtolower($router->host), 'demo') || $router->host === '127.0.0.1') {
                return response()->json(RouterOSService::getMockFirewallData());
            }

            $service = $router->getService(4);
            $data = $service->getFirewallData();
            return response()->json($data);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ==========================================
    // FILTER RULES
    // ==========================================

    public function storeFilter(Request $request): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'chain' => 'required|string|max:64',
            'action' => 'required|string|max:64',
            'protocol' => 'nullable|string|max:32',
            'src_address' => 'nullable|string|max:64',
            'dst_address' => 'nullable|string|max:64',
            'src_port' => 'nullable|string|max:64',
            'dst_port' => 'nullable|string|max:64',
            'in_interface' => 'nullable|string|max:64',
            'out_interface' => 'nullable|string|max:64',
            'src_address_list' => 'nullable|string|max:64',
            'dst_address_list' => 'nullable|string|max:64',
            'connection_state' => 'nullable|string|max:128',
            'comment' => 'nullable|string|max:255',
            'disabled' => 'nullable|boolean',
            'log' => 'nullable|boolean',
        ]);

        $params = [
            'chain' => $validated['chain'],
            'action' => $validated['action'],
        ];

        if (!empty($validated['protocol'])) $params['protocol'] = $validated['protocol'];
        if (!empty($validated['src_address'])) $params['src-address'] = $validated['src_address'];
        if (!empty($validated['dst_address'])) $params['dst-address'] = $validated['dst_address'];
        if (!empty($validated['src_port'])) $params['src-port'] = $validated['src_port'];
        if (!empty($validated['dst_port'])) $params['dst-port'] = $validated['dst_port'];
        if (!empty($validated['in_interface'])) $params['in-interface'] = $validated['in_interface'];
        if (!empty($validated['out_interface'])) $params['out-interface'] = $validated['out_interface'];
        if (!empty($validated['src_address_list'])) $params['src-address-list'] = $validated['src_address_list'];
        if (!empty($validated['dst_address_list'])) $params['dst-address-list'] = $validated['dst_address_list'];
        if (!empty($validated['connection_state'])) $params['connection-state'] = $validated['connection_state'];
        if (!empty($validated['comment'])) $params['comment'] = $validated['comment'];
        if ($request->has('disabled')) $params['disabled'] = $request->boolean('disabled') ? 'yes' : 'no';
        if ($request->has('log')) $params['log'] = $request->boolean('log') ? 'yes' : 'no';

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->addFirewallFilter($params);
            }
            return redirect()->back()->with('success', 'Firewall Filter Rule added successfully!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to add filter rule: ' . $e->getMessage()]);
        }
    }

    public function updateFilter(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'chain' => 'required|string|max:64',
            'action' => 'required|string|max:64',
            'protocol' => 'nullable|string|max:32',
            'src_address' => 'nullable|string|max:64',
            'dst_address' => 'nullable|string|max:64',
            'src_port' => 'nullable|string|max:64',
            'dst_port' => 'nullable|string|max:64',
            'in_interface' => 'nullable|string|max:64',
            'out_interface' => 'nullable|string|max:64',
            'src_address_list' => 'nullable|string|max:64',
            'dst_address_list' => 'nullable|string|max:64',
            'connection_state' => 'nullable|string|max:128',
            'comment' => 'nullable|string|max:255',
            'disabled' => 'nullable|boolean',
        ]);

        $params = [
            'chain' => $validated['chain'],
            'action' => $validated['action'],
            'protocol' => $validated['protocol'] ?? '',
            'src-address' => $validated['src_address'] ?? '',
            'dst-address' => $validated['dst_address'] ?? '',
            'src-port' => $validated['src_port'] ?? '',
            'dst-port' => $validated['dst_port'] ?? '',
            'in-interface' => $validated['in_interface'] ?? '',
            'out-interface' => $validated['out_interface'] ?? '',
            'src-address-list' => $validated['src_address_list'] ?? '',
            'dst-address-list' => $validated['dst_address_list'] ?? '',
            'connection-state' => $validated['connection_state'] ?? '',
            'comment' => $validated['comment'] ?? '',
        ];

        if ($request->has('disabled')) {
            $params['disabled'] = $request->boolean('disabled') ? 'yes' : 'no';
        }

        // Clean up empty params
        $params = array_filter($params, fn($v) => $v !== '');

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->setFirewallFilter($id, $params);
            }
            return redirect()->back()->with('success', 'Firewall Filter Rule updated successfully!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update filter rule: ' . $e->getMessage()]);
        }
    }

    public function deleteFilter(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->removeFirewallFilter($id);
            }
            return redirect()->back()->with('success', 'Firewall Filter Rule deleted.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to remove filter rule: ' . $e->getMessage()]);
        }
    }

    public function toggleFilter(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $enable = $request->boolean('enable', true);

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->toggleFirewallFilter($id, $enable);
            }
            $statusStr = $enable ? 'enabled' : 'disabled';
            return redirect()->back()->with('success', "Filter Rule {$statusStr}.");
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to toggle filter rule: ' . $e->getMessage()]);
        }
    }

    // ==========================================
    // NAT RULES
    // ==========================================

    public function storeNat(Request $request): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'chain' => 'required|string|max:64',
            'action' => 'required|string|max:64',
            'protocol' => 'nullable|string|max:32',
            'src_address' => 'nullable|string|max:64',
            'dst_address' => 'nullable|string|max:64',
            'src_port' => 'nullable|string|max:64',
            'dst_port' => 'nullable|string|max:64',
            'in_interface' => 'nullable|string|max:64',
            'out_interface' => 'nullable|string|max:64',
            'to_addresses' => 'nullable|string|max:64',
            'to_ports' => 'nullable|string|max:64',
            'comment' => 'nullable|string|max:255',
            'disabled' => 'nullable|boolean',
        ]);

        $params = [
            'chain' => $validated['chain'],
            'action' => $validated['action'],
        ];

        if (!empty($validated['protocol'])) $params['protocol'] = $validated['protocol'];
        if (!empty($validated['src_address'])) $params['src-address'] = $validated['src_address'];
        if (!empty($validated['dst_address'])) $params['dst-address'] = $validated['dst_address'];
        if (!empty($validated['src_port'])) $params['src-port'] = $validated['src_port'];
        if (!empty($validated['dst_port'])) $params['dst-port'] = $validated['dst_port'];
        if (!empty($validated['in_interface'])) $params['in-interface'] = $validated['in_interface'];
        if (!empty($validated['out_interface'])) $params['out-interface'] = $validated['out_interface'];
        if (!empty($validated['to_addresses'])) $params['to-addresses'] = $validated['to_addresses'];
        if (!empty($validated['to_ports'])) $params['to-ports'] = $validated['to_ports'];
        if (!empty($validated['comment'])) $params['comment'] = $validated['comment'];
        if ($request->has('disabled')) $params['disabled'] = $request->boolean('disabled') ? 'yes' : 'no';

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->addFirewallNat($params);
            }
            return redirect()->back()->with('success', 'Firewall NAT Rule added successfully!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to add NAT rule: ' . $e->getMessage()]);
        }
    }

    public function updateNat(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'chain' => 'required|string|max:64',
            'action' => 'required|string|max:64',
            'protocol' => 'nullable|string|max:32',
            'src_address' => 'nullable|string|max:64',
            'dst_address' => 'nullable|string|max:64',
            'src_port' => 'nullable|string|max:64',
            'dst_port' => 'nullable|string|max:64',
            'in_interface' => 'nullable|string|max:64',
            'out_interface' => 'nullable|string|max:64',
            'to_addresses' => 'nullable|string|max:64',
            'to_ports' => 'nullable|string|max:64',
            'comment' => 'nullable|string|max:255',
            'disabled' => 'nullable|boolean',
        ]);

        $params = [
            'chain' => $validated['chain'],
            'action' => $validated['action'],
            'protocol' => $validated['protocol'] ?? '',
            'src-address' => $validated['src_address'] ?? '',
            'dst-address' => $validated['dst_address'] ?? '',
            'src-port' => $validated['src_port'] ?? '',
            'dst-port' => $validated['dst_port'] ?? '',
            'in-interface' => $validated['in_interface'] ?? '',
            'out-interface' => $validated['out_interface'] ?? '',
            'to-addresses' => $validated['to_addresses'] ?? '',
            'to-ports' => $validated['to_ports'] ?? '',
            'comment' => $validated['comment'] ?? '',
        ];

        if ($request->has('disabled')) {
            $params['disabled'] = $request->boolean('disabled') ? 'yes' : 'no';
        }

        $params = array_filter($params, fn($v) => $v !== '');

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->setFirewallNat($id, $params);
            }
            return redirect()->back()->with('success', 'Firewall NAT Rule updated successfully!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update NAT rule: ' . $e->getMessage()]);
        }
    }

    public function deleteNat(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->removeFirewallNat($id);
            }
            return redirect()->back()->with('success', 'Firewall NAT Rule deleted.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to remove NAT rule: ' . $e->getMessage()]);
        }
    }

    public function toggleNat(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $enable = $request->boolean('enable', true);

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->toggleFirewallNat($id, $enable);
            }
            $statusStr = $enable ? 'enabled' : 'disabled';
            return redirect()->back()->with('success', "NAT Rule {$statusStr}.");
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to toggle NAT rule: ' . $e->getMessage()]);
        }
    }

    // ==========================================
    // ADDRESS LISTS
    // ==========================================

    public function storeAddress(Request $request): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'list' => 'required|string|max:64',
            'address' => 'required|string|max:255',
            'timeout' => 'nullable|string|max:64',
            'comment' => 'nullable|string|max:255',
            'disabled' => 'nullable|boolean',
        ]);

        $params = [
            'list' => $validated['list'],
            'address' => $validated['address'],
        ];

        if (!empty($validated['timeout'])) $params['timeout'] = $validated['timeout'];
        if (!empty($validated['comment'])) $params['comment'] = $validated['comment'];
        if ($request->has('disabled')) $params['disabled'] = $request->boolean('disabled') ? 'yes' : 'no';

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->addAddressList($params);
            }
            return redirect()->back()->with('success', 'Address List entry added successfully!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to add address list entry: ' . $e->getMessage()]);
        }
    }

    public function updateAddress(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'list' => 'required|string|max:64',
            'address' => 'required|string|max:255',
            'timeout' => 'nullable|string|max:64',
            'comment' => 'nullable|string|max:255',
            'disabled' => 'nullable|boolean',
        ]);

        $params = [
            'list' => $validated['list'],
            'address' => $validated['address'],
            'timeout' => $validated['timeout'] ?? '',
            'comment' => $validated['comment'] ?? '',
        ];

        if ($request->has('disabled')) {
            $params['disabled'] = $request->boolean('disabled') ? 'yes' : 'no';
        }

        $params = array_filter($params, fn($v) => $v !== '');

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->setAddressList($id, $params);
            }
            return redirect()->back()->with('success', 'Address List entry updated successfully!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update address list entry: ' . $e->getMessage()]);
        }
    }

    public function deleteAddress(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->removeAddressList($id);
            }
            return redirect()->back()->with('success', 'Address List entry removed.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to remove address list entry: ' . $e->getMessage()]);
        }
    }

    public function toggleAddress(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (!$router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $enable = $request->boolean('enable', true);

        try {
            if (!$this->isMock($router)) {
                $service = $router->getService();
                $service->toggleAddressList($id, $enable);
            }
            $statusStr = $enable ? 'enabled' : 'disabled';
            return redirect()->back()->with('success', "Address List entry {$statusStr}.");
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to toggle address list: ' . $e->getMessage()]);
        }
    }

    /**
     * Resolve active router from user session or database.
     */
    protected function getActiveRouter(Request $request): ?Router
    {
        $user = $request->user();
        if (!$user) return null;

        $activeRouterId = session('active_router_id');
        if ($activeRouterId) {
            $router = $user->routers()->find($activeRouterId);
            if ($router) return $router;
        }

        return $user->routers()->where('is_active', true)->first();
    }

    /**
     * Check if router is demo or mock.
     */
    protected function isMock(Router $router): bool
    {
        return str_contains(strtolower($router->host), 'demo') 
            || $router->host === '127.0.0.1' 
            || $router->connection_type === 'mock';
    }
}
