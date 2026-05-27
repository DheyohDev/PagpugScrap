<?php

namespace App\Services;

use App\Models\GoogleMapLead;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class GoogleMapLeadImportService
{
    /**
     * @return array{total_rows:int,processed_rows:int,failed_rows:int}
     */
    public function importFromCsvString(string $csvContent): array
    {
        $rows = $this->parseCsv($csvContent);

        if (empty($rows)) {
            return [
                'total_rows' => 0,
                'processed_rows' => 0,
                'failed_rows' => 0,
            ];
        }

        $payload = [];
        $failedRows = 0;
        $now = Carbon::now();

        foreach ($rows as $row) {
            $normalized = $this->normalizeRow($row);
            if ($normalized === null) {
                $failedRows++;
                continue;
            }

            $normalized['created_at'] = $now;
            $normalized['updated_at'] = $now;
            $payload[] = $normalized;
        }

        foreach (array_chunk($payload, 300) as $chunk) {
            DB::transaction(function () use ($chunk): void {
                GoogleMapLead::query()->upsert(
                    $chunk,
                    ['dedupe_key'],
                    [
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
                        'updated_at',
                    ]
                );
            });
        }

        return [
            'total_rows' => count($rows),
            'processed_rows' => count($payload),
            'failed_rows' => $failedRows,
        ];
    }

    /**
     * @return array<int, array<string, string|null>>
     */
    private function parseCsv(string $csvContent): array
    {
        $stream = fopen('php://temp', 'r+');
        fwrite($stream, $csvContent);
        rewind($stream);

        $headers = fgetcsv($stream);
        if ($headers === false) {
            fclose($stream);
            return [];
        }

        $normalizedHeaders = array_map(static fn ($header) => strtolower(trim((string) $header)), $headers);
        $rows = [];

        while (($line = fgetcsv($stream)) !== false) {
            if ($this->isEmptyCsvLine($line)) {
                continue;
            }

            $entry = [];
            foreach ($normalizedHeaders as $index => $header) {
                $entry[$header] = isset($line[$index]) ? trim((string) $line[$index]) : null;
            }
            $rows[] = $entry;
        }

        fclose($stream);

        return $rows;
    }

    /**
     * @param  array<int, mixed>  $line
     */
    private function isEmptyCsvLine(array $line): bool
    {
        foreach ($line as $value) {
            if (trim((string) $value) !== '') {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  array<string, string|null>  $row
     * @return array<string, mixed>|null
     */
    private function normalizeRow(array $row): ?array
    {
        $placeId = $this->nullableTrim($row['place_id'] ?? null);
        $cid = $this->nullableTrim($row['cid'] ?? null);
        $dataId = $this->nullableTrim($row['data_id'] ?? null);
        $title = $this->nullableTrim($row['title'] ?? null);
        $phone = $this->nullableTrim($row['phone'] ?? null);
        $address = $this->nullableTrim($row['address'] ?? null);
        $link = $this->nullableTrim($row['link'] ?? null);

        $dedupeSeed = $placeId
            ?? $cid
            ?? $dataId
            ?? implode('|', [$title, $phone, $address, $link]);

        if ($dedupeSeed === null || trim($dedupeSeed) === '' || $dedupeSeed === '|||') {
            return null;
        }

        return [
            'dedupe_key' => sha1(strtolower(trim($dedupeSeed))),
            'input_id' => $this->nullableTrim($row['input_id'] ?? null),
            'link' => $link,
            'title' => $title,
            'category' => $this->nullableTrim($row['category'] ?? null),
            'address' => $address,
            'open_hours' => $this->toJsonSafe($row['open_hours'] ?? null),
            'popular_times' => $this->toJsonSafe($row['popular_times'] ?? null),
            'website' => $this->nullableTrim($row['website'] ?? null),
            'phone' => $phone,
            'plus_code' => $this->nullableTrim($row['plus_code'] ?? null),
            'review_count' => $this->toNullableInt($row['review_count'] ?? null),
            'review_rating' => $this->toNullableFloat($row['review_rating'] ?? null),
            'reviews_per_rating' => $this->toJsonSafe($row['reviews_per_rating'] ?? null),
            'latitude' => $this->toNullableFloat($row['latitude'] ?? null),
            'longitude' => $this->toNullableFloat($row['longitude'] ?? null),
            'cid' => $cid,
            'status' => $this->nullableTrim($row['status'] ?? null),
            'descriptions' => $this->nullableTrim($row['descriptions'] ?? null),
            'reviews_link' => $this->nullableTrim($row['reviews_link'] ?? null),
            'thumbnail' => $this->nullableTrim($row['thumbnail'] ?? null),
            'timezone' => $this->nullableTrim($row['timezone'] ?? null),
            'price_range' => $this->nullableTrim($row['price_range'] ?? null),
            'data_id' => $dataId,
            'images' => $this->toJsonSafe($row['images'] ?? null),
            'reservations' => $this->nullableTrim($row['reservations'] ?? null),
            'order_online' => $this->nullableTrim($row['order_online'] ?? null),
            'menu' => $this->nullableTrim($row['menu'] ?? null),
            'owner' => $this->nullableTrim($row['owner'] ?? null),
            'complete_address' => $this->nullableTrim($row['complete_address'] ?? null),
            'about' => $this->toJsonSafe($row['about'] ?? null),
            'user_reviews' => $this->toJsonSafe($row['user_reviews'] ?? null),
            'emails' => $this->toJsonSafe($row['emails'] ?? null),
            'user_reviews_extended' => $this->toJsonSafe($row['user_reviews_extended'] ?? null),
            'place_id' => $placeId,
            'account_status' => 'New_lead',
        ];
    }

    private function nullableTrim(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $clean = trim($value);

        return $clean === '' ? null : $clean;
    }

    private function toNullableInt(?string $value): ?int
    {
        $clean = $this->nullableTrim($value);
        if ($clean === null || !is_numeric($clean)) {
            return null;
        }

        return (int) $clean;
    }

    private function toNullableFloat(?string $value): ?float
    {
        $clean = $this->nullableTrim($value);
        if ($clean === null || !is_numeric($clean)) {
            return null;
        }

        return (float) $clean;
    }

    private function toJsonSafe(?string $value): ?string
    {
        $clean = $this->nullableTrim($value);
        if ($clean === null) {
            return null;
        }

        $decoded = json_decode($clean, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        return json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
