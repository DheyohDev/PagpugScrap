<?php

namespace App\Quotation\Services;

use App\Quotation\Exports\QuotationExport;
use App\Quotation\Models\Quotation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;

class ExportService
{
    /**
     * Export quotation to PDF. Returns a stream/download response.
     */
    public function toPdf(Quotation $quotation, bool $download = true)
    {
        $view = view('quotation.exports.quotation', ['quotation' => $quotation]);

        $pdf = Pdf::loadHTML($view->render())->setPaper('a4');

        if ($download) {
            return $pdf->download($quotation->quotation_number.'.pdf');
        }

        return $pdf->stream();
    }

    /**
     * Export quotation to Excel using QuotationExport.
     */
    public function toExcel(Quotation $quotation)
    {
        $export = new QuotationExport($quotation);

        return Excel::download($export, $quotation->quotation_number.'.xlsx');
    }
}
