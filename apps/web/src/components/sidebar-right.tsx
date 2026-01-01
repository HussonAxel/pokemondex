'use client';

import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarRail,
} from '@/components/animate-ui/components/radix/sidebar';

const SidebarRightContent = () => {
    return (
        <Sidebar collapsible="icon" side="right">
            <SidebarContent>
                <p>
                    Pas de pokémons ici
                </p>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
};

export const SidebarRight = () => {
    return (
        <SidebarProvider defaultOpen={true} className="contents">
            <SidebarRightContent />
        </SidebarProvider>
    );
};