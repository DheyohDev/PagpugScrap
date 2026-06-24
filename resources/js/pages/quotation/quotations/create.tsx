import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, AlertCircle } from 'lucide-react';
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
        title: 'Quotations',
        href: '/quotation/quotations',
    },
    {
        title: 'Create',
        href: '/quotation/quotations/create',
    },
];

interface QuotationItem {
    product_id?: number;
    product_name?: string;
    quantity: number;
    discount?: number;
}

export default function CreateQuotation() {
    const [items, setItems] = useState<QuotationItem[]>([{ quantity: 1 }]);

    const { data, setData, post, processing, errors } = useForm({
        quotation_number: '',
        quotation_date: new Date().toISOString().split('T')[0],
        expired_date: '',
        status: 'draft',
        notes: '',
        items: items,
    });

    const addItem = () => {
        const newItems = [...items, { quantity: 1 }];
        setItems(newItems);
        setData('items', newItems);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
        setData('items', newItems);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route('quotations.store'), {
            onSuccess: () => {
                router.visit(route('quotations.index'));
            },
        });
    };

    // Get error messages for display
    const getErrorMessage = (key: string): string | null => {
        const error = errors[key];
        if (!error) return null;
        return typeof error === 'string' ? error : Array.isArray(error) ? error[0] : null;
    };

    // Check if there are any errors
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Quotation" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/quotation/quotations">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create Quotation</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Create a new quotation with items
                        </p>
                    </div>
                </div>

                {hasErrors && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-800">Validation Error</h3>
                                <ul className="mt-2 space-y-1 text-sm text-red-700">
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {typeof value === 'string' ? value : Array.isArray(value) ? value[0] : 'Invalid value'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Enter quotation details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quotation_number">Quotation Number</Label>
                                    <Input
                                        id="quotation_number"
                                        placeholder="QT-001"
                                        value={data.quotation_number}
                                        onChange={(e) => setData('quotation_number', e.target.value)}
                                        className={getErrorMessage('quotation_number') ? 'border-red-500' : ''}
                                    />
                                    {getErrorMessage('quotation_number') && (
                                        <p className="text-sm text-red-500">{getErrorMessage('quotation_number')}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) =>
                                        setData('status', value)
                                    }>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quotation_date">Quotation Date</Label>
                                    <Input
                                        id="quotation_date"
                                        type="date"
                                        value={data.quotation_date}
                                        onChange={(e) => setData('quotation_date', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expired_date">Expiration Date</Label>
                                    <Input
                                        id="expired_date"
                                        type="date"
                                        value={data.expired_date}
                                        onChange={(e) => setData('expired_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Additional notes..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                            <CardDescription>
                                Add items to the quotation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No items added yet
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-4 gap-4 pb-4 border-b last:border-b-0">
                                        <div className="space-y-2">
                                            <Label htmlFor={`product_name_${index}`}>Product Name</Label>
                                            <Input
                                                id={`product_name_${index}`}
                                                placeholder="Product name"
                                                value={item.product_name || ''}
                                                onChange={(e) =>
                                                    updateItem(index, 'product_name', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                                            <Input
                                                id={`quantity_${index}`}
                                                type="number"
                                                placeholder="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(index, 'quantity', parseFloat(e.target.value) || 0)
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`discount_${index}`}>Discount</Label>
                                            <Input
                                                id={`discount_${index}`}
                                                type="number"
                                                placeholder="0"
                                                value={item.discount || ''}
                                                onChange={(e) =>
                                                    updateItem(index, 'discount', parseFloat(e.target.value) || 0)
                                                }
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addItem}
                                className="w-full"
                            >
                                Add Item
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-4 justify-end">
                        <Link href="/quotation/quotations">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing || items.length === 0}>
                            {processing ? 'Creating...' : 'Create Quotation'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
