"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { MenuIcon } from "../icons/menu-icon";
import { useParams, usePathname } from "next/navigation";
import { StoreSwitcher } from "./store-switcher";
import { SidebarRoutes } from "./sidebar-routes";
import { BoltIcon } from "../icons/bolt-icon";

interface StoreProps {
    items: Record<string, any>[]
}
export const Sidebar = ({
    items
}: StoreProps) => {
    const { expandSidebar, toggleSidebar } = useExpandSlice();

    const pathname = usePathname();
    const params = useParams();

    return (
        <div className={cn("fixed top-0 left-0 h-screen p-[30px]  border-r border-gray-200  z-20 md:block hidden", expandSidebar ? "w-[300px]" : "w-[80px]")}>
            <div className="flex flex-col justify-between h-full w-full">
                <div className="h-[40px] flex justify-between items-center">
                    <div className="flex items-center space-x-2 gap-1">
                        <div className="p-1 bg-[#287f71] rounded-md">
                            <BoltIcon />
                        </div>
                        <div className="font-bold">
                            Lewis.
                        </div>
                    </div>
                    <MenuIcon onClick={toggleSidebar} />
                </div>
                <div className="h-full flex flex-col justify-between overflow-y-auto">
                    <div className="mt-10 flex flex-col w-full space-y-2 gap-4">

                        <SidebarRoutes />
                    </div>
                    <div className="mt-5">
                        <StoreSwitcher items={items} />
                    </div>
                </div>
            </div>
        </div>
    )
}
