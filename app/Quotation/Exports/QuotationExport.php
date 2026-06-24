<?php

namespace App\Quotation\Exports;

use App\Quotation\Models\Quotation;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class QuotationExport implements FromArray, WithHeadings
{
    protected Quotation $quotation;

    public function __construct(Quotation $quotation)
    {
        $this->quotation = $quotation->load('items');
    }

    public function array(): array
    {
        $rows = [];

        foreach ($this->quotation->items as $item) {
            $rows[] = [
                $item->product_name_snapshot,
                $item->description,
                $item->quantity,
                $item->cost_price_snapshot,
                $item->selling_price_snapshot,
                $item->discount,
                $item->total,
            ];
        }

        return $rows;
    }

    public function headings(): array
    {
        return ['Product', 'Description', 'Quantity', 'Cost', 'Selling', 'Discount', 'Total'];
    }
}
