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
        Schema::create('scraping_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_id')->unique(); // ID dari JSON
            $table->string('name');
            $table->timestamp('date');
            $table->string('status');
            $table->jsonb('data')->nullable(); // Menggunakan JSONB untuk PostgreSQL
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraping_tasks');
    }
};
