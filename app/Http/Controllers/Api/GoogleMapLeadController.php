<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleMapLeadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GoogleMapLeadController extends Controller
{
    public function __construct(
        protected GoogleMapLeadService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page'           => ['nullable', 'integer', 'min:1'],
            'per_page'       => ['nullable', 'integer', 'min:10', 'max:200'],
            'q'              => ['nullable', 'string', 'max:255'],
            'account_status' => ['nullable', 'string', 'max:100'],
            'category'       => ['nullable', 'string', 'max:255'],
            'timezone'       => ['nullable', 'string', 'max:255'],
            'date_from'      => ['nullable', 'date'],
            'date_to'        => ['nullable', 'date'],
            'sort_by'        => ['nullable', Rule::in(['created_at', 'title', 'category', 'review_count', 'review_rating', 'account_status'])],
            'sort_dir'       => ['nullable', Rule::in(['asc', 'desc'])],
        ]);

        $result = $this->service->getPaginatedLeads($validated, $request->query());

        return response()->json(['success' => true, ...$result]);
    }

    public function show(string $id): JsonResponse
    {
        $lead = $this->service->getLeadById($id);

        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead tidak ditemukan.',
            ], 404);
        }

        return response()->json(['success' => true, 'data' => $lead]);
    }

    public function aggregations(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->service->getAggregations(),
        ]);
    }

    public function filters(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->service->getFilterOptions(),
        ]);
    }

    public function noWebsiteLeads(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page'     => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:200'],
            'q'        => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'sort_by'  => ['nullable', Rule::in(['created_at', 'title', 'category', 'review_count', 'review_rating'])],
            'sort_dir' => ['nullable', Rule::in(['asc', 'desc'])],
        ]);

        $result = $this->service->getLeadsWithoutWebsiteOrFreedomains($validated, $request->query());

        return response()->json(['success' => true, ...$result]);
    }
}
