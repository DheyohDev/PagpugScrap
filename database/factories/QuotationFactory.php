<?php

namespace Database\Factories;

use App\Models\Quotation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Quotation>
 */
class QuotationFactory extends Factory
{
    protected $model = Quotation::class;

    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 100, 10000);
        $discount = 0;
        $tax = round($subtotal * 0.11, 2);
        $grand = $subtotal - $discount + $tax;

        return [
            'quotation_number' => 'Q-'.strtoupper(Str::random(6)),
            'quotation_date' => now()->toDateString(),
            'expired_date' => now()->addDays(30)->toDateString(),
            'status' => 'draft',
            'subtotal' => $subtotal,
            'discount_amount' => $discount,
            'tax_amount' => $tax,
            'grand_total' => $grand,
            'total_cost' => $subtotal * 0.7,
            'total_profit' => $grand - ($subtotal * 0.7),
            'notes' => null,
            'created_by' => null,
        ];
    }
}
