import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LeadAggregations } from '@/components/leads/types';

type Props = {
    data: LeadAggregations['kpis'] | null;
};

export default function DataLeadsKpi({ data }: Props) {
    const cards = [
        { label: 'Total Leads', value: data?.total_leads ?? 0 },
        { label: 'Total New Lead', value: data?.total_new_lead ?? 0 },
        { label: 'Average Rating', value: data?.avg_rating ?? 0 },
        { label: 'Distinct Category', value: data?.distinct_category ?? 0 },
    ];

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.label}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{card.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
