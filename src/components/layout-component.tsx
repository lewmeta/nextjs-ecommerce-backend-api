"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";

export const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
    const { expandSidebar } = useExpandSlice();
    return (
        <div className={cn("mt-[70px] p-[20px] h-full ", expandSidebar ? "md:ml-[300px] ml-0 mt-[70px]" : "ml-[80px] ")}>
            {children}
        </div>
    )
}
