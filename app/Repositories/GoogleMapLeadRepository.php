<?php

namespace App\Repositories;

use App\Models\GoogleMapLead;
use App\Repositories\Interfaces\GoogleMapLeadRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GoogleMapLeadRepository implements GoogleMapLeadRepositoryInterface
{
    public function __construct(protected GoogleMapLead $model) {}

    public function paginate(array $filters, string $sortBy, string $sortDir, int $perPage): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where(function ($builder) use ($q): void {
                $builder->where('title', 'ilike', "%{$q}%")
                    ->orWhere('category', 'ilike', "%{$q}%")
                    ->orWhere('address', 'ilike', "%{$q}%")
                    ->orWhere('phone', 'ilike', "%{$q}%")
                    ->orWhere('website', 'ilike', "%{$q}%")
                    ->orWhere('place_id', 'ilike', "%{$q}%");
            });
        }

        if (!empty($filters['account_status'])) {
            $query->where('account_status', $filters['account_status']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['timezone'])) {
            $query->where('timezone', $filters['timezone']);
        }

        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        return $query->orderBy($sortBy, $sortDir)->paginate($perPage);
    }

    public function findLeadsWithoutWebsiteOrFreedomains(array $filters, string $sortBy, string $sortDir, int $perPage): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->where(function ($builder): void {
                $builder->whereNull('website')
                    ->orWhere('website', '')
                    ->orWhereRaw(
                        "website ~* '\\.(blogspot|wordpress|wixsite|weebly|sites\\.google|webnode|jimdo|yolasite|mystrikingly|carrd|notion\\.site|my\\.id|web\\.id|biz\\.id|000webhostapp|infinityfreeapp|epizy|rf\\.gd|atwebpages|freevar|awardspace|byethost|freehostia|esy\\.es|hol\\.es|t15\\.org|t35\\.org|myftp|myftpupload|daftarjudionline|blogdrive|livejournal|tumblr|over-blog|blogger)\\.'"
                    )
                    ->orWhereRaw(
                        "website ~* '^https?://(www\\.)?(blogspot|wordpress|wixsite|weebly|sites\\.google|webnode|jimdo)\\.|shopee\\.co\\.id'"
                    );
            });

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where(function ($builder) use ($q): void {
                $builder->where('title', 'ilike', "%{$q}%")
                    ->orWhere('category', 'ilike', "%{$q}%")
                    ->orWhere('address', 'ilike', "%{$q}%");
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->orderBy($sortBy, $sortDir)->paginate($perPage);
    }

    public function findById(string $id): mixed
    {
        return $this->model->query()->find($id);
    }

    public function getAggregations(): array
    {
        $base = $this->model->query();

        $totalLeads      = (clone $base)->count();
        $totalNewLead    = (clone $base)->where('account_status', 'New_lead')->count();
        $avgRating       = round((float) ((clone $base)->avg('review_rating') ?? 0), 2);
        $distinctCategory = (clone $base)->whereNotNull('category')->distinct('category')->count('category');

        $statusDistribution = (clone $base)
            ->selectRaw('COALESCE(account_status, ?) as label, COUNT(*) as total', ['Unknown'])
            ->groupBy('account_status')
            ->orderByDesc('total')
            ->get();

        $topCategories = (clone $base)
            ->selectRaw('COALESCE(category, ?) as label, COUNT(*) as total', ['Unknown'])
            ->groupBy('category')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $timezoneDistribution = (clone $base)
            ->selectRaw('COALESCE(timezone, ?) as label, COUNT(*) as total', ['Unknown'])
            ->groupBy('timezone')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $dailyTrend = (clone $base)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at) ASC')
            ->limit(30)
            ->get();

        $ratingBuckets = (clone $base)
            ->selectRaw(
                "CASE
                    WHEN review_rating IS NULL THEN 'unknown'
                    WHEN review_rating < 1 THEN '0-1'
                    WHEN review_rating < 2 THEN '1-2'
                    WHEN review_rating < 3 THEN '2-3'
                    WHEN review_rating < 4 THEN '3-4'
                    ELSE '4-5'
                END as label, COUNT(*) as total"
            )
            ->groupBy('label')
            ->orderBy('label')
            ->get();

        $dataCompleteness = [
            'with_phone'      => (clone $base)->whereNotNull('phone')->where('phone', '!=', '')->count(),
            'without_phone'   => (clone $base)->where(fn($q) => $q->whereNull('phone')->orWhere('phone', ''))->count(),
            'with_website'    => (clone $base)->whereNotNull('website')->where('website', '!=', '')->count(),
            'without_website' => (clone $base)->where(fn($q) => $q->whereNull('website')->orWhere('website', ''))->count(),
        ];

        return compact(
            'totalLeads', 'totalNewLead', 'avgRating', 'distinctCategory',
            'statusDistribution', 'topCategories', 'timezoneDistribution',
            'dailyTrend', 'ratingBuckets', 'dataCompleteness'
        );
    }

    public function getFilterOptions(): array
    {
        return [
            'account_statuses' => $this->model->query()
                ->whereNotNull('account_status')
                ->distinct()->orderBy('account_status')
                ->pluck('account_status'),

            'categories' => $this->model->query()
                ->whereNotNull('category')
                ->distinct()->orderBy('category')
                ->limit(200)->pluck('category'),

            'timezones' => $this->model->query()
                ->whereNotNull('timezone')
                ->distinct()->orderBy('timezone')
                ->pluck('timezone'),
        ];
    }
}
