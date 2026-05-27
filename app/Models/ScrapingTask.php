<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScrapingTask extends Model
{
    protected $fillable = [
        'task_id',
        'name',
        'date',
        'status',
        'data',
    ];

    protected $casts = [
        'date' => 'datetime',
        'data' => 'array', // Otomatis parsing JSONB PostgreSQL ke Array
    ];
}
