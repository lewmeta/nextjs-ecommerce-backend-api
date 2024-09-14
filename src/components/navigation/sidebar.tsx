"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { MenuIcon } from "../icons/menu-icon";

export const Sidebar = () => {
    const { expandSidebar, toggleSidebar } = useExpandSlice();

    console.log({ expandSidebar: expandSidebar })
    return (
        <div className={cn("fixed top-0 left-0 dark:bg-[#1a2537] h-screen p-[30px]  border-r border-gray-200 overflow-visible z-20 md:block hidden", expandSidebar ? "w-[300px]" : "w-[80px]")}>
            <div className="flex flex-col justify-between h-full w-full">
                <div className="h-[40px] flex justify-between items-center">
                    <div>
                        L
                    </div>
                    <MenuIcon onClick={toggleSidebar} />
                </div>
                <div className="h-full flex flex-col justify-between">
                    <div>
                        menu
                    </div>
                    <div>
                        footer
                    </div>
                </div>
            </div>
        </div>
    )
}
