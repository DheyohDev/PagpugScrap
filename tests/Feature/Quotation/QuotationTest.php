<?php

use App\Models\Product;
use App\Models\Quotation;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create([
        'email' => 'test@example.com',
    ]);
});

test('superadmin can create a quotation with items', function () {
    $this->actingAs($this->user);

    $product = Product::factory()->create([
        'code' => 'PRD-100',
        'name' => 'Quotation Product',
        'purchase_price' => 80,
        'default_margin_percentage' => 25,
        'selling_price' => 100,
    ]);

    $response = $this->postJson(route('quotations.store'), [
        'quotation_number' => 'Q-100',
        'quotation_date' => now()->toDateString(),
        'expired_date' => now()->addDays(30)->toDateString(),
        'status' => 'draft',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
                'discount' => 10,
            ],
        ],
    ]);

    $response->assertCreated();

    $quotation = Quotation::where('quotation_number', 'Q-100')->first();
    expect($quotation)->not->toBeNull();
    expect($quotation->total_cost)->toBe('160.0000');
    expect($quotation->grand_total)->toBe('190.0000');
});

it('creates quotation item snapshots and preserves prices', function () {
    $this->actingAs($this->user);

    $product = Product::factory()->create([
        'purchase_price' => 50,
        'default_margin_percentage' => 20,
        'selling_price' => 60,
    ]);

    $response = $this->postJson(route('quotations.store'), [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
                'discount' => 0,
            ],
        ],
    ]);

    $response->assertCreated();

    $quotation = Quotation::first();
    expect($quotation->items->first()->cost_price_snapshot)->toBe('50.0000');
    expect($quotation->items->first()->selling_price_snapshot)->toBe('60.0000');
});
