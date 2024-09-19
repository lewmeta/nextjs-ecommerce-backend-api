import { cn } from "@/lib/utils";
import { SVGProps } from "react";

interface SidebarItemsProps {
    icon: SVGProps<SVGSVGElement>;
    label: string;
    active: boolean;
    href: string;
}

export const SidebarItems = ({
    icon,
    label,
    href,
    active
}: SidebarItemsProps) => {
    return (
        <div className={cn("w-full p-2 pl-4 rounded-[10px] gap-4", active && "bg-blue-600 text-white")}>
            <span></span>
            {label}
        </div>
    )
}
