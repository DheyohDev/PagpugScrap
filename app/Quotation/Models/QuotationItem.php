<?php

namespace App\Quotation\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotationItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_id',
        'product_id',
        'product_name_snapshot',
        'description',
        'quantity',
        'cost_price_snapshot',
        'selling_price_snapshot',
        'margin_percentage_snapshot',
        'discount',
        'total',
    ];

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function casts(): array
    {
        return [
            'quantity' => 'decimal:4',
            'cost_price_snapshot' => 'decimal:4',
            'selling_price_snapshot' => 'decimal:4',
            'margin_percentage_snapshot' => 'decimal:2',
            'discount' => 'decimal:4',
            'total' => 'decimal:4',
        ];
    }
}
