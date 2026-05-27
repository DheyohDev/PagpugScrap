<?php

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

});

require __DIR__.'/settings.php';


