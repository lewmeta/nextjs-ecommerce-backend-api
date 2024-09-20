"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { CategoryIcon } from "./icons/category-icon";
import { CouponIcon } from "./icons/coupon-icon";
import { RocketIcon } from "./icons/rocket-icon";
import { LucideIcon } from "lucide-react";
import { ComponentType, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface Route {
    href: string;
    label: string;
    icon: IconType;
    active: boolean;
}

interface LayoutComponentProps {
    title: string;
    children: React.ReactNode
    routes?: Route[]; 
}

export const LayoutComponent = ({ children, title, routes }: LayoutComponentProps) => {
    const { expandSidebar } = useExpandSlice();
    return (
        <div className={cn("mt-[70px] h-full ", expandSidebar ? "md:ml-[300px] ml-0 mt-[70px]" : "ml-[80px] ")}>

            {/* <div className="bg-white border-b flex items-center justify-between border-b-gray-200 p-[20px] py-2">
                {title}

                <div className="flex items-center gap-2">
                    { ROUTES?.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 border rounded-lg p-1 px-3 text-sm">
                            {item.icon && <item.icon/>}
                            {item.label}
                        </div>
                    ))}
                </div>
            </div> */}
            <div className="bg-gray-50 h-full">
                {children}
            </div>
        </div>
    )
}
