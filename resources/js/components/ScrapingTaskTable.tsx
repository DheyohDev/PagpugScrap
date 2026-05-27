import React, { useEffect, useState } from 'react';
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Download } from 'lucide-react';
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// 1. Interface disesuaikan 100% dengan respons API Debian Anda
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
   proxies: string[] | null; // Tambahkan null karena di JSON Anda isinya null
}

interface Job {
    ID: string; // API menggunakan string untuk ID
    Name: string;
    Date: string;
    Status: string;
    Data: JobData;
}

export default function ScrapingTasksTable() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const targetPath = '/api/v1/jobs';

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

    const canDownload = (status: string) => {
        const s = status?.toLowerCase();
        return s === 'finished' || s === 'completed' || s === 'ok' || s === 'success';
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
                                                {canDownload(job.Status) ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="ml-auto flex gap-2"
                                                        onClick={() => window.open(`/api/v1/documents/${job.ID}/download`, '_blank')}
                                                    >
                                                        <Download className="h-4 w-4" /> CSV
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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

