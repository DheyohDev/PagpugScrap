<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CsvImportTask extends Model
{
    protected $fillable = [
        'source_type',
        'source_reference',
        'file_path',
        'file_hash',
        'status',
        'total_rows',
        'processed_rows',
        'failed_rows',
        'error_message',
        'meta',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];
}
