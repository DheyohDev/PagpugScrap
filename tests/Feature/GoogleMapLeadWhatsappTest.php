<?php

use App\Models\GoogleMapLead;

test('whatsapp message generation returns payload for valid phone', function () {
    $lead = GoogleMapLead::create([
        'dedupe_key'       => 'whatsapp-test-1',
        'title'            => 'Toko Test',
        'category'         => 'Retail',
        'address'          => 'Jl. Kebon Jeruk 1',
        'phone'            => '+6285695555513',
        'website'          => null,
        'account_status'   => 'New_lead',
        'review_count'     => 10,
        'review_rating'    => 4.5,
        'timezone'         => 'WIB',
        'place_id'         => 'test-place-id',
    ]);

    $response = $this->postJson("/api/v1/leads/{$lead->id}/whatsapp/generate");

    $response->assertOk();
    $response->assertJson(["success" => true]);
    $response->assertJsonPath('data.phone', '+6285695555513');
    expect($response->json('data.message'))->toBeString();
    expect($response->json('data.message'))->toContain('https://pagpug.com/');
    expect($response->json('data.whatsapp_url'))->toContain('https://wa.me/');
});

test('whatsapp generation rejects invalid 021 phone numbers', function () {
    $lead = GoogleMapLead::create([
        'dedupe_key'       => 'whatsapp-test-2',
        'title'            => 'Toko Invalid',
        'category'         => 'Retail',
        'address'          => 'Jl. Sudirman',
        'phone'            => '+62211234567',
        'website'          => null,
        'account_status'   => 'New_lead',
        'review_count'     => 0,
        'review_rating'    => 0.0,
        'timezone'         => 'WIB',
        'place_id'         => 'test-place-id-2',
    ]);

    $response = $this->postJson("/api/v1/leads/{$lead->id}/whatsapp/generate");

    $response->assertStatus(422);
    $response->assertJson(["success" => false, "message" => 'Nomor telepon tidak valid untuk WhatsApp. Gunakan nomor +62 atau 08.']);
});
