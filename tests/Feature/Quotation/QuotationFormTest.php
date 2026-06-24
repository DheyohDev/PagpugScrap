<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->user = User::factory()->create([
        'email' => 'test@example.com',
    ]);
});

test('user can see quotation create form', function () {
    $response = $this->actingAs($this->user)
        ->get(route('quotations.create'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('quotation/quotations/create')
    );
});

test('user can see quotation edit form', function () {
    $quotation = \App\Quotation\Models\Quotation::factory()->create();

    $response = $this->actingAs($this->user)
        ->get(route('quotations.edit', $quotation));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('quotation/quotations/edit')
        ->has('quotation')
    );
});
