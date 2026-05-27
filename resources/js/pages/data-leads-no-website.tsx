import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import DataLeadsFilters from '@/components/leads/DataLeadsFilters';
import DataLeadsTable from '@/components/leads/DataLeadsTable';
import type { Lead, LeadListMeta, LeadFilters } from '@/components/leads/types';
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
    sort_by: 'review_count',
    sort_dir: 'desc',
    per_page: 25,
    page: 1,
};

export default function DataLeadsNoWebsitePage() {
    const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [meta, setMeta] = useState<LeadListMeta>(defaultMeta);
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
                    const [listRes, filterRes] = await Promise.all([
                        fetch(`/api/v1/leads/no-website?${queryString}`),
                        fetch('/api/v1/leads/filters'),
                    ]);

                    if (!listRes.ok) throw new Error('Gagal memuat data leads.');
                    if (!filterRes.ok) throw new Error('Gagal memuat filter options.');

                    const listJson = await listRes.json();
                    const filterJson = await filterRes.json();

                    setLeads(listJson.data ?? []);
                    setMeta(listJson.meta ?? defaultMeta);
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
        <AppLayout breadcrumbs={[
            { title: 'Data Leads', href: '/data-leads' },
            { title: 'No Website Leads', href: '/data-leads/no-website' }
        ]}>
            <Head title="No Website Leads" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">No Website Leads</h1>
                <p className="text-sm text-muted-foreground">
                    Leads without a website or using free domain services (Blogspot, WordPress, Wix, etc.)
                </p>

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
