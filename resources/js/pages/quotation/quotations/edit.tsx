import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
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
import { ArrowLeft } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Quotation {
    id: number;
    quotation_number: string;
    quotation_date: string;
    expired_date?: string;
    status: string;
    notes?: string;
    items?: QuotationItem[];
}

interface QuotationItem {
    id?: number;
    product_id?: number;
    product_name?: string;
    product_name_snapshot?: string;
    quantity: number;
    discount?: number;
}

interface EditQuotationProps {
    quotation: Quotation;
}

export default function EditQuotation({ quotation }: EditQuotationProps) {
    const [items, setItems] = useState<QuotationItem[]>(quotation.items || [{ quantity: 1 }]);
    const [error, setError] = useState<string | null>(null);

    const { data, setData, put, processing } = useForm({
        quotation_number: quotation.quotation_number || '',
        quotation_date: quotation.quotation_date || new Date().toISOString().split('T')[0],
        expired_date: quotation.expired_date || '',
        status: quotation.status || 'draft',
        notes: quotation.notes || '',
        items: items,
    });

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
            title: 'Edit',
            href: `/quotation/quotations/${quotation.id}/edit`,
        },
    ];

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
        setError(null);

        put(route('quotations.update', quotation.id), {
            onSuccess: () => {
                router.visit(route('quotations.index'));
            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                const errorMessages = Object.values(errors).join(', ');
                setError(errorMessages || 'Failed to update quotation');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Quotation" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/quotation/quotations">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Quotation</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Update quotation details and items
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Update quotation details
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
                                    />
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
                                Update items in the quotation
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
                                                value={item.product_name || item.product_name_snapshot || ''}
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
                            {processing ? 'Updating...' : 'Update Quotation'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
