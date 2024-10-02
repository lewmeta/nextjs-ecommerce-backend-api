'use client'

import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, LucideIcon, LucideProps } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ComponentType, SVGProps, useState } from 'react'
import { useExpandSlice } from "@/hooks/use-expand-slice";
import { Separator } from "../ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronLeft, ChevronRight } from "../icons";

type IconType = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

interface SidebarItemProps {
    icon?: IconType;
    label: string;
    href?: string;
    active?: boolean;
    children?: SidebarItemProps[];
}

interface SidebarSectionProps {
    label: string;
    items: SidebarItemProps[];
}
export const SidebarItem = ({
    label,
    items
}: SidebarSectionProps) => {

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { expandSidebar } = useExpandSlice();

    // const handleToggle = () => {
    //     setIsOpen(!isOpen);
    // };

    return (
        <div className="flex flex-col">
            {expandSidebar && (
                <div className="flex flex-col items-start" >
                    <span className="text-gray-400 uppercase text-sm font-normal">{label}</span>
                </div>
            )}
            <div className="w-full">
                {items.map((item, index) => (
                    <div key={index} className="w-full">
                        <div className="flex items-center justify-center py-2 w-full">
                            {expandSidebar ? (
                                <>
                                    {item.icon && <item.icon className="" />}
                                    <button
                                        className={cn("flex ml-2 items-center justify-between text-sm w-full", item.active && "font-bold")}
                                    >
                                        <span
                                            onClick={() => item.href && router.push(item.href)}
                                        >
                                            {label}
                                        </span>

                                        {item && item.children && (
                                            <span onClick={() => setIsOpen(prev => !prev)}>{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                {item && item.children ? (
                                                    <Button variant="outline">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger onClick={() => item.href && router.push(item.href)}>
                                                                {item.icon && <item.icon className="" />}
                                                            </DropdownMenuTrigger>
                                                            {item.children && item.children.length && isOpen && (
                                                                <DropdownMenuContent className="pl-4">
                                                                    <DropdownMenuLabel>Products</DropdownMenuLabel>
                                                                    {item.children.map((child, childIndex) => (
                                                                        <DropdownMenuItem
                                                                            key={childIndex}
                                                                            onClick={() => child.href && router.push(child.href)}
                                                                            className={cn("flex items-center", child.active && "font-bold")}
                                                                        >
                                                                            {child.icon && <child.icon className="mr-2" />}
                                                                            {child.label}
                                                                        </DropdownMenuItem>
                                                                    ))}
                                                                </DropdownMenuContent>
                                                            )}
                                                        </DropdownMenu>
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline">
                                                        {item.icon && <item.icon className="" />}
                                                    </Button>
                                                )}
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>{item.label}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            )}
                        </div>
                        {item.children && item.children.length && isOpen && expandSidebar && (
                            <div className="pl-2 text-sm mb-3 bg-blue-600">
                                {item.children.map((child, childIndex) => (
                                    <button
                                        key={childIndex}
                                        onClick={() => child.href && router.push(child.href)}
                                        className={cn("flex items-center", child.active && "font-bold")}
                                    >
                                        {child.icon && <child.icon className="mr-2" />}
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Separator className="my-3" />
        </div>
    );
}
