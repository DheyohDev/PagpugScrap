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
import { Edit, Trash2, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    description?: string;
    cost_price: string;
    selling_price: string;
    stock: number;
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
        title: 'Products',
        href: '/quotation/products',
    },
];

export default function ProductsIndex() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cost_price: '',
        selling_price: '',
        stock: '',
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/quotations/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data.data || []);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/quotations/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create product');

            const newProduct = await response.json();
            setProducts([...products, newProduct.data]);
            setFormData({
                name: '',
                description: '',
                cost_price: '',
                selling_price: '',
                stock: '',
            });
            setShowForm(false);
        } catch (err) {
            setError('Failed to create product');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`/api/v1/quotations/products/${id}`, { method: 'DELETE' });
                setProducts(products.filter((p) => p.id !== id));
            } catch (err) {
                setError('Failed to delete product');
            }
        }
    };

    const calculateMargin = (cost: string, selling: string): string => {
        const c = parseFloat(cost) || 0;
        const s = parseFloat(selling) || 0;
        if (c === 0) return '0%';
        return (((s - c) / c) * 100).toFixed(2) + '%';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Products</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Manage your product catalog for quotations.
                        </p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Search Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search Products</CardTitle>
                        <CardDescription>Search by product name</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="Search product name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </CardContent>
                </Card>

                {/* Add Product Form */}
                {showForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Product Name *
                                        </label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Cost Price *
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.cost_price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    cost_price: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Selling Price *
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.selling_price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    selling_price: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Stock
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    stock: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-input rounded-md text-sm"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit">Save Product</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No products found
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-right">Cost Price</TableHead>
                                            <TableHead className="text-right">Selling Price</TableHead>
                                            <TableHead className="text-right">Margin</TableHead>
                                            <TableHead className="text-right">Stock</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">
                                                    {product.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    ${parseFloat(product.cost_price).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    ${parseFloat(product.selling_price).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-green-600">
                                                    {calculateMargin(
                                                        product.cost_price,
                                                        product.selling_price
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {product.stock}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
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
