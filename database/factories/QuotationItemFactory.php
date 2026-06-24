<?php

namespace Database\Factories;

use App\Models\QuotationItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuotationItem>
 */
class QuotationItemFactory extends Factory
{
    protected $model = QuotationItem::class;

    public function definition(): array
    {
        $qty = fake()->randomFloat(2, 1, 10);
        $cost = fake()->randomFloat(2, 10, 500);
        $margin = fake()->randomFloat(2, 5, 30);
        $selling = $cost + ($cost * $margin / 100);
        $total = $selling * $qty;

        return [
            'quotation_id' => null,
            'product_id' => null,
            'product_name_snapshot' => fake()->word(),
            'description' => fake()->sentence(),
            'quantity' => $qty,
            'cost_price_snapshot' => $cost,
            'selling_price_snapshot' => $selling,
            'margin_percentage_snapshot' => $margin,
            'discount' => 0,
            'total' => $total,
        ];
    }
}
