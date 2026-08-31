<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // $user = User::factory()->create([
        //     'name' => 'Admin MikroTik',
        //     'email' => 'admin@example.com',
        //     'password' => bcrypt('password'),
        // ]);

        $user = User::factory()->create([
            'name' => 'Asin Ganteng',
            'email' => 'asin@kertopati.id',
            'password' => bcrypt('agaksusah'),
        ]);

        // $user->routers()->create([
        //     'name' => 'Office Gateway (RB750Gr3)',
        //     'host' => '192.168.88.1',
        //     'port' => 8728,
        //     'username' => 'admin',
        //     'password' => '',
        //     'use_ssl' => false,
        //     'is_active' => true,
        //     'status' => 'connected',
        //     'last_connected_at' => now(),
        // ]);

    }
}
