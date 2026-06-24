<?php

namespace App\Services;

class PricingService
{
    /**
     * Calculate selling price from purchase price and margin percentage.
     */
    public function calculateSellingPrice(float $purchasePrice, float $marginPercentage): float
    {
        return round($purchasePrice + ($purchasePrice * $marginPercentage / 100), 4);
    }

    /**
     * Calculate profit for a line item.
     */
    public function calculateProfit(float $sellingPrice, float $costPrice, float $quantity = 1): float
    {
        return round(($sellingPrice - $costPrice) * $quantity, 4);
    }

    /**
     * Calculate margin percentage from cost and selling price.
     */
    public function calculateMargin(float $costPrice, float $sellingPrice): float
    {
        if ($sellingPrice == 0.0) {
            return 0.0;
        }

        return round((($sellingPrice - $costPrice) / $sellingPrice) * 100, 2);
    }
}
