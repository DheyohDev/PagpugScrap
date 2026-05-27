import type { LeadAggregations } from '@/components/leads/types';
import type { ReactNode } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ChartItem = { label: string; total: number };

type Props = {
    data: LeadAggregations | null;
};

const CHART_COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#f97316'];

function ChartCard({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[260px]">{children}</CardContent>
        </Card>
    );
}

export default function DataLeadsCharts({ data }: Props) {
    const completeness = data?.data_completeness;
    const completenessItems: ChartItem[] = completeness
        ? [
              { label: 'With Phone', total: completeness.with_phone },
              { label: 'Without Phone', total: completeness.without_phone },
              { label: 'With Website', total: completeness.with_website },
              { label: 'Without Website', total: completeness.without_website },
          ]
        : [];
    const dailyTrendItems = (data?.daily_trend ?? []).map((item) => ({ label: item.date, total: item.total }));
    const hasData = (items: ChartItem[]) => items.length > 0;

    return (
        <div className="grid gap-3 lg:grid-cols-2">
            <ChartCard title="Bar Chart - Top Categories">
                {hasData(data?.top_categories ?? []) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data?.top_categories ?? []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground">No data</p>
                )}
            </ChartCard>

            <ChartCard title="Line Chart - Daily Trend">
                {hasData(dailyTrendItems) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyTrendItems}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground">No data</p>
                )}
            </ChartCard>

            <ChartCard title="Area Chart - Timezone Distribution">
                {hasData(data?.timezone_distribution ?? []) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.timezone_distribution ?? []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="total" stroke={CHART_COLORS[2]} fill={CHART_COLORS[2]} fillOpacity={0.25} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground">No data</p>
                )}
            </ChartCard>

            <ChartCard title="Pie / Donut Chart - Lead Status">
                {hasData(data?.status_distribution ?? []) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data?.status_distribution ?? []}
                                dataKey="total"
                                nameKey="label"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={2}
                            >
                                {(data?.status_distribution ?? []).map((item, index) => (
                                    <Cell key={item.label} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground">No data</p>
                )}
            </ChartCard>

            <ChartCard title="Radar Chart - Review Rating Buckets">
                {hasData(data?.rating_buckets ?? []) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={data?.rating_buckets ?? []}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="label" />
                            <Tooltip />
                            <Radar dataKey="total" stroke={CHART_COLORS[4]} fill={CHART_COLORS[4]} fillOpacity={0.35} />
                        </RadarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground">No data</p>
                )}
            </ChartCard>

            <ChartCard title="Bar Chart - Data Completeness">
                {hasData(completenessItems) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={completenessItems}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                {completenessItems.map((item, index) => (
                                    <Cell key={item.label} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground">No data</p>
                )}
            </ChartCard>
        </div>
    );
}
