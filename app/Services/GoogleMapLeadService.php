<?php

namespace App\Services;

use App\Repositories\Interfaces\GoogleMapLeadRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GoogleMapLeadService
{
    public function __construct(
        protected GoogleMapLeadRepositoryInterface $repository
    ) {}

    public function getPaginatedLeads(array $validated, array $queryParams): array
    {
        $perPage  = (int) ($validated['per_page'] ?? 25);
        $sortBy   = $validated['sort_by'] ?? 'created_at';
        $sortDir  = $validated['sort_dir'] ?? 'desc';

        $filters = array_filter(
            array_intersect_key($validated, array_flip([
                'q', 'account_status', 'category', 'timezone', 'date_from', 'date_to'
            ]))
        );

        $paginated = $this->repository
            ->paginate($filters, $sortBy, $sortDir, $perPage)
            ->appends($queryParams);

        return [
            'data' => $paginated->items(),
            'meta' => [
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'from'         => $paginated->firstItem(),
                'to'           => $paginated->lastItem(),
            ],
        ];
    }

    public function getLeadById(string $id): mixed
    {
        return $this->repository->findById($id);
    }

    public function getAggregations(): array
    {
        $data = $this->repository->getAggregations();

        return [
            'kpis' => [
                'total_leads'       => $data['totalLeads'],
                'total_new_lead'    => $data['totalNewLead'],
                'avg_rating'        => $data['avgRating'],
                'distinct_category' => $data['distinctCategory'],
            ],
            'status_distribution'   => $data['statusDistribution'],
            'top_categories'        => $data['topCategories'],
            'timezone_distribution' => $data['timezoneDistribution'],
            'daily_trend'           => $data['dailyTrend'],
            'rating_buckets'        => $data['ratingBuckets'],
            'data_completeness'     => $data['dataCompleteness'],
        ];
    }

    public function getFilterOptions(): array
    {
        return $this->repository->getFilterOptions();
    }

    public function getLeadsWithoutWebsiteOrFreedomains(array $validated, array $queryParams): array
    {
        $perPage = (int) ($validated['per_page'] ?? 25);
        $sortBy = $validated['sort_by'] ?? 'review_count';
        $sortDir = $validated['sort_dir'] ?? 'desc';

        $filters = array_filter(
            array_intersect_key($validated, array_flip(['q', 'category']))
        );

        $paginated = $this->repository
            ->findLeadsWithoutWebsiteOrFreedomains($filters, $sortBy, $sortDir, $perPage)
            ->appends($queryParams);

        return [
            'data' => $paginated->items(),
            'meta' => [
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'from'         => $paginated->firstItem(),
                'to'           => $paginated->lastItem(),
            ],
        ];
    }
}
