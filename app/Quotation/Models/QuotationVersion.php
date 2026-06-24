<?php

namespace App\Quotation\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotationVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_id',
        'version_number',
        'reason',
        'quotation_data_json',
        'created_by',
    ];

    protected $casts = [
        'quotation_data_json' => 'array',
    ];

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }
}
