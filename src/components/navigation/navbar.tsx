'use client'

import { MainNav } from "./main-nav"
import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";

export const Navbar = () => {

    const { expandSidebar } = useExpandSlice();
    return (
        <div className={cn("fixed inset-y-0 right-0 w-full flex items-center h-[80px] md:pl-24", expandSidebar ? 'md:pl-80' : 'md:pl-[70px]')}>
            <div className="w-full border-b h-full flex items-center">
                <MainNav />
                {/* <MobileNavbar /> */}
            </div>
        </div>
    )
}
