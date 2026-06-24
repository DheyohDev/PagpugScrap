import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, FileDown, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface QuotationItem {
    id: number;
    quotation_number: string;
    quotation_date: string;
    expired_date?: string;
    status: string;
    grand_total: string;
    total_profit: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/',
    },
    {
        title: 'Quotation',
        href: '/quotation',
    },
    {
        title: 'Quotations',
        href: '/quotation/quotations',
    },
];

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    accepted: 'bg-blue-100 text-blue-800',
};

export default function QuotationsIndex() {
    const [quotations, setQuotations] = useState<QuotationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/quotations');
            if (!response.ok) throw new Error('Failed to fetch quotations');
            const data = await response.json();
            setQuotations(data.data || []);
        } catch (err) {
            setError('Failed to load quotations');
        } finally {
            setLoading(false);
        }
    };

    const filtered = quotations.filter((q) =>
        q.quotation_number.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this quotation?')) {
            try {
                await fetch(`/api/v1/quotations/${id}`, { method: 'DELETE' });
                setQuotations(quotations.filter((q) => q.id !== id));
            } catch (err) {
                setError('Failed to delete quotation');
            }
        }
    };

    const handleExport = (id: number, format: 'pdf' | 'excel') => {
        const url =
            format === 'pdf'
                ? `/quotation/quotations/${id}/export-pdf`
                : `/quotation/quotations/${id}/export-excel`;
        window.open(url, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quotations" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Quotations</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Manage and track all your quotations.
                        </p>
                    </div>
                    <Link href="/quotation/quotations/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Quotation
                        </Button>
                    </Link>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Search Quotations</CardTitle>
                        <CardDescription>
                            Search by quotation number
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="Search quotation number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quotations List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No quotations found
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Number</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="text-right">Profit</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map((quotation) => (
                                            <TableRow key={quotation.id}>
                                                <TableCell className="font-medium">
                                                    {quotation.quotation_number}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(quotation.quotation_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={statusColors[quotation.status] || statusColors.draft}
                                                    >
                                                        {quotation.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    ${parseFloat(quotation.grand_total).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    ${parseFloat(quotation.total_profit).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleExport(quotation.id, 'pdf')}
                                                            title="Export as PDF"
                                                        >
                                                            <FileDown className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(quotation.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
