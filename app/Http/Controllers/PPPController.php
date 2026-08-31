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

class PPPController extends Controller
{
    /**
     * Helper to get active router.
     */
    protected function getActiveRouter(Request $request): ?Router
    {
        $user = $request->user();
        if (! $user) {
            return null;
        }

        $routers = $user->routers()->get();
        $activeRouterId = session('active_router_id');

        if ($activeRouterId) {
            $active = $routers->firstWhere('id', $activeRouterId);
            if ($active) {
                return $active;
            }
        }

        return $routers->firstWhere('is_active', true) ?? $routers->first();
    }

    /**
     * Display the PPP Management page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $routers = $user ? $user->routers()->orderBy('name')->get() : collect();

        $activeRouter = $this->getActiveRouter($request);
        $pppData = null;
        $connectionError = null;

        if ($activeRouter) {
            try {
                if (str_contains(strtolower($activeRouter->host), 'demo') || $activeRouter->host === '127.0.0.1' || $activeRouter->connection_type === 'mock') {
                    $pppData = RouterOSService::getMockPPPData();
                } else {
                    $service = $activeRouter->getService(4);
                    $pppData = $service->getPPPData();
                }
            } catch (Exception $e) {
                $connectionError = $e->getMessage();
                $pppData = RouterOSService::getMockPPPData();
                $pppData['connection_failed'] = true;
                $pppData['error_message'] = $connectionError;
            }
        }

        return Inertia::render('ppp/Index', [
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
            'pppData' => $pppData,
            'connectionError' => $connectionError,
        ]);
    }

    /**
     * Poll live PPP dataset (fast polling).
     */
    public function getStats(Request $request): JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return response()->json(['error' => 'No active router'], 404);
        }

        try {
            if (str_contains(strtolower($router->host), 'demo') || $router->host === '127.0.0.1' || $router->connection_type === 'mock') {
                return response()->json(RouterOSService::getMockPPPData());
            }

            $service = $router->getService(4);
            $data = $service->getPPPData();

            return response()->json($data);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Add a new PPP Secret user.
     */
    public function storeSecret(Request $request): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:64',
            'password' => 'required|string|max:64',
            'service' => 'nullable|string|max:32',
            'profile' => 'nullable|string|max:64',
            'local_address' => 'nullable|string|max:64',
            'remote_address' => 'nullable|string|max:64',
            'comment' => 'nullable|string|max:255',
            'disabled' => 'nullable|boolean',
        ]);

        $params = [
            'name' => $validated['name'],
            'password' => $validated['password'],
            'service' => $validated['service'] ?? 'any',
            'profile' => $validated['profile'] ?? 'default',
        ];

        if (! empty($validated['local_address'])) {
            $params['local-address'] = $validated['local_address'];
        }
        if (! empty($validated['remote_address'])) {
            $params['remote-address'] = $validated['remote_address'];
        }
        if (! empty($validated['comment'])) {
            $params['comment'] = $validated['comment'];
        }
        if (isset($validated['disabled'])) {
            $params['disabled'] = $validated['disabled'] ? 'yes' : 'no';
        }

        try {
            if (! str_contains(strtolower($router->host), 'demo') && $router->host !== '127.0.0.1') {
                $service = $router->getService(5);
                $service->addPPPSecret($params);
            }

            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'PPP Secret user created successfully!']);
            }

            return redirect()->back()->with('success', 'PPP Secret user created successfully!');
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to create PPP Secret: '.$e->getMessage()]);
        }
    }

    /**
     * Update an existing PPP Secret user.
     */
    public function updateSecret(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:64',
            'password' => 'nullable|string|max:64',
            'service' => 'nullable|string|max:32',
            'profile' => 'nullable|string|max:64',
            'local_address' => 'nullable|string|max:64',
            'remote_address' => 'nullable|string|max:64',
            'comment' => 'nullable|string|max:255',
            'disabled' => 'nullable|boolean',
        ]);

        $params = [
            'name' => $validated['name'],
            'service' => $validated['service'] ?? 'any',
            'profile' => $validated['profile'] ?? 'default',
        ];

        if (! empty($validated['password'])) {
            $params['password'] = $validated['password'];
        }
        if (! empty($validated['local_address'])) {
            $params['local-address'] = $validated['local_address'];
        }
        if (! empty($validated['remote_address'])) {
            $params['remote-address'] = $validated['remote_address'];
        }
        if (array_key_exists('comment', $validated)) {
            $params['comment'] = $validated['comment'] ?? '';
        }
        if (isset($validated['disabled'])) {
            $params['disabled'] = $validated['disabled'] ? 'yes' : 'no';
        }

        try {
            if (! str_contains(strtolower($router->host), 'demo') && $router->host !== '127.0.0.1') {
                $service = $router->getService(5);
                $service->setPPPSecret($id, $params);
            }

            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'PPP Secret updated successfully!']);
            }

            return redirect()->back()->with('success', 'PPP Secret updated successfully!');
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to update PPP Secret: '.$e->getMessage()]);
        }
    }

    /**
     * Delete a PPP Secret user.
     */
    public function deleteSecret(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        try {
            if (! str_contains(strtolower($router->host), 'demo') && $router->host !== '127.0.0.1') {
                $service = $router->getService(5);
                $service->removePPPSecret($id);
            }

            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'PPP Secret deleted successfully!']);
            }

            return redirect()->back()->with('success', 'PPP Secret deleted successfully!');
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to delete PPP Secret: '.$e->getMessage()]);
        }
    }

    /**
     * Enable/Disable a PPP Secret user.
     */
    public function toggleSecret(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'enable' => 'required|boolean',
        ]);

        try {
            if (! str_contains(strtolower($router->host), 'demo') && $router->host !== '127.0.0.1') {
                $service = $router->getService(5);
                $service->togglePPPSecret($id, $validated['enable']);
            }

            if ($request->wantsJson()) {
                return response()->json(['success' => true]);
            }

            return redirect()->back()->with('success', 'PPP Secret status updated.');
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to toggle PPP Secret: '.$e->getMessage()]);
        }
    }

    /**
     * Disconnect / Kick a PPP Active user session.
     */
    public function disconnectActive(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        try {
            if (! str_contains(strtolower($router->host), 'demo') && $router->host !== '127.0.0.1') {
                $service = $router->getService(5);
                $service->removePPPActive($id);
            }

            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'Active PPP session disconnected.']);
            }

            return redirect()->back()->with('success', 'Active PPP session disconnected.');
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to disconnect session: '.$e->getMessage()]);
        }
    }

    /**
     * Real-time traffic monitoring for PPP interfaces/users.
     */
    public function getTraffic(Request $request): JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return response()->json(['error' => 'No active router'], 404);
        }

        $interfaceName = $request->query('interface', 'ether1-WAN');

        try {
            if (str_contains(strtolower($router->host), 'demo') || $router->host === '127.0.0.1' || $router->connection_type === 'mock') {
                $rxBps = rand(1_200_000, 18_500_000);
                $txBps = rand(400_000, 6_200_000);

                return response()->json([
                    'interface' => $interfaceName,
                    'rx_bps' => $rxBps,
                    'tx_bps' => $txBps,
                    'rx_formatted' => RouterOSService::formatBps($rxBps),
                    'tx_formatted' => RouterOSService::formatBps($txBps),
                    'timestamp' => time(),
                ]);
            }

            $service = $router->getService(4);
            $traffic = $service->getPPPTraffic($interfaceName);

            return response()->json($traffic);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new PPP Profile.
     */
    public function storeProfile(Request $request): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:64',
            'local_address' => 'nullable|string|max:64',
            'remote_address' => 'nullable|string|max:64',
            'rate_limit' => 'nullable|string|max:64',
            'only_one' => 'nullable|string|max:16',
            'dns_server' => 'nullable|string|max:128',
            'use_encryption' => 'nullable|string|max:16',
            'comment' => 'nullable|string|max:255',
        ]);

        $params = [
            'name' => $validated['name'],
        ];

        if (! empty($validated['local_address'])) {
            $params['local-address'] = $validated['local_address'];
        }
        if (! empty($validated['remote_address'])) {
            $params['remote-address'] = $validated['remote_address'];
        }
        if (! empty($validated['rate_limit'])) {
            $params['rate-limit'] = $validated['rate_limit'];
        }
        if (! empty($validated['only_one'])) {
            $params['only-one'] = $validated['only_one'];
        }
        if (! empty($validated['dns_server'])) {
            $params['dns-server'] = $validated['dns_server'];
        }
        if (! empty($validated['use_encryption'])) {
            $params['use-encryption'] = $validated['use_encryption'];
        }
        if (! empty($validated['comment'])) {
            $params['comment'] = $validated['comment'];
        }

        try {
            if (! str_contains(strtolower($router->host), 'demo') && $router->host !== '127.0.0.1') {
                $service = $router->getService(5);
                $service->addPPPProfile($params);
            }

            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'PPP Profile created successfully!']);
            }

            return redirect()->back()->with('success', 'PPP Profile created successfully!');
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to create PPP Profile: '.$e->getMessage()]);
        }
    }

    /**
     * Update an existing PPP Profile.
     */
    public function updateProfile(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:64',
            'local_address' => 'nullable|string|max:64',
            'remote_address' => 'nullable|string|max:64',
            'rate_limit' => 'nullable|string|max:64',
            'only_one' => 'nullable|string|max:16',
            'dns_server' => 'nullable|string|max:128',
            'use_encryption' => 'nullable|string|max:16',
            'comment' => 'nullable|string|max:255',
        ]);

        $params = [
            'name' => $validated['name'],
        ];

        if (! empty($validated['local_address'])) {
            $params['local-address'] = $validated['local_address'];
        }
        if (! empty($validated['remote_address'])) {
            $params['remote-address'] = $validated['remote_address'];
        }
        if (array_key_exists('rate_limit', $validated)) {
            $params['rate-limit'] = $validated['rate_limit'] ?? '';
        }
        if (! empty($validated['only_one'])) {
            $params['only-one'] = $validated['only_one'];
        }
        if (array_key_exists('dns_server', $validated)) {
            $params['dns-server'] = $validated['dns_server'] ?? '';
        }
        if (! empty($validated['use_encryption'])) {
            $params['use-encryption'] = $validated['use_encryption'];
        }
        if (array_key_exists('comment', $validated)) {
            $params['comment'] = $validated['comment'] ?? '';
        }

        try {
            if (! str_contains(strtolower($router->host), 'demo') && $router->host !== '127.0.0.1') {
                $service = $router->getService(5);
                $service->setPPPProfile($id, $params);
            }

            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'PPP Profile updated successfully!']);
            }

            return redirect()->back()->with('success', 'PPP Profile updated successfully!');
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to update PPP Profile: '.$e->getMessage()]);
        }
    }

    /**
     * Delete a PPP Profile.
     */
    public function deleteProfile(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $router = $this->getActiveRouter($request);
        if (! $router) {
            return redirect()->back()->withErrors(['error' => 'No active router selected.']);
        }

        try {
            if (! str_contains(strtolower($router->host), 'demo') && $router->host !== '127.0.0.1') {
                $service = $router->getService(5);
                $service->removePPPProfile($id);
            }

            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'PPP Profile deleted successfully!']);
            }

            return redirect()->back()->with('success', 'PPP Profile deleted successfully!');
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to delete PPP Profile: '.$e->getMessage()]);
        }
    }
}
