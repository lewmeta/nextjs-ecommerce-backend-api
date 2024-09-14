"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";

export const MainNav = () => {
    const { expandSidebar } = useExpandSlice();

    return (
        <div className={cn("fixed top-0 right-0 flex items-center border-b border-b-gray-200 px-4 h-[70px] bg-white  z-50", expandSidebar ? "md:w-[calc(100%-300px)] w-full " : "md:w-[calc(100%-80px)]  w-full")}>
            MainNav
        </div>
    )
}
