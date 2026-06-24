<?php

namespace App\Quotation\Controllers;

use App\Http\Controllers\Controller;
use App\Quotation\Models\Quotation;
use App\Quotation\Models\QuotationVersion;
use App\Quotation\Requests\StoreQuotationRequest;
use App\Quotation\Requests\UpdateQuotationRequest;
use App\Quotation\Services\ExportService;
use App\Quotation\Services\QuotationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuotationController extends Controller
{
    public function __construct(
        protected QuotationService $service,
        protected ExportService $exportService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $quotations = Quotation::query()->paginate($perPage);

        return response()->json(['success' => true, 'data' => $quotations]);
    }

    public function create(): Response
    {
        return Inertia::render('quotation/quotations/create');
    }

    public function edit(Quotation $quotation): Response
    {
        $quotation->load('items', 'versions', 'terms');

        return Inertia::render('quotation/quotations/edit', [
            'quotation' => $quotation,
        ]);
    }

    public function store(StoreQuotationRequest $request): JsonResponse
    {
        $quotation = $this->service->create($request->validated());

        return response()->json(['success' => true, 'data' => $quotation], 201);
    }

    public function show(Quotation $quotation): JsonResponse
    {
        $quotation->load('items', 'versions', 'terms');

        return response()->json(['success' => true, 'data' => $quotation]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): JsonResponse
    {
        $this->service->createVersion($quotation->id, 'Updated');

        // For simplicity, recreate items by deleting and creating from payload
        $data = $request->validated();

        $quotation->items()->delete();

        foreach ($data['items'] as $item) {
            $quotation->items()->create([
                'product_id' => $item['product_id'] ?? null,
                'product_name_snapshot' => $item['product_name'] ?? ($item['product_name_snapshot'] ?? 'N/A'),
                'description' => $item['description'] ?? null,
                'quantity' => $item['quantity'],
                'cost_price_snapshot' => $item['cost_price'] ?? 0,
                'selling_price_snapshot' => $item['selling_price'] ?? 0,
                'margin_percentage_snapshot' => $item['margin_percentage'] ?? 0,
                'discount' => $item['discount'] ?? 0,
                'total' => $item['total'] ?? 0,
            ]);
        }

        $quotation->save();

        return response()->json(['success' => true, 'data' => $quotation->fresh()]);
    }

    public function destroy(Quotation $quotation): JsonResponse
    {
        $quotation->delete();

        return response()->json(['success' => true]);
    }

    public function exportPdf(Quotation $quotation)
    {
        return $this->exportService->toPdf($quotation, true);
    }

    public function exportExcel(Quotation $quotation)
    {
        return $this->exportService->toExcel($quotation);
    }

    public function duplicate(int $quotationId): JsonResponse
    {
        $new = $this->service->duplicate($quotationId);

        return response()->json(['success' => true, 'data' => $new]);
    }

    public function revisions(int $quotationId): JsonResponse
    {
        $versions = QuotationVersion::where('quotation_id', $quotationId)->get();

        return response()->json(['success' => true, 'data' => $versions]);
    }
}
