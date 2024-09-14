"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { UserButton } from "../auth/user-button";
import { DownloadIcon } from "../icons/download-icon";
import { SettingsIcon } from "../icons/settings-icon";
import { RocketIcon } from "../icons/rocket-icon";

export const MainNav = () => {
    const { expandSidebar } = useExpandSlice();

    return (
        <div className={cn("fixed top-0 right-0 flex items-center justify-between border-b border-b-gray-200 px-4 h-[70px] bg-white  z-50", expandSidebar ? "md:w-[calc(100%-300px)] w-full " : "md:w-[calc(100%-80px)]  w-full")}>
            <div className="">
                Search
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                    <DownloadIcon className="text-[22px]" />
                    <RocketIcon className="text-[22px]" />
                    <SettingsIcon className="text-[22px]" />
                </div>
                <div className="h-[35px] border-solid border-gray-200 border-[0.4px]" />
                <div className="">
                    <UserButton />
                </div>
            </div>
        </div>
    )
}
