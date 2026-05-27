import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DataLeadDetail from '@/components/leads/DataLeadDetail';
import type { Lead } from '@/components/leads/types';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

export default function DataLeadsDetailPage({ id }: { id: string }) {
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/v1/leads/${id}`);
                if (!response.ok) throw new Error('Lead tidak ditemukan.');
                const result = await response.json();
                setLead(result.data ?? null);
            } catch (err: any) {
                setError(err.message ?? 'Terjadi kesalahan.');
            } finally {
                setLoading(false);
            }
        };

        void run();
    }, [id]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Data Leads', href: '/data-leads' },
                { title: `Lead #${id}`, href: `/data-leads/${id}` },
            ]}
        >
            <Head title={`Lead Detail #${id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Lead Detail</h1>
                    <Button asChild variant="outline">
                        <Link href="/data-leads">Kembali ke Data Leads</Link>
                    </Button>
                </div>

                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading detail...</p>
                ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : lead ? (
                    <DataLeadDetail lead={lead} />
                ) : (
                    <p className="text-sm text-muted-foreground">Data tidak tersedia.</p>
                )}
            </div>
        </AppLayout>
    );
}
