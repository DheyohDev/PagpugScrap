<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'unit_id',
        'code',
        'name',
        'description',
        'purchase_price',
        'default_margin_percentage',
        'selling_price',
        'is_active',
        'created_by',
        'updated_by',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function costHistories(): HasMany
    {
        return $this->hasMany(ProductCostHistory::class);
    }

    public function casts(): array
    {
        return [
            'purchase_price' => 'decimal:4',
            'default_margin_percentage' => 'decimal:2',
            'selling_price' => 'decimal:4',
            'is_active' => 'boolean',
        ];
    }
}
