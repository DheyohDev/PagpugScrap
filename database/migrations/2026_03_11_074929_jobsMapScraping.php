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
         Schema::create('JobsMapScraping', function (Blueprint $table) {
            // Menggunakan UUID karena contoh di YAML Anda menggunakan format UUID
            $table->uuid('id')->primary();

            $table->string('name');
            // Status pekerjaan scraper: pending, running, completed, failed
            $table->string('status')->default('pending');

            // Karena Anda menggunakan PostgreSQL, jsonb sangat optimal
            // untuk menyimpan parameter "JobData" dari YAML
            $table->jsonb('data');

            // Timestamps akan membuat kolom created_at (bisa digunakan sebagai 'date' di YAML) dan updated_at
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
