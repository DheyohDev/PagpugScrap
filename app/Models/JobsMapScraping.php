<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobsMapScraping extends Model
{
    use HasFactory, HasUuids; // Wajib HasUuids agar Laravel otomatis men-generate UUID saat create

    protected $fillable = [
        'name',
        'status',
        'data',
    ];

    /**
     * Casting kolom database ke tipe data native PHP.
     * jsonb diubah menjadi array, sehingga mudah diakses.
     */
    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }

    /**
     * Mengatur format output JSON agar sesuai dengan schema 'Job' di YAML
     */
    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'date' => $this->created_at->toIso8601String(), // Sesuai format date-time
            'status' => $this->status,
            'data' => $this->data,
        ];
    }
}
