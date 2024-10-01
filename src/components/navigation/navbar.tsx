'use client'

import { db } from "@/lib/db";
import { MainNav } from "./main-nav"
import { Sidebar } from "./sidebar"
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MobileNavbar } from "./mobile-navbar";
import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";

export const Navbar = () => {

    const { expandSidebar} = useExpandSlice();
    return (
        <div className={cn("flex items-center !h-[80px] pl-24 w-full border-b", expandSidebar && 'pl-80')}>
            <MainNav />
            <MobileNavbar/>
        </div>
    )
}
