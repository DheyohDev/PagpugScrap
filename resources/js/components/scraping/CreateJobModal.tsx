import { PlusCircle } from "lucide-react";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CreateJobModalProps {
    onSuccess: () => void;
}

export default function CreateJobModal({ onSuccess }: CreateJobModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        keywords: '',
        lang: 'id',
        zoom: 15,
        lat: "0",
        lon: "0",
        fast_mode: false,
        radius: 10000,
        depth: 10,
        email: true,
        max_time: 600000000000,
        proxies: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                keywords: formData.keywords.split('\n').filter(k => k.trim() !== ''),
                lang: formData.lang,
                zoom: Number(formData.zoom),
                lat: formData.lat,
                lon: formData.lon,
                fast_mode: formData.fast_mode,
                radius: Number(formData.radius),
                depth: Number(formData.depth),
                email: formData.email,
                max_time: Number(formData.max_time),
                proxies: formData.proxies
                    .split('\n')
                    .map((proxy) => proxy.trim())
                    .filter((proxy) => proxy !== '')
            };

            const response = await fetch('/api/v1/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setOpen(false);
                onSuccess();

                setFormData({
                    ...formData,
                    name: '',
                    keywords: '',
                    proxies: '',
                });
            } else {
                const errData = await response.json();
                console.error("Gagal dari server:", errData);
                alert("Gagal membuat job. Cek console (F12) untuk detail.");
            }
        } catch (error) {
            console.error("Kesalahan jaringan:", error);
            alert("Terjadi kesalahan jaringan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2">
                    <PlusCircle className="w-4 h-4" /> Tambah Job
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[640px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Buat Scraping Job Baru</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Job</Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Pabrik_Cikarang_Tahap_1"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="keywords">Keywords (Satu per baris)</Label>
                            <Textarea
                                id="keywords"
                                placeholder="pabrik kemasan di Cikarang&#10;perusahaan logistik di Bekasi"
                                value={formData.keywords}
                                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                                required
                                rows={5}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="lang">Language</Label>
                                <Input
                                    id="lang"
                                    placeholder="id"
                                    value={formData.lang}
                                    onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="zoom">Zoom</Label>
                                <Input
                                    id="zoom"
                                    type="number"
                                    value={formData.zoom}
                                    onChange={(e) => setFormData({ ...formData, zoom: Number(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="lat">Latitude (lat)</Label>
                                <Input
                                    id="lat"
                                    placeholder="-6.2088"
                                    value={formData.lat}
                                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lon">Longitude (lon)</Label>
                                <Input
                                    id="lon"
                                    placeholder="106.8456"
                                    value={formData.lon}
                                    onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="radius">Radius</Label>
                                <Input
                                    id="radius"
                                    type="number"
                                    value={formData.radius}
                                    onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="depth">Depth</Label>
                                <Input
                                    id="depth"
                                    type="number"
                                    value={formData.depth}
                                    onChange={(e) => setFormData({ ...formData, depth: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="max_time">Max Time</Label>
                                <Input
                                    id="max_time"
                                    type="number"
                                    value={formData.max_time}
                                    onChange={(e) => setFormData({ ...formData, max_time: Number(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="proxies">Proxies (Satu per baris)</Label>
                            <Textarea
                                id="proxies"
                                placeholder="http://user:pass@127.0.0.1:8080&#10;socks5://127.0.0.1:1080"
                                value={formData.proxies}
                                onChange={(e) => setFormData({ ...formData, proxies: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                                <Label>Fast Mode</Label>
                                <Switch
                                    checked={formData.fast_mode}
                                    onCheckedChange={(checked) => setFormData({...formData, fast_mode: checked})}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                                <Label>Extract Email</Label>
                                <Switch
                                    checked={formData.email}
                                    onCheckedChange={(checked) => setFormData({...formData, email: checked})}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Meneruskan ke Debian..." : "Mulai Scraping"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
