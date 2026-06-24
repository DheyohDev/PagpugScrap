<?php

use App\Services\PricingService;

it('calculates selling price from purchase price and margin', function () {
    $service = new PricingService;

    expect($service->calculateSellingPrice(100.0, 20.0))->toBe(120.0);
    expect($service->calculateSellingPrice(50.0, 10.0))->toBe(55.0);
});

it('calculates profit correctly', function () {
    $service = new PricingService;

    expect($service->calculateProfit(150.0, 100.0, 2))->toBe(100.0);
    expect($service->calculateProfit(80.0, 80.0, 1))->toBe(0.0);
});

it('calculates margin percentage correctly', function () {
    $service = new PricingService;

    expect($service->calculateMargin(100.0, 150.0))->toBe(33.33);
    expect($service->calculateMargin(0.0, 0.0))->toBe(0.0);
});
