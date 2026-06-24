<?php

use App\Models\Product;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create([
        'email' => 'test@example.com',
    ]);
});

test('superadmin can create a product', function () {
    $this->actingAs($this->user);

    $response = $this->postJson(route('products.store'), [
        'code' => 'PRD-001',
        'name' => 'Test Product',
        'purchase_price' => 100,
        'default_margin_percentage' => 20,
        'selling_price' => 120,
        'is_active' => true,
    ]);

    $response->assertCreated();
    expect(Product::where('code', 'PRD-001')->exists())->toBeTrue();
});

test('product can be updated', function () {
    $this->actingAs($this->user);

    $product = Product::factory()->create(['code' => 'PRD-002']);

    $response = $this->putJson(route('products.update', $product), [
        'code' => 'PRD-002',
        'name' => 'Updated Product',
        'purchase_price' => 150,
        'default_margin_percentage' => 25,
        'selling_price' => 187.5,
        'is_active' => true,
    ]);

    $response->assertOk();
    expect($product->fresh()->name)->toBe('Updated Product');
});
