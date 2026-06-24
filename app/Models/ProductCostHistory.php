<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCostHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'purchase_price',
        'supplier_name',
        'effective_date',
        'notes',
        'created_by',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function casts(): array
    {
        return [
            'purchase_price' => 'decimal:4',
            'effective_date' => 'date',
        ];
    }
}
