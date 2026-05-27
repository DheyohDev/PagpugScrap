import { Head } from '@inertiajs/react';
import { useState } from "react";
import CreateJobModal from '@/components/scraping/CreateJobModal';
import ScrapingTasksTable from '@/components/scraping/ScrapingTaskTable';
import AppLayout from '@/layouts/app-layout';

// Gunakan import yang sudah terbukti jalan
// Import Modal dengan pola yang sama

export default function ScrapingPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        // Memicu re-render pada tabel saat job baru berhasil dibuat
        setRefreshKey(prev => prev + 1);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Scraping Jobs', href: '/scraping' }]}>
            <Head title="Scraping Jobs" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Google Maps Scraping</h1>

                    {/* Tombol Popup Create Job */}
                    <CreateJobModal onSuccess={handleSuccess} />
                </div>

                {/* Table Section */}
                <div className="w-full">
                    <ScrapingTasksTable key={refreshKey} />
                </div>
            </div>
        </AppLayout>
    );
}
