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
        if (Schema::hasColumn('google_map_leads', 'lead_status')) {
            Schema::table('google_map_leads', function (Blueprint $table) {
                $table->renameColumn('lead_status', 'account_status');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('google_map_leads', 'account_status')) {
            Schema::table('google_map_leads', function (Blueprint $table) {
                $table->renameColumn('account_status', 'lead_status');
            });
        }
    }
};
