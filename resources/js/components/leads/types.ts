// ============================================================
// LEAD
// ============================================================

export type Lead = {
    id: string;                      // ✏️ diubah: number → string (UUID / place_id)
    title: string | null;
    category: string | null;
    address: string | null;
    phone: string | null;
    website: string | null;
    status: string | null;
    account_status: string | null;
    review_count: number | null;
    review_rating: number | null;
    timezone: string | null;
    place_id: string | null;
    created_at: string;
    updated_at: string;             // ✏️ ditambah: umumnya ada di Eloquent model
    [key: string]: unknown;
};

// ============================================================
// PAGINATION META
// ============================================================

export type LeadListMeta = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
};

// ============================================================
// LIST RESPONSE (wrapper dari controller index)
// ============================================================

export type LeadListResponse = {          // ✏️ ditambah: type untuk full response
    success: boolean;
    data: Lead[];
    meta: LeadListMeta;
};

// ============================================================
// FILTERS
// ============================================================

export type SortBy = 'created_at' | 'title' | 'category' | 'review_count' | 'review_rating' | 'account_status';
export type SortDir = 'asc' | 'desc';    // ✏️ diextract: biar bisa dipakai ulang

export type LeadFilters = {
    q?: string;                          // ✏️ diubah: semua jadi optional (?)
    account_status?: string;
    category?: string;
    timezone?: string;
    date_from?: string;                  // ✏️ ditambah: ada di controller tapi belum di type
    date_to?: string;                    // ✏️ ditambah: ada di controller tapi belum di type
    sort_by?: SortBy;
    sort_dir?: SortDir;
    per_page?: number;
    page?: number;
};

// ============================================================
// AGGREGATIONS
// ============================================================

export type DistributionItem = {         // ✏️ diextract: dipakai berulang
    label: string;
    total: number;
};

export type LeadAggregations = {
    kpis: {
        total_leads: number;
        total_new_lead: number;
        avg_rating: number;
        distinct_category: number;
    };
    status_distribution: DistributionItem[];
    top_categories: DistributionItem[];
    timezone_distribution: DistributionItem[];
    daily_trend: Array<{ date: string; total: number }>;
    rating_buckets: DistributionItem[];
    data_completeness: {
        with_phone: number;
        without_phone: number;
        with_website: number;
        without_website: number;
    };
};

// ============================================================
// FILTER OPTIONS (dari endpoint /filters)
// ============================================================

export type LeadFilterOptions = {        // ✏️ ditambah: belum ada sama sekali
    account_statuses: string[];
    categories: string[];
    timezones: string[];
};

// ============================================================
// SINGLE LEAD RESPONSE (dari endpoint /show)
// ============================================================

export type LeadShowResponse = {         // ✏️ ditambah: type untuk response show
    success: boolean;
    data: Lead;
};
