<?php

use App\Quotation\Controllers\ProductController;
use App\Quotation\Controllers\QuotationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('scraping', 'scraping')->name('scraping');
    Route::inertia('data-leads', 'data-leads')->name('data-leads');
    Route::inertia('data-leads/no-website', 'data-leads-no-website')->name('data-leads.no-website');
    Route::get('data-leads/{id}', function (string $id) {
        return Inertia::render('data-leads-detail', ['id' => $id]);
    })->name('data-leads.detail');

    Route::prefix('quotation')->group(function () {
        Route::resource('products', ProductController::class);
        Route::resource('quotations', QuotationController::class);

        // Inertia pages for Quotation module
        Route::inertia('/', 'quotation/index')->name('quotation.dashboard');
        Route::inertia('/products', 'quotation/products/index')->name('quotation.products');
        Route::inertia('/quotations', 'quotation/quotations/index')->name('quotation.quotations');
        Route::inertia('/reports/profit', 'quotation/reports/profit')->name('quotation.reports.profit');
        Route::inertia('/settings', 'quotation/settings/index')->name('quotation.settings');

        Route::get('quotations/{quotation}/export-pdf', [QuotationController::class, 'exportPdf'])->name('quotations.exportPdf');
        Route::get('quotations/{quotation}/export-excel', [QuotationController::class, 'exportExcel'])->name('quotations.exportExcel');
        Route::post('quotations/{quotation}/duplicate', [QuotationController::class, 'duplicate'])->name('quotations.duplicate');
        Route::get('quotations/{quotation}/revisions', [QuotationController::class, 'revisions'])->name('quotations.revisions');
    });

});

require __DIR__.'/settings.php';
