import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DataLeadsCharts from '@/components/leads/DataLeadsCharts';
import type { LeadAggregations } from '@/components/leads/types';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },

];

export default function Dashboard() {
    const [aggregations, setAggregations] = useState<LeadAggregations | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/v1/leads/aggregations');
                if (!response.ok) {
                    throw new Error('Gagal memuat chart data leads.');
                }

                const json = await response.json();
                setAggregations(json.data ?? null);
            } catch (err: any) {
                setError(err.message ?? 'Terjadi kesalahan saat memuat chart.');
            } finally {
                setLoading(false);
            }
        };

        void run();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading charts...</p>
                        ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                        ) : (
                            <DataLeadsCharts data={aggregations} />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
