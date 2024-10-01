'use client'

import { cn } from "@/lib/utils";
import { LucideIcon, LucideProps } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ComponentType, SVGProps, useState } from 'react'
import { useExpandSlice } from "@/hooks/use-expand-slice";

type IconType = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;


// interface SidebarItemsProps {
//     icon: IconType;
//     label: string;
//     active: boolean;
//     href: string;
// }

interface SidebarItemProps {
    icon?: IconType; // Icon is optional for labels with no icon
    label: string;
    href?: string; // href is optional if the item has children
    active?: boolean; // Active can be undefined
    children?: SidebarItemProps[]; // Optional array of children for dropdowns
}

// Type for the overall sidebar structure, which includes sections with labels and items
interface SidebarSectionProps {
    label: string; // Section label (e.g., "Analytics", "Application")
    items: SidebarItemProps[]; // Array of items within the section
}
export const SidebarItem = ({
    label,
    items
}: SidebarSectionProps) => {

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { expandSidebar } = useExpandSlice();

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between p-2 cursor-pointer" onClick={handleToggle}>
                <span>{label}</span>
                {/* {items && items.length &&  > 0 && (
                    <span>{isOpen ? '▼' : '►'}</span> // Replace with appropriate icon for open/close
                )} */}
            </div>

            <div className="flex flex-col ">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center p-2 w-full">
                        {item.icon && <item.icon className="mr-2" />}
                        <button
                            // onClick={() => item.href && router.push(item.href)}
                            className={cn("flex items-center justify-between w-full", item.active && "font-bold")}
                        >
                            <span>{label}</span>

                            {item && item.children && (
                                <span onClick={() => setIsOpen(prev => !prev)}>{isOpen ? '▼' : '►'}</span> // Replace with appropriate icon for open/close
                            )}
                        </button>

                        </div>
                        {item.children && item.children.length && isOpen && (
                            <div className="pl-4">
                                {item.children.map((child, childIndex) => (
                                    <button
                                        key={childIndex}
                                        onClick={() => child.href && router.push(child.href)}
                                        className={cn("flex items-center", child.active && "font-bold")}
                                    >
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
