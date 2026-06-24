<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class QuotationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Categories
        $catIds = [];
        $catIds[] = DB::table('categories')->insertGetId([
            'name' => 'General',
            'description' => 'General products',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Units
        $unitIds = [];
        $unitIds[] = DB::table('units')->insertGetId([
            'name' => 'Piece',
            'symbol' => 'pcs',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Products
        $productId = DB::table('products')->insertGetId([
            'category_id' => $catIds[0],
            'unit_id' => $unitIds[0],
            'code' => 'P-0001',
            'name' => 'Sample Product',
            'description' => 'Sample product for quotation module',
            'purchase_price' => 100.00,
            'default_margin_percentage' => 20.00,
            'selling_price' => 120.00,
            'is_active' => true,
            'created_by' => null,
            'updated_by' => null,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Product cost history
        DB::table('product_cost_histories')->insert([
            'product_id' => $productId,
            'purchase_price' => 100.00,
            'supplier_name' => 'Default Supplier',
            'effective_date' => Carbon::now()->toDateString(),
            'notes' => 'Initial cost',
            'created_by' => null,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
