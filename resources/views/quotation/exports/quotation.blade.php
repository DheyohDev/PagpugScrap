<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $quotation->quotation_number ?? 'Quotation' }}</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; }
        .header { display:flex; justify-content:space-between; margin-bottom:20px }
        table { width:100%; border-collapse: collapse; }
        th, td { border:1px solid #ddd; padding:8px; }
        th { background:#f7f7f7; }
        .right { text-align: right; }
    </style>
    </head>
<body>
    <div class="header">
        <div>
            <h2>{{ config('app.name') }}</h2>
            <div>{{ config('mail.from.address') }}</div>
        </div>
        <div>
            <h3>Quotation</h3>
            <div>No: {{ $quotation->quotation_number }}</div>
            <div>Date: {{ $quotation->quotation_date }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Description</th>
                <th class="right">Qty</th>
                <th class="right">Cost</th>
                <th class="right">Price</th>
                <th class="right">Discount</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quotation->items as $item)
                <tr>
                    <td>{{ $item->product_name_snapshot }}</td>
                    <td>{{ $item->description }}</td>
                    <td class="right">{{ $item->quantity }}</td>
                    <td class="right">{{ number_format($item->cost_price_snapshot,4) }}</td>
                    <td class="right">{{ number_format($item->selling_price_snapshot,4) }}</td>
                    <td class="right">{{ number_format($item->discount,4) }}</td>
                    <td class="right">{{ number_format($item->total,4) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top:20px; width:100%; display:flex; justify-content:flex-end;">
        <table style="width:50%;">
            <tr>
                <th>Subtotal</th>
                <td class="right">{{ number_format($quotation->subtotal,4) }}</td>
            </tr>
            <tr>
                <th>Discount</th>
                <td class="right">{{ number_format($quotation->discount_amount,4) }}</td>
            </tr>
            <tr>
                <th>Tax</th>
                <td class="right">{{ number_format($quotation->tax_amount,4) }}</td>
            </tr>
            <tr>
                <th>Grand Total</th>
                <td class="right">{{ number_format($quotation->grand_total,4) }}</td>
            </tr>
        </table>
    </div>

    @if($quotation->notes)
        <div style="margin-top:30px;">
            <strong>Notes</strong>
            <div>{{ $quotation->notes }}</div>
        </div>
    @endif

</body>
</html>
