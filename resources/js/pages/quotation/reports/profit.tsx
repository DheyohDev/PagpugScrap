import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface ReportData {
    totalQuotations: number;
    totalRevenue: string;
    totalCost: string;
    totalProfit: string;
    profitMargin: string;
    quotations: Array<{
        id: number;
        quotation_number: string;
        grand_total: string;
        total_cost: string;
        total_profit: string;
    }>;
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
        title: 'Reports',
        href: '/quotation/reports/profit',
    },
];

export default function ProfitReport() {
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/quotations');
            if (!response.ok) throw new Error('Failed to fetch report data');

            const apiData = await response.json();
            const quotations = apiData.data || [];

            const totalRevenue = quotations.reduce(
                (sum: number, q: any) => sum + parseFloat(q.grand_total || 0),
                0
            );
            const totalCost = quotations.reduce(
                (sum: number, q: any) => sum + parseFloat(q.total_cost || 0),
                0
            );
            const totalProfit = totalRevenue - totalCost;
            const profitMargin =
                totalRevenue > 0
                    ? (((totalRevenue - totalCost) / totalRevenue) * 100).toFixed(2)
                    : '0';

            setData({
                totalQuotations: quotations.length,
                totalRevenue: totalRevenue.toFixed(2),
                totalCost: totalCost.toFixed(2),
                totalProfit: totalProfit.toFixed(2),
                profitMargin: profitMargin,
                quotations: quotations.map((q: any) => ({
                    id: q.id,
                    quotation_number: q.quotation_number,
                    grand_total: q.grand_total,
                    total_cost: q.total_cost || '0',
                    total_profit: q.total_profit || (parseFloat(q.grand_total || 0) - parseFloat(q.total_cost || 0)).toFixed(4),
                })),
            });
        } catch (err) {
            setError('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profit Reports" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold">Profit Reports</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Analyze your quotation profitability and business metrics.
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8">Loading report data...</div>
                ) : data ? (
                    <>
                        {/* Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Total Revenue
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ${parseFloat(data.totalRevenue).toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Total Cost
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ${parseFloat(data.totalCost).toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Total Profit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        ${parseFloat(data.totalProfit).toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Percent className="w-4 h-4" />
                                        Profit Margin
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {data.profitMargin}%
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Report Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quotation Details</CardTitle>
                                <CardDescription>
                                    Detailed profit breakdown by quotation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Quotation #</TableHead>
                                                <TableHead className="text-right">Revenue</TableHead>
                                                <TableHead className="text-right">Cost</TableHead>
                                                <TableHead className="text-right">Profit</TableHead>
                                                <TableHead className="text-right">Margin</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.quotations.map((quotation) => {
                                                const revenue =
                                                    parseFloat(quotation.grand_total);
                                                const cost = parseFloat(
                                                    quotation.total_cost
                                                );
                                                const profit = revenue - cost;
                                                const margin =
                                                    revenue > 0
                                                        ? (
                                                            ((profit) /
                                                                revenue) *
                                                            100
                                                        ).toFixed(2)
                                                        : '0';

                                                return (
                                                    <TableRow
                                                        key={quotation.id}
                                                    >
                                                        <TableCell className="font-medium">
                                                            {
                                                                quotation.quotation_number
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            ${revenue.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            ${cost.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold text-green-600">
                                                            ${profit.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="text-right text-blue-600">
                                                            {margin}%
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No data available
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
