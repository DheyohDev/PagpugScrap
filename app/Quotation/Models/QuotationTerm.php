<?php

namespace App\Quotation\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotationTerm extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_id',
        'payment_term',
        'delivery_time',
        'warranty',
        'notes',
    ];

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }
}
