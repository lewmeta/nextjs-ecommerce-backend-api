"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { MenuIcon } from "../icons/menu-icon";
import { useParams, usePathname, useRouter } from "next/navigation";
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

    const router  = useRouter();
    const params = useParams();
    return (
        <div className={cn('h-full border-r flex flex-col shadow-sm', expandSidebar ? 'w-80 ' : 'w-[70px]')}
        >
            <div className="relative w-full flex items-center justify-center p-6">
                {expandSidebar ? (
                    <div className="flex items-center justify-between h-[40px] w-full">
                        <div className="w-[168px]">
                            <Image
                                src={'/logo.svg'}
                                width={100} height={60} alt="logo"
                                className="w-auto h-auto object-cover cursor-pointer flex-0"
                                onClick={() => router.push(`/${params.storeId}/vendor`)}
                            />
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="cursor-pointer"
                        >
                            <CollapeseIcon width={23} height={23} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center flex-col">
                        <Image src={'/site-logo.svg'} width={100} height={100} alt="logo" className="w-[30px] cursor-pointer h-[30px] object-contain"
                        onClick={() => router.push(`/${params.storeId}/vendor`)}
                        />
                        <Separator className="my-5" />
                        <button
                            onClick={toggleSidebar}
                            className="hover:text-primary"
                        >
                            <ExpandIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
            <div className="scrollbar overflow-y-scroll px-6 mt-6 h-full">
                <div className="w-full flex items-center justify-center">
                    <StoreSwitcher items={items} />
                </div>
                <div className="mt-6">
                    <SidebarRoutes />
                </div>
            </div>
        </div>
    )
}
