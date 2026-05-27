<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface GoogleMapLeadRepositoryInterface
{
    public function paginate(array $filters, string $sortBy, string $sortDir, int $perPage): LengthAwarePaginator;
    public function findById(string $id): mixed;
    public function getAggregations(): array;
    public function getFilterOptions(): array;
}
