import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Lead } from '@/components/leads/types';
import {
    Building2,
    Calendar,
    Check,
    Clock,
    Copy,
    ExternalLink,
    Globe,
    Mail,
    MapPin,
    MessageSquareText,
    Phone,
    Star,
    Tag,
    User,
    TrendingUp,
    TrendingDown,
    MoreHorizontal,
    Share2,
    Download,
    Sparkles,
    Zap,
    Shield,
    Award
} from 'lucide-react';

/* ───────────────────────────── helpers ───────────────────────────── */

function statusColor(status: string | null | undefined) {
    switch (status?.toLowerCase()) {
        case 'new':
            return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25';
        case 'contacted':
            return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25';
        case 'qualified':
            return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25';
        case 'converted':
            return 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/25';
        case 'lost':
            return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25';
        default:
            return 'bg-secondary text-secondary-foreground';
    }
}

function statusGradient(status: string | null | undefined) {
    switch (status?.toLowerCase()) {
        case 'new':
            return 'from-blue-500/20 to-blue-600/5';
        case 'contacted':
            return 'from-amber-500/20 to-amber-600/5';
        case 'qualified':
            return 'from-emerald-500/20 to-emerald-600/5';
        case 'converted':
            return 'from-violet-500/20 to-violet-600/5';
        case 'lost':
            return 'from-red-500/20 to-red-600/5';
        default:
            return 'from-primary/20 to-primary/5';
    }
}

function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return '-';
    try {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateStr));
    } catch {
        return dateStr;
    }
}

/* ───────────────────────── tiny sub-components ───────────────────── */

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function StarRating({ rating }: { rating: number }) {
    const full = Math.floor(rating);
    const partial = rating - full;
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
                const fill = i < full ? 100 : i === full ? Math.round(partial * 100) : 0;
                return (
                    <span key={i} className="relative inline-block h-4 w-4">
                        <Star className="absolute inset-0 h-4 w-4 text-muted-foreground/20" />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        </span>
                    </span>
                );
            })}
        </div>
    );
}

function BigStarRating({ rating }: { rating: number }) {
    const full = Math.floor(rating);
    const partial = rating - full;
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                const fill = i < full ? 100 : i === full ? Math.round(partial * 100) : 0;
                return (
                    <span key={i} className="relative inline-block h-6 w-6">
                        <Star className="absolute inset-0 h-6 w-6 text-muted-foreground/20" />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                        </span>
                    </span>
                );
            })}
        </div>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
    copyable = false,
    isLink = false,
    variant = 'default'
}: {
    icon: React.ElementType;
    label: string;
    value: string | number | null | undefined;
    copyable?: boolean;
    isLink?: boolean;
    variant?: 'default' | 'accent';
}) {
    const displayValue = value ?? '-';
    return (
        <div className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted/60">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${variant === 'accent' ? 'bg-gradient-to-br from-primary to-primary/70 text-primary-foreground' : 'bg-gradient-to-br from-primary/10 to-primary/5 text-primary'}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <div className="flex items-center gap-1">
                    {isLink && typeof displayValue === 'string' && displayValue !== '-' ? (
                        <a
                            href={displayValue.startsWith('http') ? displayValue : `https://${displayValue}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            <span className="max-w-[260px] truncate">{displayValue}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                    ) : (
                        <p className="text-sm font-medium">{displayValue}</p>
                    )}
                    {copyable && typeof displayValue === 'string' && displayValue !== '-' && (
                        <span className="opacity-0 transition-opacity group-hover:opacity-100">
                            <CopyButton value={String(displayValue)} />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function DashboardCard({
    icon: Icon,
    label,
    value,
    subtitle,
    trend,
    trendUp
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    subtitle?: string;
    trend?: string;
    trendUp?: boolean;
}) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl transition-all group-hover:scale-150" />

            <CardContent className="relative flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/10 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
                    <div className="mt-0.5 text-2xl font-bold tracking-tight">{value}</div>
                    {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {trend}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function RatingDistribution({ reviewsPerRating, totalReviews }: { reviewsPerRating: unknown; totalReviews: number }) {
    if (!reviewsPerRating || typeof reviewsPerRating !== 'object') return null;
    const ratings = reviewsPerRating as Record<string, number>;
    const entries = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: ratings[String(star)] ?? 0,
    }));

    return (
        <div className="space-y-3">
            {entries.map(({ star, count }) => {
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                    <div key={star} className="flex items-center gap-3 group">
                        <span className="flex w-8 items-center justify-end gap-0.5 text-xs font-medium text-muted-foreground">
                            {star} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 group-hover:from-amber-500 group-hover:to-amber-400"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="w-10 text-right text-xs text-muted-foreground font-medium">{count}</span>
                    </div>
                );
            })}
        </div>
    );
}

type ReviewItem = { name: string; rating: number | null; text: string | null };

/**
 * Extracts review items from any possible data shape returned by Google Maps scraper.
 */
function extractReviewItems(data: unknown): ReviewItem[] {
    if (!data) return [];

    let parsed = data;
    if (typeof parsed === 'string') {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            return [];
        }
    }

    if (Array.isArray(parsed)) {
        return parsed
            .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
            .map((item) => ({
                name: String(item.name ?? item.author ?? item.reviewer ?? item.user ?? 'Anonymous'),
                rating: item.rating != null ? Number(item.rating) : (item.stars != null ? Number(item.stars) : null),
                text: item.text != null ? String(item.text) : (item.snippet != null ? String(item.snippet) : (item.review != null ? String(item.review) : (item.comment != null ? String(item.comment) : null))),
            }));
    }

    if (typeof parsed === 'object' && parsed !== null) {
        const obj = parsed as Record<string, unknown>;
        for (const key of ['reviews', 'items', 'data', 'results', 'list']) {
            if (Array.isArray(obj[key])) {
                return extractReviewItems(obj[key]);
            }
        }
        for (const val of Object.values(obj)) {
            if (Array.isArray(val) && val.length > 0) {
                return extractReviewItems(val);
            }
        }
    }

    return [];
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
    if (!value) return null;
    return (
        <Card className="border-dashed border-border/60 bg-gradient-to-br from-muted/50 to-muted/30">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-primary/60" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-48 rounded-lg">
                    <pre className="rounded-lg bg-gradient-to-br from-muted to-muted/80 p-3 text-xs leading-relaxed font-mono">{JSON.stringify(value, null, 2)}</pre>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

function TimelineItem({
    label,
    value,
    color,
    isLast
}: {
    label: string;
    value: string;
    color: string;
    isLast?: boolean;
}) {
    return (
        <div className="relative flex items-start gap-3">
            <div className="relative flex flex-col items-center">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border bg-background shadow-sm z-10">
                    <span className={`h-2 w-2 rounded-full ${color}`} />
                </span>
                {!isLast && <span className="absolute top-5 h-full w-px bg-gradient-to-b from-border to-border/50" />}
            </div>
            <div className="pb-6">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
        </div>
    );
}

/* ───────────────────────────── main ─────────────────────────────── */

export default function DataLeadDetail({ lead }: { lead: Lead }) {
    const reviewRating = (lead.review_rating as number) ?? 0;
    const reviewCount = (lead.review_count as number) ?? 0;
    const hasWebsite = !!lead.website;
    const hasPhone = !!lead.phone;

    const [whatsappMessage, setWhatsappMessage] = useState('');
    const [whatsappUrl, setWhatsappUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [whatsappError, setWhatsappError] = useState<string | null>(null);

    const canGenerateWhatsapp = hasPhone;

    const handleGenerateWhatsapp = async () => {
        if (!canGenerateWhatsapp) {
            setWhatsappError('Nomor telepon tidak tersedia untuk WhatsApp.');
            return;
        }

        setIsGenerating(true);
        setWhatsappError(null);

        try {
            const response = await fetch(`/api/v1/leads/${lead.id}/whatsapp/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(result.message ?? 'Gagal membuat pesan WhatsApp.');
            }

            setWhatsappMessage(result.data.message ?? '');
            setWhatsappUrl(result.data.whatsapp_url ?? '');
        } catch (error: any) {
            setWhatsappError(error.message ?? 'Terjadi kesalahan saat generate WhatsApp.');
            setWhatsappMessage('');
            setWhatsappUrl('');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
            {/* ══════ Premium Hero Header ══════ */}
            <Card className={`relative overflow-hidden bg-gradient-to-br ${statusGradient(lead.account_status as string)}`}>
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

                <CardContent className="relative p-6 pt-8 sm:p-8 sm:pt-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        {/* Left block - Identity */}
                        <div className="space-y-4 flex-1 min-w-0">
                            {/* Breadcrumbs style header */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    Leads
                                </span>
                                <span>/</span>
                                <span className="truncate">{lead.category || 'Uncategorized'}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-foreground">
                                    {lead.title ?? 'Untitled Lead'}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={`${statusColor(lead.account_status as string)} border px-3 py-1 text-xs font-semibold shadow-sm`}
                                >
                                    {(lead.account_status as string) ?? 'Unknown'}
                                </Badge>
                                {reviewRating >= 4.5 && (
                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200/50 px-2 py-0.5 text-xs">
                                        <Award className="h-3 w-3 mr-1" />
                                        Top Rated
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                {lead.category && (
                                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                        <Tag className="h-3.5 w-3.5 text-primary" />
                                        {lead.category as string}
                                    </span>
                                )}
                                {lead.address && (
                                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5 text-primary" />
                                        <span className="max-w-xs truncate">{lead.address as string}</span>
                                    </span>
                                )}
                            </div>

                            {lead.phone && (
                                <div className="flex items-center gap-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm">
                                        <Phone className="h-3.5 w-3.5 text-primary" />
                                        <span className="font-medium text-sm">{lead.phone as string}</span>
                                        <CopyButton value={lead.phone as string} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right block – Premium Rating Card */}
                        <div className="flex flex-col items-center gap-2 rounded-2xl border bg-background/80 backdrop-blur-md p-5 shadow-lg shadow-primary/5 sm:min-w-[180px]">
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-extrabold tabular-nums tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    {reviewRating.toFixed(1)}
                                </span>
                                <span className="text-sm text-muted-foreground">/5</span>
                            </div>
                            <BigStarRating rating={reviewRating} />
                            <div className="mt-2 flex items-center gap-1.5">
                                <MessageSquareText className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-medium">{reviewCount.toLocaleString('id-ID')} reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Bar */}
                    <div className="mt-6 flex flex-wrap items-center gap-2 pt-6 border-t border-border/50">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="h-3.5 w-3.5" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-3.5 w-3.5" />
                            Export
                        </Button>
                        {lead.website && (
                            <Button variant="default" size="sm" className="gap-2" asChild>
                                <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-3.5 w-3.5" />
                                    Visit Website
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base">WhatsApp Penawaran</CardTitle>
                            <CardDescription>Generate pesan penawaran yang siap dikirim via WhatsApp.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    {whatsappError && (
                        <Alert variant="destructive">
                            <AlertTitle>Validasi WhatsApp gagal</AlertTitle>
                            <AlertDescription>{whatsappError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                {hasPhone
                                    ? 'Gunakan nomor +62 atau 08 untuk mengirim WhatsApp. Nomor 021 tidak didukung.'
                                    : 'Nomor telepon tidak tersedia untuk WhatsApp.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleGenerateWhatsapp}
                                disabled={!canGenerateWhatsapp || isGenerating}
                            >
                                {isGenerating ? 'Mengenerate...' : 'Generate Pesan'}
                            </Button>
                            {whatsappUrl && (
                                <Button variant="default" size="sm" asChild>
                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                        Buka WhatsApp
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {whatsappMessage ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">Preview Pesan WhatsApp</p>
                            <Textarea readOnly value={whatsappMessage} className="min-h-[160px] resize-none" />
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            {/* ══════ Premium KPI Dashboard ══════ */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    icon={Star}
                    label="Rating"
                    value={reviewRating.toFixed(1)}
                    subtitle="out of 5.0"
                    trend="+0.2"
                    trendUp={true}
                />
                <DashboardCard
                    icon={MessageSquareText}
                    label="Reviews"
                    value={reviewCount.toLocaleString('id-ID')}
                    subtitle="total reviews"
                />
                <DashboardCard
                    icon={hasWebsite ? Globe : Shield}
                    label="Website"
                    value={hasWebsite ? '✓ Available' : '—'}
                    subtitle={hasWebsite ? 'has website' : 'no website'}
                    trend={hasWebsite ? 'Active' : undefined}
                    trendUp={hasWebsite}
                />
                <DashboardCard
                    icon={hasPhone ? Phone : Shield}
                    label="Phone"
                    value={hasPhone ? '✓ Available' : '—'}
                    subtitle={hasPhone ? 'has phone' : 'no phone'}
                    trend={hasPhone ? 'Verified' : undefined}
                    trendUp={hasPhone}
                />
            </div>

            {/* ══════ Premium Tabbed Content ══════ */}
            <Tabs defaultValue="identity" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1 gap-1">
                    <TabsTrigger value="identity" className="gap-2 px-4 data-[state=active]:shadow-sm">
                        <User className="h-4 w-4" />
                        Identity
                    </TabsTrigger>
                    <TabsTrigger value="location" className="gap-2 px-4 data-[state=active]:shadow-sm">
                        <MapPin className="h-4 w-4" />
                        Location
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="gap-2 px-4 data-[state=active]:shadow-sm">
                        <Star className="h-4 w-4" />
                        Reviews
                    </TabsTrigger>
                    <TabsTrigger value="data" className="gap-2 px-4 data-[state=active]:shadow-sm">
                        <Building2 className="h-4 w-4" />
                        Raw Data
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2 px-4 data-[state=active]:shadow-sm">
                        <Clock className="h-4 w-4" />
                        Activity
                    </TabsTrigger>
                </TabsList>

                {/* ──── Identity & Contact ──── */}
                <TabsContent value="identity" className="mt-4">
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">Identity & Contact</CardTitle>
                                    <CardDescription>Core business information and contact details.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1 pt-4">
                            <InfoRow icon={Building2} label="Business Name" value={lead.title as string} copyable variant="accent" />
                            <InfoRow icon={Tag} label="Category" value={lead.category as string} />
                            <InfoRow icon={Phone} label="Phone" value={lead.phone as string} copyable />
                            <InfoRow icon={Globe} label="Website" value={lead.website as string} isLink copyable />
                            <InfoRow icon={MapPin} label="Address" value={lead.address as string} copyable />
                            <Separator className="my-3" />
                            <InfoRow icon={Shield} label="Status" value={lead.status as string} />
                            <InfoRow icon={Zap} label="Account Status" value={lead.account_status as string} />
                            {lead.emails != null && (
                                <InfoRow icon={Mail} label="Emails" value={JSON.stringify(lead.emails)} copyable />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ──── Location & Links ──── */}
                <TabsContent value="location" className="mt-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-base">Coordinates & Place</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-1 pt-4">
                                <InfoRow icon={MapPin} label="Latitude" value={lead.latitude as number} copyable />
                                <InfoRow icon={MapPin} label="Longitude" value={lead.longitude as number} copyable />
                                <InfoRow icon={MapPin} label="Plus Code" value={lead.plus_code as string} copyable />
                            </CardContent>
                        </Card>

                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-600">
                                        <ExternalLink className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-base">External Links & IDs</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-1 pt-4">
                                <InfoRow icon={ExternalLink} label="Google Maps" value={lead.link as string} isLink copyable />
                                <InfoRow icon={Tag} label="Place ID" value={lead.place_id as string} copyable />
                                <InfoRow icon={Tag} label="CID" value={lead.cid as string} copyable />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ──── Reviews & Metrics ──── */}
                <TabsContent value="reviews" className="mt-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Rating Breakdown */}
                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-600">
                                        <Star className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-base">Rating Breakdown</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-6xl font-extrabold tabular-nums tracking-tighter bg-gradient-to-br from-amber-500 to-amber-600 bg-clip-text text-transparent">
                                        {reviewRating.toFixed(1)}
                                    </span>
                                    <div className="space-y-1">
                                        <BigStarRating rating={reviewRating} />
                                        <p className="text-sm text-muted-foreground">
                                            Based on <span className="font-semibold text-foreground">{reviewCount.toLocaleString('id-ID')}</span>{' '}
                                            reviews
                                        </p>
                                    </div>
                                </div>
                                <Separator className="mb-5" />
                                <RatingDistribution reviewsPerRating={lead.reviews_per_rating} totalReviews={reviewCount} />
                            </CardContent>
                        </Card>

                        {/* Recent Reviews */}
                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 text-violet-600">
                                        <MessageSquareText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-base">User Reviews</CardTitle>
                                        <CardDescription>Latest customer feedback</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {(() => {
                                    let reviews = extractReviewItems(lead.user_reviews);
                                    if (reviews.length === 0) {
                                        reviews = extractReviewItems(lead.user_reviews_extended);
                                    }

                                    if (reviews.length > 0) {
                                        return (
                                            <ScrollArea className="h-[320px] pr-4">
                                                <div className="space-y-3">
                                                    {reviews.slice(0, 15).map((review, idx) => (
                                                        <div key={idx} className="rounded-xl border bg-gradient-to-br from-muted/50 to-muted/30 p-4 transition-all hover:shadow-sm">
                                                            <div className="mb-2 flex items-center gap-3">
                                                                <Avatar className="h-8 w-8 ring-2 ring-background">
                                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                                        {review.name?.charAt(0)?.toUpperCase() ?? '?'}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-sm font-medium truncate block">{review.name}</span>
                                                                    {review.rating != null && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                                            <span className="text-xs font-medium text-amber-500">{review.rating}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {review.text != null && (
                                                                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{review.text}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        );
                                    }

                                    return (
                                        <div className="flex h-48 items-center justify-center">
                                            <div className="text-center">
                                                <MessageSquareText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">No user reviews available.</p>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ──── Raw JSON Data ──── */}
                <TabsContent value="data" className="mt-4">
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-500/5 text-slate-600">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">Raw JSON Data</CardTitle>
                                    <CardDescription>Structured data blocks from the lead source.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 pt-4 md:grid-cols-2">
                            <JsonBlock title="About" value={lead.about} />
                            <JsonBlock title="Open Hours" value={lead.open_hours} />
                            <JsonBlock title="User Reviews" value={lead.user_reviews} />
                            <JsonBlock title="Images" value={lead.images} />
                            <JsonBlock title="Emails" value={lead.emails} />
                            <JsonBlock title="User Reviews Extended" value={lead.user_reviews_extended} />
                            <JsonBlock title="Reviews per Rating" value={lead.reviews_per_rating} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ──── Activity / Audit ──── */}
                <TabsContent value="activity" className="mt-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-cyan-600">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Activity Timeline</CardTitle>
                                        <CardDescription>Record timestamps</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TimelineItem
                                    label="Created At"
                                    value={formatDate(lead.created_at)}
                                    color="bg-emerald-500"
                                />
                                <TimelineItem
                                    label="Updated At"
                                    value={formatDate(lead.updated_at as string)}
                                    color="bg-blue-500"
                                    isLast
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-600">
                                        <Tag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Internal Identifiers</CardTitle>
                                        <CardDescription>System IDs and references</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-1 pt-4">
                                <InfoRow icon={Tag} label="Lead ID" value={lead.id} copyable />
                                <InfoRow icon={Tag} label="Input ID" value={lead.input_id as string} copyable />
                                <InfoRow icon={Tag} label="Data ID" value={lead.data_id as string} copyable />
                                <InfoRow icon={Calendar} label="Timezone" value={lead.timezone} copyable />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
