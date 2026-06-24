<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $purchase = fake()->randomFloat(2, 1, 1000);
        $margin = fake()->randomFloat(2, 5, 30);
        $selling = $purchase + ($purchase * $margin / 100);

        return [
            'category_id' => null,
            'unit_id' => null,
            'code' => 'P-'.fake()->unique()->numerify('####'),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'purchase_price' => $purchase,
            'default_margin_percentage' => $margin,
            'selling_price' => $selling,
            'is_active' => true,
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
