import { Link } from '@inertiajs/react';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
// ✏️ tambah import SortBy & SortDir yang sudah diextract
import type { Lead, LeadFilters, LeadListMeta, SortBy, SortDir } from '@/components/leads/types';

type Props = {
    leads: Lead[];
    meta: LeadListMeta;
    filters: LeadFilters;
    onChange: (next: Partial<LeadFilters>) => void;
};

// ✏️ pakai SortBy langsung, bukan LeadFilters['sort_by']
const sortableColumns: Array<{ key: SortBy; label: string }> = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'review_count', label: 'Reviews' },
    { key: 'review_rating', label: 'Rating' },
    { key: 'account_status', label: 'Account Status' },
    { key: 'created_at', label: 'Created' },
];

export default function DataLeadsTable({ leads, meta, filters, onChange }: Props) {

    // ✏️ pakai SortBy & SortDir langsung
    const sortBy = (key: SortBy) => {
        const isCurrent = filters.sort_by === key;
        const nextDir: SortDir = isCurrent && filters.sort_dir === 'asc' ? 'desc' : 'asc';
        onChange({ sort_by: key, sort_dir: nextDir, page: 1 });
    };

    return (
        <div className="space-y-3">
            <div className="hidden overflow-x-auto rounded-md border md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[220px]">Title</TableHead>
                            <TableHead className="min-w-[120px]">Category</TableHead>
                            <TableHead className="min-w-[90px]">Rating</TableHead>
                            <TableHead className="min-w-[90px]">Reviews</TableHead>
                            <TableHead className="min-w-[120px]">Lead Status</TableHead>
                            <TableHead className="min-w-[120px]">Timezone</TableHead>
                            <TableHead className="min-w-[120px]">Created</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead colSpan={8}>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    {sortableColumns.map((item) => (
                                        <Button
                                            key={item.key}
                                            size="sm"
                                            // ✏️ filter.sort_by bisa undefined karena optional, tambah fallback
                                            variant={filters.sort_by === item.key ? 'default' : 'outline'}
                                            className="h-7 gap-1"
                                            onClick={() => sortBy(item.key)}
                                        >
                                            {item.label}
                                            <ArrowUpDown className="h-3 w-3" />
                                        </Button>
                                    ))}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-6 text-center text-sm text-muted-foreground">
                                    No leads found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium">{lead.title ?? '-'}</TableCell>
                                    <TableCell>{lead.category ?? '-'}</TableCell>
                                    <TableCell>{lead.review_rating ?? '-'}</TableCell>
                                    <TableCell>{lead.review_count ?? '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{lead.account_status ?? '-'}</Badge>
                                    </TableCell>
                                    <TableCell>{lead.timezone ?? '-'}</TableCell>
                                    <TableCell>
                                        {new Date(lead.created_at).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild size="sm" variant="outline">
                                            {/* ✏️ lead.id sekarang string, tidak perlu toString() */}
                                            <Link href={`/data-leads/${lead.id}`}>View Detail</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile cards — tidak ada perubahan */}
            <div className="grid gap-2 md:hidden">
                {leads.map((lead) => (
                    <div key={lead.id} className="rounded-md border p-3">
                        <p className="font-medium">{lead.title ?? '-'}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{lead.category ?? '-'}</p>
                        <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline">{lead.account_status ?? '-'}</Badge>
                            <Button asChild size="sm" variant="outline">
                                <Link href={`/data-leads/${lead.id}`}>Detail</Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination — tidak ada perubahan */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm">
                <p className="text-muted-foreground">
                    Showing {meta.from ?? 0}-{meta.to ?? 0} from {meta.total}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={meta.current_page <= 1}
                        onClick={() => onChange({ page: meta.current_page - 1 })}
                    >
                        Prev
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {meta.current_page} / {meta.last_page}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={meta.current_page >= meta.last_page}
                        onClick={() => onChange({ page: meta.current_page + 1 })}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
