<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoogleMapLead extends Model
{
    protected $fillable = [
        'dedupe_key',
        'input_id',
        'link',
        'title',
        'category',
        'address',
        'open_hours',
        'popular_times',
        'website',
        'phone',
        'plus_code',
        'review_count',
        'review_rating',
        'reviews_per_rating',
        'latitude',
        'longitude',
        'cid',
        'status',
        'descriptions',
        'reviews_link',
        'thumbnail',
        'timezone',
        'price_range',
        'data_id',
        'images',
        'reservations',
        'order_online',
        'menu',
        'owner',
        'complete_address',
        'about',
        'user_reviews',
        'emails',
        'user_reviews_extended',
        'place_id',
        'account_status',
    ];

    protected $casts = [
        'open_hours' => 'array',
        'popular_times' => 'array',
        'reviews_per_rating' => 'array',
        'images' => 'array',
        'about' => 'array',
        'user_reviews' => 'array',
        'emails' => 'array',
        'user_reviews_extended' => 'array',
        'review_count' => 'integer',
        'review_rating' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}
