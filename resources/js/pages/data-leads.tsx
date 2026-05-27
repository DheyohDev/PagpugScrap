import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import DataLeadsFilters from '@/components/leads/DataLeadsFilters';
import DataLeadsKpi from '@/components/leads/DataLeadsKpi';
import DataLeadsTable from '@/components/leads/DataLeadsTable';
import type { Lead, LeadAggregations, LeadFilters, LeadListMeta } from '@/components/leads/types';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

const defaultMeta: LeadListMeta = {
    total: 0,
    per_page: 25,
    current_page: 1,
    last_page: 1,
    from: null,
    to: null,
};

const defaultFilters: LeadFilters = {
    q: '',
    account_status: '',
    category: '',
    timezone: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
    per_page: 25,
    page: 1,
};

export default function DataLeadsPage() {
    const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [meta, setMeta] = useState<LeadListMeta>(defaultMeta);
    const [aggregations, setAggregations] = useState<LeadAggregations | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterOptions, setFilterOptions] = useState<{ account_statuses: string[]; categories: string[]; timezones: string[] }>({
        account_statuses: [],
        categories: [],
        timezones: [],
    });

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                params.set(key, String(value));
            }
        });
        return params.toString();
    }, [filters]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const run = async () => {
                setLoading(true);
                setError(null);
                try {
                    const [listRes, aggRes, filterRes] = await Promise.all([
                        fetch(`/api/v1/leads?${queryString}`),
                        fetch('/api/v1/leads/aggregations'),
                        fetch('/api/v1/leads/filters'),
                    ]);

                    if (!listRes.ok) throw new Error('Gagal memuat data leads.');
                    if (!aggRes.ok) throw new Error('Gagal memuat agregasi leads.');
                    if (!filterRes.ok) throw new Error('Gagal memuat filter options.');

                    const listJson = await listRes.json();
                    const aggJson = await aggRes.json();
                    const filterJson = await filterRes.json();

                    setLeads(listJson.data ?? []);
                    setMeta(listJson.meta ?? defaultMeta);
                    setAggregations(aggJson.data ?? null);
                    setFilterOptions(filterJson.data ?? { account_statuses: [], categories: [], timezones: [] });
                } catch (err: any) {
                    setError(err.message ?? 'Terjadi kesalahan.');
                } finally {
                    setLoading(false);
                }
            };

            void run();
        }, 350);

        return () => window.clearTimeout(timer);
    }, [queryString]);

    const updateFilters = (next: Partial<LeadFilters>) => {
        setFilters((prev) => ({ ...prev, ...next }));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Data Leads', href: '/data-leads' }]}>
            <Head title="Data Leads" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Data Leads</h1>

                <DataLeadsKpi data={aggregations?.kpis ?? null} />

                <Card>
                    <CardContent className="space-y-4 p-4">
                        <DataLeadsFilters filters={filters} options={filterOptions} onChange={updateFilters} />

                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading leads...</p>
                        ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                        ) : (
                            <DataLeadsTable
                                leads={leads}
                                meta={meta}
                                filters={filters}
                                onChange={updateFilters}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
