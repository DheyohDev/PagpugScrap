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
        Schema::create('google_map_leads', function (Blueprint $table) {
            $table->id();
            $table->string('dedupe_key')->unique();
            $table->string('input_id')->nullable()->index();
            $table->text('link')->nullable();
            $table->string('title')->nullable()->index();
            $table->string('category')->nullable();
            $table->text('address')->nullable();
            $table->jsonb('open_hours')->nullable();
            $table->jsonb('popular_times')->nullable();
            $table->text('website')->nullable();
            $table->string('phone')->nullable();
            $table->string('plus_code')->nullable();
            $table->unsignedInteger('review_count')->nullable();
            $table->decimal('review_rating', 3, 2)->nullable();
            $table->jsonb('reviews_per_rating')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('cid')->nullable()->index();
            $table->string('status')->nullable();
            $table->text('descriptions')->nullable();
            $table->text('reviews_link')->nullable();
            $table->text('thumbnail')->nullable();
            $table->string('timezone')->nullable();
            $table->string('price_range')->nullable();
            $table->string('data_id')->nullable();
            $table->jsonb('images')->nullable();
            $table->text('reservations')->nullable();
            $table->text('order_online')->nullable();
            $table->text('menu')->nullable();
            $table->string('owner')->nullable();
            $table->text('complete_address')->nullable();
            $table->jsonb('about')->nullable();
            $table->jsonb('user_reviews')->nullable();
            $table->jsonb('emails')->nullable();
            $table->jsonb('user_reviews_extended')->nullable();
            $table->string('place_id')->nullable()->index();
            $table->string('account_status')->default('New_lead')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('google_map_leads');
    }
};
