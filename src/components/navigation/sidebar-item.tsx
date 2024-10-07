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
                    <span className="text-muted-foreground capitalize text-sm font-normal">{label}</span>
                </div>
            )}
            <div className="w-full px-0">
                {items.map((item, index) => (
                    <div key={index} className="w-full">
                        <div className="flex items-center justify-center py-1 w-full">
                            {expandSidebar ? (
                                <>
                                    {item.children ? (
                                        <Button className={cn("w-full", item.active && " text-primary bg-secondary border border-primary")}
                                            variant={'ghost'}
                                            onClick={() => setIsOpen(prev => !prev)}
                                        >
                                            {item.icon && <item.icon className="" />}
                                            <div
                                                className={cn("flex ml-2 items-center justify-between text-sm w-full")}
                                            >
                                                <span
                                                >
                                                    {item.label}
                                                </span>

                                                {item && item.children && (
                                                    <span onClick={() => setIsOpen(prev => !prev)}>{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
                                                )}
                                            </div>
                                        </Button>
                                    ) : (
                                        <Button className={cn("w-full", item.active && " text-primary bg-secondary border border-primary")}
                                            variant={'ghost'}
                                        >
                                            {item.icon && <item.icon className="" />}
                                            <div
                                                className={cn("flex ml-2 items-center justify-between text-sm w-full")}
                                            >
                                                <span
                                                    onClick={() => item.href && router.push(item.href)}
                                                >
                                                    {item.label}
                                                </span>

                                            </div>
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                {item && item.children ? (
                                                    <Button variant="ghost" asChild>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger onClick={() => setIsOpen(prev => !prev)}>
                                                                {
                                                                    item.icon &&
                                                                    <Button variant={"ghost"}><item.icon /></Button>
                                                                }
                                                            </DropdownMenuTrigger>
                                                            {item.children && item.children.length && isOpen && (
                                                                <DropdownMenuContent className="ml-4" side="bottom">
                                                                    {/* <DropdownMenuLabel>Products</DropdownMenuLabel> */}
                                                                    {item.children.map((child, childIndex) => (
                                                                        <DropdownMenuItem
                                                                            key={childIndex}
                                                                            onClick={() => child.href && router.push(child.href)}
                                                                            className={cn("flex items-center cursor-pointer", child.active && "text-primary bg-secondary")}
                                                                        >
                                                                            {/* {child.icon && <child.icon className="mr-2" />} */}
                                                                            {child.label}
                                                                        </DropdownMenuItem>
                                                                    ))}
                                                                </DropdownMenuContent>
                                                            )}
                                                        </DropdownMenu>
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" onClick={() => item.href && router.push(item.href)} className={cn(item.active && 'text-primary bg-secondary')}>
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
                            <div className="ml-4 text-sm mb-3 ">
                                {item.children.map((child, childIndex) => (
                                    <button
                                        key={childIndex}
                                        onClick={() => child.href && router.push(child.href)}
                                        className={cn("flex items-center", child.active && "font-bold text-primary")}
                                    >
                                        {/* {child.icon && <child.icon className="mr-2" />} */}
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
