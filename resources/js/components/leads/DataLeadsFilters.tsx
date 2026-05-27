import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { LeadFilters } from '@/components/leads/types';

type LeadFilterOptions = {
    account_statuses: string[];
    categories: string[];
    timezones: string[];
};

type Props = {
    filters: LeadFilters;
    options: LeadFilterOptions;
    onChange: (next: Partial<LeadFilters>) => void;
};

export default function DataLeadsFilters({ filters, options, onChange }: Props) {
    return (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <Input
                placeholder="Search title, phone, website, address..."
                value={filters.q}
                onChange={(e) => onChange({ q: e.target.value, page: 1 })}
            />

            <Select
                value={filters.account_status || 'all'}
                onValueChange={(value) => onChange({ account_status: value === 'all' ? '' : value, page: 1 })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Account Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Account Status</SelectItem>
                    {options.account_statuses.map((item) => (
                        <SelectItem key={item} value={item}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.category || 'all'}
                onValueChange={(value) => onChange({ category: value === 'all' ? '' : value, page: 1 })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {options.categories.map((item) => (
                        <SelectItem key={item} value={item}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.timezone || 'all'}
                onValueChange={(value) => onChange({ timezone: value === 'all' ? '' : value, page: 1 })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Timezone" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Timezones</SelectItem>
                    {options.timezones.map((item) => (
                        <SelectItem key={item} value={item}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={String(filters.per_page)}
                onValueChange={(value) => onChange({ per_page: Number(value), page: 1 })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="25">25 rows</SelectItem>
                    <SelectItem value="50">50 rows</SelectItem>
                    <SelectItem value="100">100 rows</SelectItem>
                    <SelectItem value="200">200 rows</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
