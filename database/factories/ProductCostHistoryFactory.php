<?php

namespace Database\Factories;

use App\Models\ProductCostHistory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<ProductCostHistory>
 */
class ProductCostHistoryFactory extends Factory
{
    protected $model = ProductCostHistory::class;

    public function definition(): array
    {
        return [
            'product_id' => null,
            'purchase_price' => fake()->randomFloat(2, 1, 1000),
            'supplier_name' => fake()->company(),
            'effective_date' => Carbon::now()->toDateString(),
            'notes' => fake()->sentence(),
            'created_by' => null,
        ];
    }
}
