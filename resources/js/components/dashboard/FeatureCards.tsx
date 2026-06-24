import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Package, Settings } from 'lucide-react';

export default function FeatureCards() {
    const features = [
        {
            icon: FileText,
            title: 'Quotation',
            description: 'Create and manage quotations for your business',
            href: '/quotation',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            icon: Package,
            title: 'Products',
            description: 'Manage your product catalog',
            href: '/quotation/products',
            color: 'bg-green-50 text-green-600',
        },
        {
            icon: FileText,
            title: 'Quotations List',
            description: 'View all your quotations',
            href: '/quotation/quotations',
            color: 'bg-purple-50 text-purple-600',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
                const Icon = feature.icon;
                return (
                    <Link href={feature.href} key={feature.title} className="no-underline">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-2`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
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
    );
}
