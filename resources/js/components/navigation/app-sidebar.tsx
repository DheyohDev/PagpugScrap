import { Link } from '@inertiajs/react';
import { BookOpen, Database, FolderGit2, Globe, LayoutGrid, Table2, User, FileText, Box, TrendingUp, Settings } from 'lucide-react';
import AppLogo from '@/components/branding/app-logo';
import { NavFooter } from '@/components/navigation/nav-footer';
import { NavMain } from '@/components/navigation/nav-main';
import { NavUser } from '@/components/navigation/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Scraping Jobs',
        href: '/scraping',
        icon: Globe
    },
    {
        title: 'Data Leads',
        href: '/data-leads',
        icon: Table2,
        items: [
            {
                title: 'All Leads',
                href: '/data-leads',
                icon: Table2,
            },
            {
                title: 'No Website Leads',
                href: '/data-leads/no-website',
                icon: Database,
            },
        ]
    },
    {
        title: 'Quotation',
        href: '/quotation',
        icon: FolderGit2,
        isActive: true,
        items: [
            {
                title: 'Overview',
                href: '/quotation',
                icon: FileText,
            },
            {
                title: 'Quotations',
                href: '/quotation/quotations',
                icon: FileText,
            },
            {
                title: 'Products',
                href: '/quotation/products',
                icon: Box,
            },
            {
                title: 'Reports',
                href: '/quotation/reports/profit',
                icon: TrendingUp,
            },
            {
                title: 'Settings',
                href: '/quotation/settings',
                icon: Settings,
            },
        ],
    },
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: User,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-1">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60 pt-3">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
