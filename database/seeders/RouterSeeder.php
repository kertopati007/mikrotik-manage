<?php

namespace Database\Seeders;

use App\Models\Router;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RouterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $user = User::where('email', 'asin@kertopati.id')->first();
        $user->routers()->create([
            'name' => 'Mikrotik Core TSPM',
            'host' => '192.168.0.3',
            'port' => 8728,
            'username' => 'api',
            'password' => 'apiwae',
            'use_ssl' => false,
            'is_active' => true,
            'status' => 'connected',
            'last_connected_at' => now(),
        ]);
    }
}
