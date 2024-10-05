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
import { CollapeseIcon, ExpandIcon } from "../icons";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface StoreProps {
    items: Record<string, any>[]
}

export const Sidebar = ({
    items
}: StoreProps) => {
    const { expandSidebar, toggleSidebar } = useExpandSlice();

    return (
        <div className={cn('h-full border-r flex flex-col shadow-sm', expandSidebar ? 'w-80 ' : 'w-[70px]')}
        >
            <div className="relative w-full flex items-center justify-center p-4 ">
                {expandSidebar ? (
                    <div className="flex items-center justify-between h-[40px] w-full">
                        <div className="w-[170px]">
                            <Image
                                src={'/logo.svg'}
                                width={100} height={60} alt="logo"
                                className="w-auto h-auto object-cover flex-0"
                            />
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="cursor-pointer"
                        >
                            <CollapeseIcon width={25} height={25} className="border-blue-600" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center flex-col">
                        <Image src={'/site-logo.svg'} width={100} height={100} alt="logo" className="w-[30px] h-[30px] object-cover" />
                        <Separator className="my-5" />
                        <button
                            onClick={toggleSidebar}
                        >
                            <ExpandIcon width={24} height={24} />
                        </button>
                    </div>
                )}
            </div>
            <div className="px-6 mt-6 h-full">
                <StoreSwitcher items={items} />
                <div className="mt-6">
                    <SidebarRoutes />
                </div>
            </div>
        </div>
    )
}
