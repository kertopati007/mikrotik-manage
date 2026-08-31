<?php

namespace Tests\Feature;

use App\Models\Router;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RouterTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_router_management(): void
    {
        $response = $this->get(route('routers.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_router_management_page(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('routers.index'));
        $response->assertOk();
    }

    public function test_user_can_save_and_connect_router(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('routers.store'), [
            'name' => 'Main Test Gateway',
            'host' => '192.168.88.1',
            'port' => 8728,
            'username' => 'admin',
            'password' => 'secret123',
            'use_ssl' => false,
            'auto_connect' => true,
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('routers', [
            'user_id' => $user->id,
            'name' => 'Main Test Gateway',
            'host' => '192.168.88.1',
            'port' => 8728,
            'is_active' => true,
        ]);
    }

    public function test_user_can_quick_connect_to_router(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('routers.quick-connect'), [
            'name' => 'Quick Demo Router',
            'host' => 'demo.mikrotik.com',
            'port' => 8728,
            'username' => 'admin',
            'password' => '',
            'use_ssl' => false,
            'save' => true,
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('routers', [
            'user_id' => $user->id,
            'host' => 'demo.mikrotik.com',
            'is_active' => true,
        ]);
    }

    public function test_user_can_switch_active_router(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $router1 = $user->routers()->create([
            'name' => 'Router 1',
            'host' => '192.168.88.1',
            'port' => 8728,
            'username' => 'admin',
            'is_active' => true,
        ]);

        $router2 = $user->routers()->create([
            'name' => 'Router 2',
            'host' => '192.168.89.1',
            'port' => 8728,
            'username' => 'admin',
            'is_active' => false,
        ]);

        $response = $this->post(route('routers.connect', $router2));
        $response->assertRedirect(route('dashboard'));

        $this->assertTrue($router2->fresh()->is_active);
        $this->assertFalse($router1->fresh()->is_active);
    }

    public function test_user_can_disconnect_router(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $router = $user->routers()->create([
            'name' => 'Router 1',
            'host' => '192.168.88.1',
            'port' => 8728,
            'username' => 'admin',
            'is_active' => true,
        ]);

        $response = $this->post(route('routers.disconnect', $router));
        $response->assertRedirect(route('dashboard'));

        $this->assertFalse($router->fresh()->is_active);
    }

    public function test_user_can_delete_router(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $router = $user->routers()->create([
            'name' => 'To Delete',
            'host' => '192.168.99.1',
            'port' => 8728,
            'username' => 'admin',
        ]);

        $response = $this->delete(route('routers.destroy', $router));
        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseMissing('routers', [
            'id' => $router->id,
        ]);
    }
}
