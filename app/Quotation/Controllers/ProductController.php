<?php

namespace App\Quotation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Quotation\Requests\StoreProductRequest;
use App\Quotation\Requests\UpdateProductRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $products = Product::query()->paginate($perPage);

        return response()->json(['success' => true, 'data' => $products]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $product = Product::create(array_merge($validated, ['created_by' => $request->user()->id]));

        return response()->json(['success' => true, 'data' => $product], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->fill($request->validated());
        $product->updated_by = $request->user()->id;
        $product->save();

        return response()->json(['success' => true, 'data' => $product]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['success' => true]);
    }
}
