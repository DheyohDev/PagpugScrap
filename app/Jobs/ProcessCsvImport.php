<?php

namespace App\Jobs;

use App\Models\CsvImportTask;
use App\Services\GoogleMapLeadImportService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ProcessCsvImport implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $taskId)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(GoogleMapLeadImportService $importService): void
    {
        $task = CsvImportTask::query()->find($this->taskId);
        if (! $task) {
            return;
        }

        $task->update([
            'status' => 'processing',
            'started_at' => now(),
            'error_message' => null,
        ]);

        try {
            $csvContent = $task->source_type === 'upload'
                ? $this->loadFromUpload($task)
                : $this->loadFromJobDownload($task);

            $result = $importService->importFromCsvString($csvContent);

            $task->update([
                'status' => 'done',
                'total_rows' => $result['total_rows'],
                'processed_rows' => $result['processed_rows'],
                'failed_rows' => $result['failed_rows'],
                'finished_at' => now(),
            ]);
        } catch (\Throwable $e) {
            $task->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'finished_at' => now(),
            ]);
        }
    }

    private function loadFromUpload(CsvImportTask $task): string
    {
        if (! $task->file_path || ! Storage::exists($task->file_path)) {
            throw new \RuntimeException('File upload tidak ditemukan.');
        }

        return (string) Storage::get($task->file_path);
    }

    private function loadFromJobDownload(CsvImportTask $task): string
    {
        $baseUrl = rtrim((string) config('services.scraping.base_url'), '/');
        $jobId = (string) $task->source_reference;

        if ($baseUrl === '' || $jobId === '') {
            throw new \RuntimeException('Konfigurasi scraping base url / job id tidak valid.');
        }

        $response = Http::get($baseUrl.'/api/v1/jobs/'.$jobId.'/download');

        if (! $response->successful()) {
            throw new \RuntimeException('Gagal mengambil CSV dari server scraping.');
        }

        return (string) $response->body();
    }
}
