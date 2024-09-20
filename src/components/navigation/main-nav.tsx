"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { UserButton } from "../auth/user-button";
import { DownloadIcon } from "../icons/download-icon";
import { SettingsIcon } from "../icons/settings-icon";
import { RocketIcon } from "../icons/rocket-icon";
import { SearchIcon } from "../icons/search-icon";
import { MenuIcon } from "../icons/menu-icon";
import { RemoveIcon } from "../icons/remove-icon";
import Link from "next/link";
import { useParams } from "next/navigation";

export const MainNav = () => {
    const { expandSidebar, toggleSidebar } = useExpandSlice();

    const params = useParams();
    return (
        <div className={cn("fixed top-0 right-0 flex items-center justify-between border-b border-b-gray-200 px-4 h-[60px] bg-white  z-50", expandSidebar ? "md:w-[calc(100%-300px)] w-full " : "md:w-[calc(100%-80px)]  w-full")}>
            <div className=" flex items-center gap-4 text-lg text-muted-foreground">
                {!expandSidebar && (
                    <RemoveIcon onClick={toggleSidebar} />
                )}
                <SearchIcon />
                <span className="text-sm">
                    Search anything here ...
                </span>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 text-lg font-bold text-gray-600">
                    <DownloadIcon />
                    <RocketIcon />
                    <Link href={`/${params.storeId}/vendor/settings`}>
                        <SettingsIcon />
                    </Link>
                </div>
                <div className="h-[35px] border-solid border-gray-200 border-[0.4px]" />
                <div className="">
                    <UserButton />
                </div>
            </div>
        </div>
    )
}
