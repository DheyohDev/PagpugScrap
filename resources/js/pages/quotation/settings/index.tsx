import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

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
        title: 'Settings',
        href: '/quotation/settings',
    },
];

export default function QuotationSettings() {
    const [settings, setSettings] = useState({
        tax_rate: '10',
        currency: 'USD',
        default_payment_terms: '30 days',
        invoice_prefix: 'Q',
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (field: string, value: string) => {
        setSettings({ ...settings, [field]: value });
        setSaved(false);
    };

    const handleSave = async () => {
        try {
            // In a real app, you would save to backend
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save settings');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quotation Settings" />
            <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl">
                <div>
                    <h1 className="text-3xl font-bold">Quotation Settings</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Configure quotation module settings and defaults.
                    </p>
                </div>

                {saved && (
                    <div className="rounded-lg bg-green-50 p-4 text-green-600 text-sm">
                        Settings saved successfully!
                    </div>
                )}

                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>
                            Configure default settings for quotations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Quotation Number Prefix
                            </label>
                            <Input
                                value={settings.invoice_prefix}
                                onChange={(e) =>
                                    handleChange('invoice_prefix', e.target.value)
                                }
                                placeholder="e.g., Q"
                                className="max-w-xs"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Used to generate quotation numbers (e.g., Q-001, Q-002)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Default Tax Rate (%)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={settings.tax_rate}
                                onChange={(e) =>
                                    handleChange('tax_rate', e.target.value)
                                }
                                placeholder="10"
                                className="max-w-xs"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Default tax rate applied to new quotations
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Currency
                            </label>
                            <Input
                                value={settings.currency}
                                onChange={(e) =>
                                    handleChange('currency', e.target.value)
                                }
                                placeholder="USD"
                                className="max-w-xs"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Currency used in all quotations
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Default Payment Terms
                            </label>
                            <Input
                                value={settings.default_payment_terms}
                                onChange={(e) =>
                                    handleChange('default_payment_terms', e.target.value)
                                }
                                placeholder="30 days"
                                className="max-w-xs"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Default payment terms for new quotations
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Email Settings</CardTitle>
                        <CardDescription>
                            Configure email notifications for quotations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="email-quotation-created"
                                    defaultChecked
                                    className="rounded"
                                />
                                <label
                                    htmlFor="email-quotation-created"
                                    className="text-sm font-medium"
                                >
                                    Send email when quotation is created
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="email-quotation-updated"
                                    defaultChecked
                                    className="rounded"
                                />
                                <label
                                    htmlFor="email-quotation-updated"
                                    className="text-sm font-medium"
                                >
                                    Send email when quotation is updated
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="email-quotation-expired"
                                    defaultChecked
                                    className="rounded"
                                />
                                <label
                                    htmlFor="email-quotation-expired"
                                    className="text-sm font-medium"
                                >
                                    Send reminder when quotation expires
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-2">
                    <Button onClick={handleSave} className="px-8">
                        Save Settings
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
