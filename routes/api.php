<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JobsMapScrapingController;
use App\Http\Controllers\Api\DocumentApiController;
use App\Http\Controllers\Api\CsvImportController;
use App\Http\Controllers\Api\GoogleMapLeadController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {

    // Rute CRUD untuk Jobs
    // Route::get('/jobs', [JobsMapScrapingController::class, 'index']);
    // Route::post('/jobs', [JobsMapScrapingController::class, 'store']);
    // Route::get('/jobs/{id}', [JobsMapScrapingController::class, 'show']);
    // Route::delete('/jobs/{id}', [JobsMapScrapingController::class, 'destroy']);

    // Rute Download CSV
    // Route::get('/jobs/{id}/download', [JobsMapScrapingController::class, 'download']);

    // Route::post('/documents', [DocumentApiController::class, 'store']);
    Route::get('/documents', [DocumentApiController::class, 'index']);
    Route::post('/documents', [DocumentApiController::class, 'store']);
    Route::get('/documents/{id}/download', [DocumentApiController::class, 'download']);
    Route::post('/imports/from-job', [CsvImportController::class, 'fromJob']);
    Route::post('/imports/upload', [CsvImportController::class, 'upload']);
    Route::get('/imports/{id}', [CsvImportController::class, 'show']);
    Route::get('/leads', [GoogleMapLeadController::class, 'index']);
    Route::get('/leads/no-website', [GoogleMapLeadController::class, 'noWebsiteLeads']);
    Route::get('/leads/aggregations', [GoogleMapLeadController::class, 'aggregations']);
    Route::get('/leads/filters', [GoogleMapLeadController::class, 'filters']);
    Route::post('/leads/{id}/whatsapp/generate', [GoogleMapLeadController::class, 'generateWhatsappMessage']);
    Route::get('/leads/{id}', [GoogleMapLeadController::class, 'show']);

});
