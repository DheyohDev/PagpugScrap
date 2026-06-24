import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Package, Settings, TrendingUp } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Stats {
    totalQuotations: number;
    totalProducts: number;
    totalRevenue: string;
    pendingQuotations: number;
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
];

export default function QuotationIndex() {
    const [stats, setStats] = useState<Stats>({
        totalQuotations: 0,
        totalProducts: 0,
        totalRevenue: '0.00',
        pendingQuotations: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/v1/quotations');
                if (!response.ok) throw new Error('Failed to fetch quotation stats');
                
                const data = await response.json();
                const quotations = data.data || [];
                
                setStats({
                    totalQuotations: quotations.length,
                    totalProducts: 0,
                    totalRevenue: quotations.reduce((sum: number, q: any) => sum + parseFloat(q.grand_total || 0), 0).toFixed(2),
                    pendingQuotations: quotations.filter((q: any) => q.status === 'pending').length,
                });
            } catch (err) {
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const quickActions = [
        {
            title: 'Create Quotation',
            description: 'Start a new quotation',
            href: '/quotation/quotations',
            icon: FileText,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Manage Products',
            description: 'View and edit products',
            href: '/quotation/products',
            icon: Package,
            color: 'bg-green-50 text-green-600',
        },
        {
            title: 'View Reports',
            description: 'Sales and profit reports',
            href: '/quotation/reports/profit',
            icon: TrendingUp,
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Settings',
            description: 'Module configuration',
            href: '/quotation/settings',
            icon: Settings,
            color: 'bg-orange-50 text-orange-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quotation Overview" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold">Quotation Overview</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Manage your quotations, products, and track your business metrics.
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Quotations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? '-' : stats.totalQuotations}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? '-' : stats.pendingQuotations}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? '-' : `$${parseFloat(stats.totalRevenue).toLocaleString()}`}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? '-' : stats.totalProducts}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link href={action.href} key={action.title} className="no-underline">
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                        <CardHeader>
                                            <div
                                                className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <CardTitle className="text-base">{action.title}</CardTitle>
                                            <CardDescription>{action.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button variant="outline" size="sm" asChild>
                                                <a>Open</a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
