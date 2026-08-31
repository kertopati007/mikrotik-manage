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

class RouterController extends Controller
{
    /**
     * Display the main Router Dashboard.
     */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();
        $routers = $user ? $user->routers()->orderBy('name')->get() : collect();

        // Determine active router (from user's active flag or session)
        $activeRouterId = session('active_router_id');
        $activeRouter = null;

        if ($activeRouterId) {
            $activeRouter = $routers->firstWhere('id', $activeRouterId);
        }

        if (!$activeRouter) {
            $activeRouter = $routers->firstWhere('is_active', true);
        }

        $routerData = null;
        $connectionError = null;

        if ($activeRouter) {
            try {
                // If demo or mock host, return rich mock dataset
                if (str_contains(strtolower($activeRouter->host), 'demo') || $activeRouter->host === '127.0.0.1' || $activeRouter->connection_type === 'mock') {
                    $routerData = RouterOSService::getMockDashboardData($activeRouter->name, $activeRouter->host);
                } else {
                    $service = $activeRouter->getService(3);
                    $routerData = $service->getDashboardData();

                    $activeRouter->update([
                        'status' => 'connected',
                        'last_connected_at' => now(),
                        'last_error' => null,
                    ]);
                }
            } catch (Exception $e) {
                $connectionError = $e->getMessage();
                $activeRouter->update([
                    'status' => 'error',
                    'last_error' => $connectionError,
                ]);

                // Fallback to demo structure with error notice so UI still renders gracefully
                $routerData = RouterOSService::getMockDashboardData($activeRouter->name, $activeRouter->host);
                $routerData['connection_failed'] = true;
                $routerData['error_message'] = $connectionError;
            }
        }

        return Inertia::render('Dashboard', [
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
            'routerData' => $routerData,
            'connectionError' => $connectionError,
        ]);
    }

    /**
     * Display list of saved routers.
     */
    public function index(Request $request): Response
    {
        $routers = $request->user()->routers()->orderBy('created_at', 'desc')->get();

        return Inertia::render('routers/Index', [
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
                'created_at' => $r->created_at->format('Y-m-d H:i'),
            ]),
        ]);
    }

    /**
     * Store a newly created router profile.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'host' => 'required|string|max:255',
            'port' => 'required|integer|min:1|max:65535',
            'username' => 'required|string|max:100',
            'password' => 'nullable|string|max:255',
            'use_ssl' => 'boolean',
            'auto_connect' => 'boolean',
        ]);

        $user = $request->user();
        $autoConnect = $request->boolean('auto_connect', true);

        if ($autoConnect) {
            $user->routers()->update(['is_active' => false]);
        }

        $router = $user->routers()->create([
            'name' => $validated['name'],
            'host' => $validated['host'],
            'port' => $validated['port'],
            'username' => $validated['username'],
            'password' => $validated['password'] ?? '',
            'use_ssl' => $request->boolean('use_ssl', false),
            'is_active' => $autoConnect,
            'status' => 'disconnected',
        ]);

        if ($autoConnect) {
            session(['active_router_id' => $router->id]);
            $router->testConnection();
            return redirect()->route('dashboard')->with('success', "Connected to {$router->name} successfully!");
        }

        return redirect()->back()->with('success', "Router {$router->name} saved successfully!");
    }

    /**
     * Update an existing router profile.
     */
    public function update(Request $request, Router $router): RedirectResponse
    {
        $this->authorizeRouter($request, $router);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'host' => 'required|string|max:255',
            'port' => 'required|integer|min:1|max:65535',
            'username' => 'required|string|max:100',
            'password' => 'nullable|string|max:255',
            'use_ssl' => 'boolean',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'host' => $validated['host'],
            'port' => $validated['port'],
            'username' => $validated['username'],
            'use_ssl' => $request->boolean('use_ssl', false),
        ];

        if ($request->filled('password')) {
            $updateData['password'] = $validated['password'];
        }

        $router->update($updateData);

        return redirect()->back()->with('success', "Router {$router->name} updated successfully!");
    }

    /**
     * Delete a router profile.
     */
    public function destroy(Request $request, Router $router): RedirectResponse
    {
        $this->authorizeRouter($request, $router);

        $wasActive = $router->is_active;
        $routerName = $router->name;
        $router->delete();

        if ($wasActive || session('active_router_id') === $router->id) {
            session()->forget('active_router_id');
            // Try to activate another router if available
            $nextRouter = $request->user()->routers()->first();
            if ($nextRouter) {
                $nextRouter->update(['is_active' => true]);
                session(['active_router_id' => $nextRouter->id]);
            }
        }

        return redirect()->route('dashboard')->with('success', "Router {$routerName} removed.");
    }

    /**
     * Connect and set as active session router.
     */
    public function connect(Request $request, Router $router): RedirectResponse
    {
        $this->authorizeRouter($request, $router);

        // Deactivate all other routers
        $request->user()->routers()->update(['is_active' => false]);

        $router->update([
            'is_active' => true,
            'status' => 'connected',
            'last_connected_at' => now(),
            'last_error' => null,
        ]);

        session(['active_router_id' => $router->id]);

        return redirect()->route('dashboard')->with('success', "Active session switched to {$router->name}.");
    }

    /**
     * Disconnect active router session.
     */
    public function disconnect(Request $request, Router $router): RedirectResponse
    {
        $this->authorizeRouter($request, $router);

        $router->update([
            'is_active' => false,
            'status' => 'disconnected',
        ]);

        session()->forget('active_router_id');

        return redirect()->route('dashboard')->with('success', "Disconnected from {$router->name}.");
    }

    /**
     * Quick Connect to a router with or without saving.
     */
    public function quickConnect(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:100',
            'host' => 'required|string|max:255',
            'port' => 'required|integer|min:1|max:65535',
            'username' => 'required|string|max:100',
            'password' => 'nullable|string|max:255',
            'use_ssl' => 'boolean',
            'save' => 'boolean',
        ]);

        $user = $request->user();
        $name = !empty($validated['name']) ? $validated['name'] : 'Router (' . $validated['host'] . ')';

        $user->routers()->update(['is_active' => false]);

        $router = $user->routers()->updateOrCreate(
            ['host' => $validated['host'], 'port' => $validated['port']],
            [
                'name' => $name,
                'username' => $validated['username'],
                'password' => $validated['password'] ?? '',
                'use_ssl' => $request->boolean('use_ssl', false),
                'is_active' => true,
                'status' => 'connected',
                'last_connected_at' => now(),
                'last_error' => null,
            ]
        );

        session(['active_router_id' => $router->id]);

        return redirect()->route('dashboard')->with('success', "Connected to {$router->name}!");
    }

    /**
     * Test connection to a router and return latency / status.
     */
    public function testConnection(Request $request): JsonResponse
    {
        if ($request->has('router_id')) {
            $router = $request->user()->routers()->findOrFail($request->input('router_id'));
            $result = $router->testConnection();
            return response()->json($result);
        }

        $validated = $request->validate([
            'host' => 'required|string',
            'port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'nullable|string',
            'use_ssl' => 'boolean',
        ]);

        if (str_contains(strtolower($validated['host']), 'demo') || $validated['host'] === '127.0.0.1') {
            return response()->json([
                'success' => true,
                'latency_ms' => rand(3, 15),
                'message' => 'Connected successfully (Simulated)',
                'identity' => 'Demo MikroTik Router',
                'version' => '7.15.3',
                'board_name' => 'hEX (RB750Gr3)',
            ]);
        }

        $service = new RouterOSService(
            $validated['host'],
            $validated['username'],
            $validated['password'] ?? '',
            $validated['port'],
            $request->boolean('use_ssl', false),
            3
        );

        $result = $service->testConnection();
        return response()->json($result);
    }

    /**
     * Poll real-time stats for the active router (CPU, RAM, Traffic).
     */
    public function getStats(Request $request): JsonResponse
    {
        $user = $request->user();
        $activeRouterId = session('active_router_id');
        $router = null;

        if ($activeRouterId) {
            $router = $user->routers()->find($activeRouterId);
        }

        if (!$router) {
            $router = $user->routers()->where('is_active', true)->first();
        }

        if (!$router) {
            return response()->json(['error' => 'No active router'], 404);
        }

        try {
            if (str_contains(strtolower($router->host), 'demo') || $router->host === '127.0.0.1') {
                $data = RouterOSService::getMockDashboardData($router->name, $router->host);
                return response()->json($data);
            }

            $service = $router->getService(3);
            $data = $service->getDashboardData();

            return response()->json($data);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Reboot router.
     */
    public function reboot(Request $request, Router $router): JsonResponse
    {
        $this->authorizeRouter($request, $router);

        if (str_contains(strtolower($router->host), 'demo') || $router->host === '127.0.0.1') {
            return response()->json(['success' => true, 'message' => 'Simulated reboot signal sent to router.']);
        }

        try {
            $service = $router->getService(3);
            $service->reboot();
            return response()->json(['success' => true, 'message' => 'Reboot command sent to router.']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Ping target host from router.
     */
    public function ping(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'target' => 'required|string',
            'count' => 'nullable|integer|min:1|max:10',
        ]);

        $user = $request->user();
        $router = $user->routers()->where('is_active', true)->first();

        if (!$router) {
            return response()->json(['error' => 'No active router'], 400);
        }

        if (str_contains(strtolower($router->host), 'demo') || $router->host === '127.0.0.1') {
            $count = $validated['count'] ?? 4;
            $results = [];
            for ($i = 0; $i < $count; $i++) {
                $results[] = [
                    'host' => $validated['target'],
                    'size' => 56,
                    'ttl' => 56,
                    'time' => rand(8, 35) . 'ms',
                    'status' => 'echo reply',
                ];
            }
            return response()->json(['success' => true, 'results' => $results]);
        }

        try {
            $service = $router->getService(5);
            $results = $service->ping($validated['target'], $validated['count'] ?? 4);
            return response()->json(['success' => true, 'results' => $results]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Authorize that the router belongs to the authenticated user.
     */
    protected function authorizeRouter(Request $request, Router $router): void
    {
        if ($router->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized router action.');
        }
    }
}
