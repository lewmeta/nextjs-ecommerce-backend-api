"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { MenuIcon } from "../icons/menu-icon";
import { useParams, usePathname } from "next/navigation";
import { StoreSwitcher } from "./store-switcher";
import { SidebarRoutes } from "./sidebar-routes";
import { BoltIcon } from "../icons/bolt-icon";
import { SettingsIcon } from "../icons/settings-icon";
import Image from "next/image";

interface StoreProps {
    items: Record<string, any>[]
}

export const Sidebar = ({
    items
}: StoreProps) => {
    const { expandSidebar, toggleSidebar } = useExpandSlice();

    return (
        <div className={cn('h-full border-r flex flex-col overflow-y-auto shadow-sm', expandSidebar ? 'w-80 ' : 'w-20')}
            onClick={() => toggleSidebar()}
        >
            <div className="">
                <div className="relative flex items-center w-full h-[80px] p-4">
                    <div className="relative w-full h-full">
                    {expandSidebar && (
                        <Image src={'/logo.svg'} fill alt="logo" />
                    )}
                    {!expandSidebar && (
                        <Image src={'/site-logo.svg'} fill alt="logo" />
                    )}
                    </div>
                </div>

            </div>
        </div>
    )
}
