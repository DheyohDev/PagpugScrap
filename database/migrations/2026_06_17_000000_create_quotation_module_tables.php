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
        if (! Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasTable('units')) {
            Schema::create('units', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('symbol')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
                $table->foreignId('unit_id')->nullable()->constrained('units')->nullOnDelete();
                $table->string('code')->unique();
                $table->string('name');
                $table->text('description')->nullable();
                $table->decimal('purchase_price', 15, 4)->default(0);
                $table->decimal('default_margin_percentage', 8, 2)->default(0);
                $table->decimal('selling_price', 15, 4)->default(0);
                $table->boolean('is_active')->default(true);
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasTable('product_cost_histories')) {
            Schema::create('product_cost_histories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->decimal('purchase_price', 15, 4)->default(0);
                $table->string('supplier_name')->nullable();
                $table->date('effective_date')->nullable();
                $table->text('notes')->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('quotations')) {
            Schema::create('quotations', function (Blueprint $table) {
                $table->id();
                $table->string('quotation_number')->unique();
                $table->date('quotation_date')->nullable();
                $table->date('expired_date')->nullable();
                $table->string('status')->default('draft');
                $table->decimal('subtotal', 18, 4)->default(0);
                $table->decimal('discount_amount', 18, 4)->default(0);
                $table->decimal('tax_amount', 18, 4)->default(0);
                $table->decimal('grand_total', 18, 4)->default(0);
                $table->decimal('total_cost', 18, 4)->default(0);
                $table->decimal('total_profit', 18, 4)->default(0);
                $table->text('notes')->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasTable('quotation_items')) {
            Schema::create('quotation_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('quotation_id')->constrained('quotations')->cascadeOnDelete();
                $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
                $table->string('product_name_snapshot');
                $table->text('description')->nullable();
                $table->decimal('quantity', 18, 4)->default(1);
                $table->decimal('cost_price_snapshot', 18, 4)->default(0);
                $table->decimal('selling_price_snapshot', 18, 4)->default(0);
                $table->decimal('margin_percentage_snapshot', 8, 2)->default(0);
                $table->decimal('discount', 18, 4)->default(0);
                $table->decimal('total', 18, 4)->default(0);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('quotation_versions')) {
            Schema::create('quotation_versions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('quotation_id')->constrained('quotations')->cascadeOnDelete();
                $table->integer('version_number')->default(1);
                $table->string('reason')->nullable();
                $table->json('quotation_data_json');
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('quotation_terms')) {
            Schema::create('quotation_terms', function (Blueprint $table) {
                $table->id();
                $table->foreignId('quotation_id')->constrained('quotations')->cascadeOnDelete();
                $table->string('payment_term')->nullable();
                $table->string('delivery_time')->nullable();
                $table->string('warranty')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_terms');
        Schema::dropIfExists('quotation_versions');
        Schema::dropIfExists('quotation_items');
        Schema::dropIfExists('quotations');
        Schema::dropIfExists('product_cost_histories');
        Schema::dropIfExists('products');
        Schema::dropIfExists('units');
        Schema::dropIfExists('categories');
    }
};
