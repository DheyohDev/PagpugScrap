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
        Schema::create('csv_import_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('source_type'); // job|upload
            $table->string('source_reference')->nullable(); // job id / filename
            $table->string('file_path')->nullable();
            $table->string('file_hash')->nullable()->index();
            $table->string('status')->default('queued')->index(); // queued|processing|done|failed
            $table->unsignedInteger('total_rows')->default(0);
            $table->unsignedInteger('processed_rows')->default(0);
            $table->unsignedInteger('failed_rows')->default(0);
            $table->text('error_message')->nullable();
            $table->jsonb('meta')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('csv_import_tasks');
    }
};
