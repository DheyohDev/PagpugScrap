<?php

namespace App\Services;

use App\Repositories\Interfaces\GoogleMapLeadRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GoogleMapLeadService
{
    public function __construct(
        protected GoogleMapLeadRepositoryInterface $repository
    ) {}

    public function getPaginatedLeads(array $validated, array $queryParams): array
    {
        $perPage  = (int) ($validated['per_page'] ?? 25);
        $sortBy   = $validated['sort_by'] ?? 'created_at';
        $sortDir  = $validated['sort_dir'] ?? 'desc';

        $filters = array_filter(
            array_intersect_key($validated, array_flip([
                'q', 'account_status', 'category', 'timezone', 'date_from', 'date_to'
            ]))
        );

        $paginated = $this->repository
            ->paginate($filters, $sortBy, $sortDir, $perPage)
            ->appends($queryParams);

        return [
            'data' => $paginated->items(),
            'meta' => [
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'from'         => $paginated->firstItem(),
                'to'           => $paginated->lastItem(),
            ],
        ];
    }

    public function getLeadById(string $id): mixed
    {
        return $this->repository->findById($id);
    }

    public function getAggregations(): array
    {
        $data = $this->repository->getAggregations();

        return [
            'kpis' => [
                'total_leads'       => $data['totalLeads'],
                'total_new_lead'    => $data['totalNewLead'],
                'avg_rating'        => $data['avgRating'],
                'distinct_category' => $data['distinctCategory'],
            ],
            'status_distribution'   => $data['statusDistribution'],
            'top_categories'        => $data['topCategories'],
            'timezone_distribution' => $data['timezoneDistribution'],
            'daily_trend'           => $data['dailyTrend'],
            'rating_buckets'        => $data['ratingBuckets'],
            'data_completeness'     => $data['dataCompleteness'],
        ];
    }

    public function getFilterOptions(): array
    {
        return $this->repository->getFilterOptions();
    }

    public function generateWhatsappMessage(string $id): array
    {
        $lead = $this->repository->findById($id);

        if (! $lead) {
            throw new \InvalidArgumentException('Lead tidak ditemukan.');
        }

        $phone = $this->normalizeWhatsappPhone($lead->phone);
        $message = $this->buildWhatsappMessage($lead);
        $whatsappUrl = 'https://wa.me/' . $phone . '?text=' . rawurlencode($message);

        return [
            'phone'            => $lead->phone,
            'normalized_phone' => $phone,
            'message'          => $message,
            'whatsapp_url'     => $whatsappUrl,
        ];
    }

    protected function normalizeWhatsappPhone(?string $phone): string
    {
        if (empty($phone)) {
            throw new \InvalidArgumentException('Nomor telepon tidak tersedia.');
        }

        $normalized = preg_replace('/[^0-9+]/', '', trim($phone));

        if ($normalized === '') {
            throw new \InvalidArgumentException('Nomor telepon tidak valid.');
        }

        if (str_starts_with($normalized, '+')) {
            $normalized = substr($normalized, 1);
        }

        if (str_starts_with($normalized, '021')) {
            throw new \InvalidArgumentException('Nomor telepon tidak valid untuk WhatsApp. Gunakan nomor +62 atau 08.');
        }

        if (str_starts_with($normalized, '08')) {
            $normalized = '62' . substr($normalized, 1);
        }

        if (! str_starts_with($normalized, '62')) {
            throw new \InvalidArgumentException('Nomor telepon tidak valid untuk WhatsApp. Gunakan nomor +62 atau 08.');
        }

        if (! preg_match('/^62[0-9]+$/', $normalized)) {
            throw new \InvalidArgumentException('Nomor telepon tidak valid untuk WhatsApp.');
        }

        return $normalized;
    }

    protected function buildWhatsappMessage(object $lead): string
    {
        $title = trim((string) ($lead->title ?? 'bisnis Anda'));
        $category = trim((string) ($lead->category ?? 'kategori terkait'));
        $rating = $lead->review_rating !== null ? number_format((float) $lead->review_rating, 1) : null;
        $reviewCount = $lead->review_count !== null ? (int) $lead->review_count : null;
        $businessName = $title !== '' ? $title : 'bisnis Anda';

        $lines = [
            "Halo, saya dari Pagpug.",
            "Kami melihat bahwa {$businessName} bergerak di kategori {$category}.",
            "Kami siap membantu meningkatkan kehadiran online Anda dengan website profesional dan strategi pemasaran digital resmi.",
            "Kunjungi https://pagpug.com/ untuk melihat layanan dan solusi kami.",
            "Website resmi Pagpug: https://pagpug.com/",
        ];

        if ($rating !== null && $reviewCount !== null) {
            $lines[] = "Dengan review rata-rata {$rating} dari {$reviewCount} pelanggan, kami dapat membantu memperkuat reputasi digital Anda.";
        } elseif ($rating !== null) {
            $lines[] = "Dengan rating {$rating}, kami dapat membantu meningkatkan kepercayaan pelanggan.";
        }

        $lines[] = "Silakan balas pesan ini agar tim kami bantu menyiapkan website dan strategi yang tepat untuk bisnis Anda.";

        return implode("\n", $lines);
    }

    public function getLeadsWithoutWebsiteOrFreedomains(array $validated, array $queryParams): array
    {
        $perPage = (int) ($validated['per_page'] ?? 25);
        $sortBy = $validated['sort_by'] ?? 'review_count';
        $sortDir = $validated['sort_dir'] ?? 'desc';

        $filters = array_filter(
            array_intersect_key($validated, array_flip(['q', 'category']))
        );

        $paginated = $this->repository
            ->findLeadsWithoutWebsiteOrFreedomains($filters, $sortBy, $sortDir, $perPage)
            ->appends($queryParams);

        return [
            'data' => $paginated->items(),
            'meta' => [
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'from'         => $paginated->firstItem(),
                'to'           => $paginated->lastItem(),
            ],
        ];
    }
}
