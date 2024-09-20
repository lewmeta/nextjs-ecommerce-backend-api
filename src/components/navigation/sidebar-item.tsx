'use client'

import { cn } from "@/lib/utils";
import { LucideIcon, LucideProps } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ComponentType, SVGProps } from 'react'
import { useExpandSlice } from "@/hooks/use-expand-slice";

type IconType = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

interface SidebarItemsProps {
    icon: IconType;
    label: string;
    active: boolean;
    href: string;
}

export const SidebarItem = ({
    icon: Icon,
    label,
    href,
    active
}: SidebarItemsProps) => {

    const router = useRouter();

    const onClick = () => {
        router.push(href)
    }

    const { expandSidebar } = useExpandSlice();

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-3 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                active && `bg-[#287f71] !text-white rounded-md`
            )}
        >
            <div className="flex items-center gap-x-2 py-2">
                <Icon
                    // size={22}
                    className={cn(
                        "text-slate-500 text-[16px]",
                        active && `text-white`
                    )}
                />
                {expandSidebar ? (
                    <>
                    {label}
                    </>
                ): (
                    <>
                    </>
                )}
            </div>
            {/* <div 
                className={cn(
                    "ml-auto opacity-0 border-2",
                    active && `dark:border-sky-700 dark:text-white border-gray-900 bg-gray-200/20 dark:bg-sky-200/20 h-full transition-all opacity-100`
                )}
            /> */}
        </button>
    )
}
