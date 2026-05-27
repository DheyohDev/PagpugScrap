<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DocumentApiController extends Controller
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.scraping.base_url'), '/');
    }

    private function buildUrl(string $path): string
    {
        return $this->baseUrl . '/' . ltrim($path, '/');
    }

    public function index(Request $request)
    {
        $path = $request->query('path', '/api/v1/jobs');
        $fullUrl = $this->buildUrl($path);

        try {
            $response = Http::get($fullUrl);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'data' => $response->json()
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dari service scraping',
                'url_hit' => $fullUrl
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan koneksi ke server lokal',
                'url_hit' => $fullUrl,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $path = $request->query('path', '/api/v1/jobs');
        $fullUrl = $this->buildUrl($path);

        try {
            $response = Http::post($fullUrl, $request->all());

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'data' => $response->json()
                ], 201);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat job di server Debian',
                'error' => $response->body()
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Koneksi ke server Debian terputus',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function download($id)
    {
        $fullUrl = $this->buildUrl("/api/v1/jobs/{$id}/download");

        try {
            $response = Http::get($fullUrl);

            if ($response->successful()) {
                return response()->streamDownload(function () use ($response) {
                    echo $response->body();
                }, "scraping_result_{$id}.csv", [
                    'Content-Type' => 'text/csv',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengunduh file dari server Debian'
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
