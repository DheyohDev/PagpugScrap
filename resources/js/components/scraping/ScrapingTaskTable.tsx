import { Download, Upload, Database } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface JobData {
    keywords: string[];
    lang: string;
    zoom: number;
    lat: string;
    lon: string;
    fast_mode: boolean;
    radius: number;
    depth: number;
    email: boolean;
    max_time: number;
    proxies: string[] | null;
}

interface Job {
    ID: string;
    Name: string;
    Date: string;
    Status: string;
    Data: JobData;
}

interface ImportTask {
    id: number;
    status: 'queued' | 'processing' | 'done' | 'failed';
    total_rows: number;
    processed_rows: number;
    failed_rows: number;
    error_message: string | null;
}

export default function ScrapingTasksTable() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [activeImportTaskId, setActiveImportTaskId] = useState<number | null>(null);
    const [activeTask, setActiveTask] = useState<ImportTask | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const targetPath = '/api/v1/jobs';

    const canDownload = (status: string) => {
        const s = status?.toLowerCase();
        return s === 'finished' || s === 'completed' || s === 'ok' || s === 'success';
    };

    const finishedJobs = useMemo(() => jobs.filter((job) => canDownload(job.Status)), [jobs]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`/api/v1/documents?path=${targetPath}`);

                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari server');
                }

                const result = await response.json();
                setJobs(Array.isArray(result.data) ? result.data : []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        if (!activeImportTaskId) return;

        const poll = async () => {
            try {
                const response = await fetch(`/api/v1/imports/${activeImportTaskId}`);
                if (!response.ok) return;

                const result = await response.json();
                const task = result.data as ImportTask;
                setActiveTask(task);

                if (task.status === 'done') {
                    setActionMessage(`Import selesai: ${task.processed_rows}/${task.total_rows} baris diproses.`);
                    setActiveImportTaskId(null);
                } else if (task.status === 'failed') {
                    setActionMessage(task.error_message || 'Import gagal diproses.');
                    setActiveImportTaskId(null);
                }
            } catch {
                // Polling best-effort; ignore single errors
            }
        };

        poll();
        const timer = window.setInterval(poll, 2500);
        return () => window.clearInterval(timer);
    }, [activeImportTaskId]);

    useEffect(() => {
        if (!selectedJobId && finishedJobs.length > 0) {
            setSelectedJobId(finishedJobs[0].ID);
        }
    }, [finishedJobs, selectedJobId]);

    const getStatusColor = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'completed' || s === 'success' || s === 'finished' || s === 'ok') {
            return 'bg-emerald-500 text-white hover:bg-emerald-600';
        }
        if (s === 'pending' || s === 'running' || s === 'in_progress') {
            return 'bg-blue-500 text-white hover:bg-blue-600';
        }
        if (s === 'failed' || s === 'error') return 'bg-red-500 text-white hover:bg-red-600';
        return 'bg-slate-500 text-white hover:bg-slate-600';
    };

    const formatDate = (date: string) => {
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return '-';
        return parsed.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const triggerImportFromJob = async () => {
        if (!selectedJobId) {
            setActionMessage('Pilih job yang sudah finished terlebih dahulu.');
            return;
        }

        setActionLoading(true);
        setActionMessage(null);
        try {
            const response = await fetch('/api/v1/imports/from-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ job_id: selectedJobId }),
            });

            const result = await response.json();
            if (!response.ok || !result?.data?.id) {
                throw new Error(result?.message || 'Gagal membuat task import.');
            }

            setActiveImportTaskId(result.data.id);
            setActionMessage('Task import dibuat. Menunggu worker queue...');
        } catch (err: any) {
            setActionMessage(err.message || 'Terjadi kesalahan saat trigger import.');
        } finally {
            setActionLoading(false);
        }
    };

    const triggerUploadImport = async (file: File) => {
        setActionLoading(true);
        setActionMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/v1/imports/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok || !result?.data?.id) {
                throw new Error(result?.message || 'Gagal membuat task upload import.');
            }

            setActiveImportTaskId(result.data.id);
            setActionMessage(`Upload diterima (${file.name}). Task sedang diproses...`);
        } catch (err: any) {
            setActionMessage(err.message || 'Gagal upload CSV.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="w-full shadow-sm">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    Memuat data scraping dari Debian...
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full shadow-sm">
                <CardContent className="py-10 text-center text-sm text-red-500">
                    Error: {error}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full border-border/60 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">Google Map Scraping Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {jobs && jobs.length > 0 ? (
                    <>
                        <div className="grid gap-3 md:hidden">
                            {jobs.map((job) => (
                                <Card key={job.ID} className="border-border/60 shadow-none">
                                    <CardContent className="space-y-3 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold">{job.Name}</p>
                                                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                                                    {job.ID.substring(0, 10)}...
                                                </p>
                                            </div>
                                            <Badge className={getStatusColor(job.Status)}>{job.Status}</Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div className="rounded-md bg-muted/40 p-2">
                                                <p className="text-muted-foreground">Date</p>
                                                <p className="mt-1 font-medium text-foreground">{formatDate(job.Date)}</p>
                                            </div>
                                            <div className="rounded-md bg-muted/40 p-2">
                                                <p className="text-muted-foreground">Keywords</p>
                                                <p className="mt-1 font-medium text-foreground">{job.Data?.keywords?.length || 0}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {job.Data?.fast_mode && (
                                                <Badge variant="outline" className="h-5 text-[10px]">Fast</Badge>
                                            )}
                                            {job.Data?.email && (
                                                <Badge variant="outline" className="h-5 text-[10px]">Email</Badge>
                                            )}
                                        </div>

                                        {canDownload(job.Status) ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-center gap-2"
                                                onClick={() => window.open(`/api/v1/documents/${job.ID}/download`, '_blank')}
                                            >
                                                <Download className="h-4 w-4" /> Download CSV
                                            </Button>
                                        ) : (
                                            <p className="text-center text-xs text-muted-foreground">File belum tersedia</p>
                                        )}
                                        {canDownload(job.Status) && (
                                            <Button
                                                variant={selectedJobId === job.ID ? "default" : "secondary"}
                                                size="sm"
                                                className="w-full"
                                                onClick={() => setSelectedJobId(job.ID)}
                                            >
                                                {selectedJobId === job.ID ? 'Job Terpilih' : 'Pilih untuk Import'}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="hidden overflow-x-auto rounded-md border md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden w-[140px] lg:table-cell">Job ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="hidden lg:table-cell">Config</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobs.map((job) => (
                                        <TableRow key={job.ID}>
                                            <TableCell className="hidden font-mono text-xs lg:table-cell">
                                                {job.ID.substring(0, 8)}...
                                            </TableCell>
                                            <TableCell className="max-w-[220px] truncate font-medium">
                                                {job.Name}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(job.Date)}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                                    <span>{job.Data?.keywords?.length || 0} Keywords</span>
                                                    <div className="flex gap-1">
                                                        {job.Data?.fast_mode && <Badge variant="outline" className="h-4 text-[10px]">Fast</Badge>}
                                                        {job.Data?.email && <Badge variant="outline" className="h-4 text-[10px]">Email</Badge>}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(job.Status)}>
                                                    {job.Status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="ml-auto flex justify-end gap-2">
                                                    {canDownload(job.Status) ? (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex gap-2"
                                                                onClick={() => window.open(`/api/v1/documents/${job.ID}/download`, '_blank')}
                                                            >
                                                                <Download className="h-4 w-4" /> CSV
                                                            </Button>
                                                            <Button
                                                                variant={selectedJobId === job.ID ? "default" : "secondary"}
                                                                size="sm"
                                                                onClick={() => setSelectedJobId(job.ID)}
                                                            >
                                                                {selectedJobId === job.ID ? 'Terpilih' : 'Pilih'}
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="rounded-md border bg-muted/20 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">Bottom Action: Generate ke PostgreSQL</p>
                                    <p className="text-xs text-muted-foreground">
                                        Import async via queue, deduplikasi upsert, dan account_status otomatis New_lead.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <select
                                        className="h-9 rounded-md border bg-background px-3 text-sm"
                                        value={selectedJobId}
                                        onChange={(e) => setSelectedJobId(e.target.value)}
                                    >
                                        {finishedJobs.length === 0 && <option value="">Tidak ada job siap import</option>}
                                        {finishedJobs.map((job) => (
                                            <option key={job.ID} value={job.ID}>
                                                {job.Name}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        className="gap-2"
                                        onClick={triggerImportFromJob}
                                        disabled={actionLoading || !selectedJobId || activeImportTaskId !== null}
                                    >
                                        <Database className="h-4 w-4" />
                                        {actionLoading ? 'Memproses...' : 'Generate dari Job'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() => uploadInputRef.current?.click()}
                                        disabled={actionLoading || activeImportTaskId !== null}
                                    >
                                        <Upload className="h-4 w-4" />
                                        Upload CSV
                                    </Button>
                                    <input
                                        ref={uploadInputRef}
                                        type="file"
                                        accept=".csv,text/csv"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                void triggerUploadImport(file);
                                            }
                                            e.currentTarget.value = '';
                                        }}
                                    />
                                </div>
                            </div>

                            {(actionMessage || activeTask) && (
                                <div className="mt-3 rounded-md bg-background p-3 text-xs text-muted-foreground">
                                    {actionMessage && <p>{actionMessage}</p>}
                                    {activeTask && (
                                        <p>
                                            Status task: <strong>{activeTask.status}</strong> | total: {activeTask.total_rows} | berhasil: {activeTask.processed_rows} | gagal: {activeTask.failed_rows}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="rounded-md border py-10 text-center text-sm text-muted-foreground">
                        Tidak ada data.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
