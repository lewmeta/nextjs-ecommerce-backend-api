"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";

export const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
    const { expandSidebar } = useExpandSlice();
    return (
        <div className={cn("mt-[70px] h-full ", expandSidebar ? "ml-[300px] mt-[70px]" : "ml-[80px] ")}>
            {children}
        </div>
    )
}
