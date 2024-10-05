"use client"

import { UserButton } from "../auth/user-button";
import { SettingsIcon } from "../icons/settings-icon";
import Link from "next/link";
import { useParams } from "next/navigation";

export const MainNav = () => {
    const params = useParams();
    return (
        <div className=''>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 text-lg font-bold text-gray-600">
                    {/* <DownloadIcon />
                    <RocketIcon /> */}
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
