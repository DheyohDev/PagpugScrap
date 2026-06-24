<?php

namespace App\Quotation\Services;

use App\Models\Product;
use App\Quotation\Models\Quotation;
use App\Quotation\Models\QuotationItem;
use App\Quotation\Models\QuotationVersion;
use App\Services\PricingService;
use Illuminate\Support\Facades\DB;

class QuotationService
{
    public function __construct(protected PricingService $pricing) {}

    /**
     * Create a quotation and snapshot item prices.
     * Expects $data to contain 'items' => [ ['product_id'=>int,'quantity'=>float,'discount'=>float], ... ]
     */
    public function create(array $data): Quotation
    {
        return DB::transaction(function () use ($data) {
            $quotation = Quotation::create([
                'quotation_number' => $data['quotation_number'] ?? $this->generateNumber(),
                'quotation_date' => $data['quotation_date'] ?? now()->toDateString(),
                'expired_date' => $data['expired_date'] ?? null,
                'status' => $data['status'] ?? 'draft',
                'notes' => $data['notes'] ?? null,
                'created_by' => $data['created_by'] ?? auth()->id(),
            ]);

            $subtotal = 0.0;
            $totalCost = 0.0;

            foreach ($data['items'] as $item) {
                $product = isset($item['product_id']) ? Product::find($item['product_id']) : null;

                $costPrice = $product ? (float) $product->purchase_price : (float) ($item['cost_price'] ?? 0);
                $margin = $product ? (float) $product->default_margin_percentage : (float) ($item['margin_percentage'] ?? 0);
                $selling = $this->pricing->calculateSellingPrice($costPrice, $margin);
                $quantity = (float) ($item['quantity'] ?? 1);
                $discount = (float) ($item['discount'] ?? 0);

                $lineTotal = round(($selling * $quantity) - $discount, 4);

                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $product?->id,
                    'product_name_snapshot' => $product?->name ?? ($item['product_name'] ?? 'N/A'),
                    'description' => $item['description'] ?? null,
                    'quantity' => $quantity,
                    'cost_price_snapshot' => $costPrice,
                    'selling_price_snapshot' => $selling,
                    'margin_percentage_snapshot' => $margin,
                    'discount' => $discount,
                    'total' => $lineTotal,
                ]);

                $subtotal += $lineTotal;
                $totalCost += $costPrice * $quantity;
            }

            $discountAmount = $data['discount_amount'] ?? 0;
            $taxAmount = $data['tax_amount'] ?? 0;
            $grandTotal = round($subtotal - $discountAmount + $taxAmount, 4);
            $totalProfit = round($grandTotal - $totalCost, 4);

            $quotation->update([
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'grand_total' => $grandTotal,
                'total_cost' => $totalCost,
                'total_profit' => $totalProfit,
            ]);

            // create initial version snapshot
            $this->createVersion($quotation->id, 'Initial version');

            return $quotation->fresh();
        });
    }

    public function duplicate(int $quotationId, ?int $createdBy = null): Quotation
    {
        return DB::transaction(function () use ($quotationId, $createdBy) {
            $orig = Quotation::with('items')->findOrFail($quotationId);

            $new = $orig->replicate();
            $new->quotation_number = $this->generateNumber();
            $new->created_by = $createdBy ?? auth()->id();
            $new->push();

            foreach ($orig->items as $item) {
                $new->items()->create($item->toArray());
            }

            $this->createVersion($new->id, 'Duplicated from '.$orig->quotation_number);

            return $new->fresh();
        });
    }

    public function createVersion(int $quotationId, ?string $reason = null): QuotationVersion
    {
        $quotation = Quotation::with(['items', 'terms'])->findOrFail($quotationId);
        $latest = QuotationVersion::where('quotation_id', $quotationId)->max('version_number') ?? 0;

        return QuotationVersion::create([
            'quotation_id' => $quotationId,
            'version_number' => $latest + 1,
            'reason' => $reason,
            'quotation_data_json' => $quotation->toArray(),
            'created_by' => auth()->id(),
        ]);
    }

    protected function generateNumber(): string
    {
        return 'Q-'.strtoupper(uniqid());
    }
}
