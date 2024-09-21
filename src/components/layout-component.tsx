"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { CategoryIcon } from "./icons/category-icon";
import { CouponIcon } from "./icons/coupon-icon";
import { RocketIcon } from "./icons/rocket-icon";
import { LucideIcon } from "lucide-react";
import { ComponentType, SVGProps } from "react";

// type IconType = ComponentType<SVGProps<SVGSVGElement>>;

// interface Route {
//     href: string;
//     label: string;
//     icon: IconType;
//     active: boolean;
// }

interface LayoutComponentProps {
    children: React.ReactNode
}

export const LayoutComponent = ({ children }: LayoutComponentProps) => {
    const { expandSidebar } = useExpandSlice();
    return (
        <div className={cn("mt-[70px] h-full ", expandSidebar ? "md:ml-[300px] ml-0 mt-[70px]" : "ml-[80px] ")}>
            <div className="bg-gray-50 h-full">
                {children}
            </div>
        </div>
    )
}
