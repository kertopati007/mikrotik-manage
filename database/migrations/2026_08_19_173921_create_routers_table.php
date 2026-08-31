<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('routers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('host');
            $table->integer('port')->default(8728);
            $table->string('username')->default('admin');
            $table->text('password')->nullable();
            $table->boolean('use_ssl')->default(false);
            $table->string('connection_type')->default('api');
            $table->boolean('is_active')->default(false);
            $table->string('status')->default('disconnected');
            $table->timestamp('last_connected_at')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routers');
    }
};
