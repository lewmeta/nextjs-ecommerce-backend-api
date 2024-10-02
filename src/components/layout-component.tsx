"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";

interface LayoutComponentProps {
    children: React.ReactNode
}

export const LayoutComponent = ({ children }: LayoutComponentProps) => {
    const { expandSidebar } = useExpandSlice();
    return (
        <div className={cn("pt-[80px] h-full z-[100]", expandSidebar ? "md:pl-80  ml-0 " : "md:ml-[70px] ")}>
            <div className="h-full z-50">
                {children}
            </div>
        </div>
    )
}
