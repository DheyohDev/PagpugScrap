<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$lead = App\Models\GoogleMapLead::create([
    'dedupe_key' => 'whatsapp-debug-php',
    'title' => 'Toko Debug',
    'category' => 'Retail',
    'address' => 'Jl Test',
    'phone' => '+6281234567890',
    'website' => null,
    'account_status' => 'New_lead',
    'review_count' => 10,
    'review_rating' => 4.5,
    'timezone' => 'WIB',
    'place_id' => 'test-place-id-debug',
]);
$request = Illuminate\Http\Request::create('/api/v1/leads/' . $lead->id . '/whatsapp/generate', 'POST');
$response = $kernel->handle($request);
echo $response->getStatusCode() . "\n";
echo $response->getContent() . "\n";
