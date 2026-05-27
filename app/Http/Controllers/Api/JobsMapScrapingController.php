<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobsMapScraping;
use App\Http\Requests\StoreJobRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class JobsMapScrapingController extends Controller
{
    /**
     * GET /api/v1/jobs
     * Mengambil semua job
     */
    public function index(): JsonResponse
    {
        try {
            $jobs = JobsMapScraping::orderBy('created_at', 'desc')->get();
            return response()->json($jobs, 200);
        } catch (\Exception $e) {
            Log::error('Gagal mengambil data jobs: ' . $e->getMessage());
            return response()->json([
                'code' => 500,
                'message' => 'Internal Server Error: ' . $e->getMessage() // Menampilkan error detail
            ], 500);
        }
    }

    /**
     * POST /api/v1/jobs
     * Membuat task job baru
     */
    public function store(StoreJobRequest $request): JsonResponse
    {
        try {
            // Ekstrak data yang merupakan bagian dari "JobData"
            $jobData = $request->except(['name']);

            $job = JobsMapScraping::create([
                'name' => $request->input('name'),
                'status' => 'pending', // default awal
                'data' => $jobData
            ]);

            // Hitungan/Trigger API Scraper eksternal Anda bisa diletakkan di sini,
            // atau dipanggil via Laravel Jobs/Queue (disarankan)

            // Response sesuai skema "ApiScrapeResponse"
            return response()->json(['id' => $job->id], 201);

        } catch (\Exception $e) {
            Log::error('Gagal membuat job baru: ' . $e->getMessage());
            return response()->json([
                'code' => 500,
                'message' => 'Internal Server Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/v1/jobs/{id}
     * Mengambil spesifik job
     */
    public function show(string $id): JsonResponse
    {
        try {
            if (!Str::isUuid($id)) {
                return response()->json(['code' => 422, 'message' => 'Format ID tidak valid (Harus UUID)'], 422);
            }

            $job = JobsMapScraping::findOrFail($id);
            return response()->json($job, 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['code' => 404, 'message' => 'Job tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['code' => 500, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * DELETE /api/v1/jobs/{id}
     * Menghapus spesifik job
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            if (!Str::isUuid($id)) {
                return response()->json(['code' => 422, 'message' => 'Format ID tidak valid'], 422);
            }

            $job = JobsMapScraping::findOrFail($id);
            $job->delete();

            return response()->json(['message' => 'Job deleted successfully'], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['code' => 404, 'message' => 'Job tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['code' => 500, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * GET /api/v1/jobs/{id}/download
     * Mengunduh hasil sebagai CSV
     */
    public function download(string $id)
    {
        try {
            if (!Str::isUuid($id)) {
                return response()->json(['code' => 422, 'message' => 'Format ID tidak valid'], 422);
            }

            $job = JobsMapScraping::findOrFail($id);

            // LOGIKA DUMMY UNTUK GENERATE CSV (Sesuaikan dengan data scraper asli Anda)
            $csvHeaders = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="results_'.$job->id.'.csv"',
            ];

            $callback = function() use ($job) {
                $file = fopen('php://output', 'w');
                // Header CSV
                fputcsv($file, ['Nama Tempat', 'Rating', 'Alamat', 'Keyword Asal']);
                // Data CSV Dummy (Ganti dengan data hasil query dari database hasil scraping Anda)
                fputcsv($file, ['Contoh Kedai Kopi', '4.5', 'Jl. Ilion No 1', $job->data['keywords'][0] ?? 'N/A']);
                fclose($file);
            };

            return response()->stream($callback, 200, $csvHeaders);

        } catch (ModelNotFoundException $e) {
            return response()->json(['code' => 404, 'message' => 'File/Job tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['code' => 500, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
