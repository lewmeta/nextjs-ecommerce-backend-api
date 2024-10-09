"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { MenuIcon } from "../icons/menu-icon";
import { useParams, usePathname, useRouter } from "next/navigation";
import { StoreSwitcher } from "./store-switcher";
import { SidebarRoutes } from "./sidebar-routes";
import { BoltIcon } from "../icons/bolt-icon";
import { SettingsIcon } from "../icons/settings-icon";
import Image from "next/image";
import { BillBoardIcon, CategoryIcon, CollapeseIcon, CustomersIcon, ExpandIcon } from "../icons";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Bell, Home, LineChart, Package, Package2, Settings, ShoppingCart, Users, Users2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "../ui/badge";
import { OrdersIcon } from "../icons/orders-icon";
import { Overview } from "../icons/over-view-icon";
import { PerformanceIcon } from "../icons/perfomance-icon";
import { ProductIcon } from "../icons/product-icon";
import { CouponIcon } from "../icons/coupon-icon";

interface StoreProps {
    items: Record<string, any>[]
}

export const Sidebar = ({
    items
}: StoreProps) => {
    const { expandSidebar, toggleSidebar } = useExpandSlice();

    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();

    const VENDOR_ROUTES = [
        {
            label: "General",
            items: [
                {
                    href: `/${params.storeId}/vendor/orders`,
                    label: "Orders",
                    icon: OrdersIcon,
                    active: pathname === `/${params.storeId}/vendor/orders`,
                },
                {
                    href: `/${params.storeId}/vendor/billboards`,
                    label: "Billboards",
                    icon: BillBoardIcon,
                    active: pathname.includes(`/${params.storeId}/vendor/billboards`),
                },
                {
                    href: `/${params.storeId}/vendor`,
                    label: "Dashboard",
                    icon: Overview,
                    active: pathname === `/${params.storeId}/vendor`,
                },
                {
                    href: `/${params.storeId}/vendor/perfomance`,
                    label: "Performance",
                    icon: PerformanceIcon,
                    active: pathname === `/${params.storeId}/vendor/perfomance`,
                },
                {
                    href: `/${params.storeId}/vendor/products`,
                    label: "Products",
                    icon: ProductIcon,
                    active: pathname.startsWith(`/${params.storeId}/vendor/products`),
                    // Add dropdown options for specific actions
                    // children: [
                    //     {
                    //         href: `/${params.storeId}/vendor/products/create`,
                    //         label: "Create Product",
                    //         icon: ProductIcon,
                    //         active: pathname === `/${params.storeId}/vendor/products/create`,
                    //     },
                    //     {
                    //         href: `/${params.storeId}/vendor/products/manage`,
                    //         label: "Manage Products",
                    //         icon: ProductIcon,
                    //         active: pathname === `/${params.storeId}/vendor/products/manage`,
                    //     },
                    // ],
                },
                {
                    href: `/${params.storeId}/vendor/categories`,
                    label: "Category",
                    icon: CategoryIcon,
                    active: pathname.includes(`/${params.storeId}/vendor/categories`),
                },
                {
                    href: `/${params.storeId}/vendor/coupons`,
                    label: "Coupons",
                    icon: CouponIcon,
                    active: pathname === `/${params.storeId}/vendor/coupons`,
                },
            ],
        },
        {
            label: "Account",
            items: [
                {
                    href: `/${params.storeId}/vendor/users`,
                    label: "Customers",
                    icon: CustomersIcon,
                    active: pathname === `/${params.storeId}/vendor/users`,
                },
                {
                    href: `/${params.storeId}/vendor/settings`,
                    label: "Settings",
                    icon: SettingsIcon,
                    active: pathname === `/${params.storeId}/vendor/settings`,
                },
            ],
        },
    ];

    return (
        <>
            <div className={cn('h-full border-r flex flex-col shadow-sm', expandSidebar ? 'w-80' : 'w-[70px]')}
            >
                <div className="mb-[0px] w-full h-full">
                    <div className={cn("w-full fixed top-0 left-0 z-50 flex mb-5 items-center  flex-wrap justify-center px-4 pt-6", expandSidebar ? 'justify-between w-80 pt-0 h-[80px] mb-0 border-b ' : 'w-[70px] mb-10')}>
                        <StoreSwitcher items={items} />
                        {!expandSidebar && (
                            <Separator className="my-5" />
                        )}
                        {expandSidebar ? (
                            <div
                                onClick={toggleSidebar}
                            >
                                <CollapeseIcon
                                    width={30}
                                    height={30}
                                    onClick={toggleSidebar}
                                />
                            </div>
                        ) : (
                            <div
                                onClick={toggleSidebar}
                            >
                                <ExpandIcon
                                    width={25}
                                    height={25}
                                    onClick={toggleSidebar}
                                />
                            </div>
                        )}
                    </div>
                    <div className={cn("mt-[90px] h-[calc(100%-90px)]", !expandSidebar && 'mt-[140px] h-[calc(100%-140px)]')}>
                        {expandSidebar ? (
                            <div className="h-full w-full">
                                <div className="flex flex-col justify-between h-full gap-2">
                                    {VENDOR_ROUTES.map((vendor) => (
                                        (vendor.label === "General" ? (
                                            <div key={vendor.label}>
                                                {vendor.items.map((item) => (
                                                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4" key={item.href}>
                                                        <Link
                                                            href={item.href}
                                                            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-muted-foreground", item.active && 'bg-muted text-primary')}
                                                        >
                                                            <item.icon className="h-4 w-4" />
                                                            {item.label}{" "}
                                                        </Link>
                                                        {/* <Link
                                                                href="#"
                                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                                            >
                                                                <Users className="h-4 w-4" />
                                                                Customers
                                                            </Link>
                                                            <Link
                                                                href="#"
                                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                                            >
                                                                <LineChart className="h-4 w-4" />
                                                                Analytics
                                                            </Link> */}
                                                    </nav>
                                                ))}
                                            </div>
                                        ) : (vendor.label === "Account" && (
                                            <div className="p-4" key={vendor.label}>
                                                {vendor.items.map((item) => (
                                                    <Link
                                                        href={item.href}
                                                        className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-muted-foreground", item.active && 'bg-muted text-primary')}
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                        {item.label}{" "}
                                                    </Link>
                                                ))}
                                            </div>
                                        )))
                                    ))}
                                </div>
                                {/* <div className="h-full">
                                </div> */}
                            </div>
                        ) : (
                            <aside className="bg-background w-full justify-between h-full flex items-center flex-col">
                                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="#"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                            >
                                                <Home className="h-5 w-5" />
                                                <span className="sr-only">Dashboard</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Dashboard</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="#"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                            >
                                                <ShoppingCart className="h-5 w-5" />
                                                <span className="sr-only">Orders</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Orders</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="#"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                            >
                                                <Package className="h-5 w-5" />
                                                <span className="sr-only">Products</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Products</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="#"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                            >
                                                <Users2 className="h-5 w-5" />
                                                <span className="sr-only">Customers</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Customers</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="#"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                            >
                                                <LineChart className="h-5 w-5" />
                                                <span className="sr-only">Analytics</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Analytics</TooltipContent>
                                    </Tooltip>
                                </nav>
                                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="#"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                            >
                                                <Settings className="h-5 w-5" />
                                                <span className="sr-only">Settings</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Settings</TooltipContent>
                                    </Tooltip>
                                </nav>
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
