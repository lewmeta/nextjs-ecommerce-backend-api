"use client"

import { UserButton } from "../auth/user-button";
import { SettingsIcon } from "../icons/settings-icon";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SearchInput } from "../search";

export const MainNav = () => {
    const params = useParams();
    return (
        <div className='w-full'>
            <div className=" w-full flex items-center space-x-4">
                <div className="flex items-center justify-between w-full space-x-3">
                    <div className="">
                        <SearchInput/>
                    </div>
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
