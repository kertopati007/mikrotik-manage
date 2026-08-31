<?php

namespace App\Models;

use App\Services\RouterOSService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Router extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'host',
        'port',
        'username',
        'password',
        'use_ssl',
        'connection_type',
        'is_active',
        'status',
        'last_connected_at',
        'last_error',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'port' => 'integer',
        'password' => 'encrypted',
        'use_ssl' => 'boolean',
        'is_active' => 'boolean',
        'last_connected_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get an instantiated RouterOSService client for this router.
     */
    public function getService(int $timeout = 4): RouterOSService
    {
        return new RouterOSService(
            $this->host,
            $this->username,
            $this->password ?? '',
            $this->port ?: 8728,
            $this->use_ssl,
            $timeout
        );
    }

    /**
     * Test connection to this router and update status.
     */
    public function testConnection(): array
    {
        if (str_contains(strtolower($this->host), 'demo') || $this->host === '127.0.0.1') {
            $this->update([
                'status' => 'connected',
                'last_connected_at' => now(),
                'last_error' => null,
            ]);

            return [
                'success' => true,
                'latency_ms' => rand(2, 18),
                'message' => 'Connected successfully (Simulated / Local)',
                'identity' => $this->name,
                'version' => '7.15.3',
                'board_name' => 'Demo RouterOS',
            ];
        }

        $service = $this->getService(3);
        $result = $service->testConnection();

        if ($result['success']) {
            $this->update([
                'status' => 'connected',
                'last_connected_at' => now(),
                'last_error' => null,
            ]);
        } else {
            $this->update([
                'status' => 'error',
                'last_error' => $result['message'],
            ]);
        }

        return $result;
    }
}
