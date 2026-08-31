<?php

use App\Http\Controllers\FirewallController;
use App\Http\Controllers\PPPController;
use App\Http\Controllers\RouterController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [RouterController::class, 'dashboard'])->name('dashboard');

    Route::prefix('routers')->name('routers.')->group(function () {
        Route::get('/', [RouterController::class, 'index'])->name('index');
        Route::post('/', [RouterController::class, 'store'])->name('store');
        Route::put('{router}', [RouterController::class, 'update'])->name('update');
        Route::delete('{router}', [RouterController::class, 'destroy'])->name('destroy');
        Route::post('{router}/connect', [RouterController::class, 'connect'])->name('connect');
        Route::post('{router}/disconnect', [RouterController::class, 'disconnect'])->name('disconnect');
        Route::post('{router}/reboot', [RouterController::class, 'reboot'])->name('reboot');
        Route::post('quick-connect', [RouterController::class, 'quickConnect'])->name('quick-connect');
        Route::post('test-connection', [RouterController::class, 'testConnection'])->name('test-connection');
        Route::get('stats', [RouterController::class, 'getStats'])->name('stats');
        Route::post('ping', [RouterController::class, 'ping'])->name('ping');
    });

    Route::prefix('ppp')->name('ppp.')->group(function () {
        Route::get('/', [PPPController::class, 'index'])->name('index');
        Route::get('stats', [PPPController::class, 'getStats'])->name('stats');

        // Secrets
        Route::post('secret', [PPPController::class, 'storeSecret'])->name('secret.store');
        Route::put('secret/{id}', [PPPController::class, 'updateSecret'])->name('secret.update');
        Route::delete('secret/{id}', [PPPController::class, 'deleteSecret'])->name('secret.destroy');
        Route::post('secret/{id}/toggle', [PPPController::class, 'toggleSecret'])->name('secret.toggle');

        // Active connections
        Route::delete('active/{id}', [PPPController::class, 'disconnectActive'])->name('active.destroy');

        // Profiles
        Route::post('profile', [PPPController::class, 'storeProfile'])->name('profile.store');
        Route::put('profile/{id}', [PPPController::class, 'updateProfile'])->name('profile.update');
        Route::delete('profile/{id}', [PPPController::class, 'deleteProfile'])->name('profile.destroy');

        // Traffic Monitoring
        Route::get('traffic', [PPPController::class, 'getTraffic'])->name('traffic');
    });

    Route::prefix('firewall')->name('firewall.')->group(function () {
        Route::get('/', [FirewallController::class, 'index'])->name('index');
        Route::get('stats', [FirewallController::class, 'getStats'])->name('stats');

        // Filter Rules
        Route::post('filter', [FirewallController::class, 'storeFilter'])->name('filter.store');
        Route::put('filter/{id}', [FirewallController::class, 'updateFilter'])->name('filter.update');
        Route::delete('filter/{id}', [FirewallController::class, 'deleteFilter'])->name('filter.destroy');
        Route::post('filter/{id}/toggle', [FirewallController::class, 'toggleFilter'])->name('filter.toggle');

        // NAT Rules
        Route::post('nat', [FirewallController::class, 'storeNat'])->name('nat.store');
        Route::put('nat/{id}', [FirewallController::class, 'updateNat'])->name('nat.update');
        Route::delete('nat/{id}', [FirewallController::class, 'deleteNat'])->name('nat.destroy');
        Route::post('nat/{id}/toggle', [FirewallController::class, 'toggleNat'])->name('nat.toggle');

        // Address Lists
        Route::post('address-list', [FirewallController::class, 'storeAddress'])->name('address.store');
        Route::put('address-list/{id}', [FirewallController::class, 'updateAddress'])->name('address.update');
        Route::delete('address-list/{id}', [FirewallController::class, 'deleteAddress'])->name('address.destroy');
        Route::post('address-list/{id}/toggle', [FirewallController::class, 'toggleAddress'])->name('address.toggle');
    });
});

require __DIR__.'/settings.php';
