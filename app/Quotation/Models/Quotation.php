<?php

namespace App\Quotation\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quotation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'quotation_number',
        'quotation_date',
        'expired_date',
        'status',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'grand_total',
        'total_cost',
        'total_profit',
        'notes',
        'created_by',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(QuotationVersion::class);
    }

    public function terms(): HasOne
    {
        return $this->hasOne(QuotationTerm::class);
    }

    public function casts(): array
    {
        return [
            'quotation_date' => 'date',
            'expired_date' => 'date',
            'subtotal' => 'decimal:4',
            'discount_amount' => 'decimal:4',
            'tax_amount' => 'decimal:4',
            'grand_total' => 'decimal:4',
            'total_cost' => 'decimal:4',
            'total_profit' => 'decimal:4',
        ];
    }
}
