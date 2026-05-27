<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessCsvImport;
use App\Models\CsvImportTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CsvImportController extends Controller
{
    public function fromJob(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'job_id' => ['required', 'string'],
        ]);

        $existing = CsvImportTask::query()
            ->where('source_type', 'job')
            ->where('source_reference', $validated['job_id'])
            ->whereIn('status', ['queued', 'processing'])
            ->latest('id')
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Task import untuk job ini sudah berjalan.',
                'data' => $existing,
            ], 202);
        }

        $task = CsvImportTask::query()->create([
            'source_type' => 'job',
            'source_reference' => $validated['job_id'],
            'status' => 'queued',
            'meta' => ['trigger' => 'from_job'],
        ]);

        ProcessCsvImport::dispatch($task->id);

        return response()->json([
            'success' => true,
            'message' => 'Task import dari job berhasil dibuat.',
            'data' => $task,
        ], 202);
    }

    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimetypes:text/plain,text/csv,text/tsv,application/csv,application/vnd.ms-excel', 'max:10240'],
        ]);

        /** @var \Illuminate\Http\UploadedFile $file */
        $file = $validated['file'];
        $contents = (string) file_get_contents($file->getRealPath());
        $hash = hash('sha256', $contents);

        $existing = CsvImportTask::query()
            ->where('source_type', 'upload')
            ->where('file_hash', $hash)
            ->whereIn('status', ['queued', 'processing', 'done'])
            ->latest('id')
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'File yang sama sudah pernah / sedang diproses.',
                'data' => $existing,
            ], 202);
        }

        $storedPath = $file->storeAs(
            'imports',
            Str::uuid()->toString().'_'.$file->getClientOriginalName()
        );

        $task = CsvImportTask::query()->create([
            'source_type' => 'upload',
            'source_reference' => $file->getClientOriginalName(),
            'file_path' => $storedPath,
            'file_hash' => $hash,
            'status' => 'queued',
            'meta' => ['trigger' => 'upload'],
        ]);

        ProcessCsvImport::dispatch($task->id);

        return response()->json([
            'success' => true,
            'message' => 'Task import upload berhasil dibuat.',
            'data' => $task,
        ], 202);
    }

    public function show(string $id): JsonResponse
    {
        $task = CsvImportTask::query()->find($id);
        if (! $task) {
            return response()->json([
                'success' => false,
                'message' => 'Task import tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $task,
        ]);
    }
}
