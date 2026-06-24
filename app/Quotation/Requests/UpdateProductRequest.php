<?php

namespace App\Quotation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id ?? null;

        return [
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'unit_id' => ['nullable', 'integer', 'exists:units,id'],
            'code' => ['required', 'string', 'max:50', 'unique:products,code,'.$productId],
            'name' => ['required', 'string', 'max:191'],
            'description' => ['nullable', 'string'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'default_margin_percentage' => ['nullable', 'numeric', 'min:0'],
            'selling_price' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
