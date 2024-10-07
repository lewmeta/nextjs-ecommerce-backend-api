'use client'

import { useParams, usePathname } from "next/navigation";

import { Compass } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { Overview } from "../icons/over-view-icon";
import { PerformanceIcon } from "../icons/perfomance-icon";
import { OrdersIcon } from "../icons/orders-icon";
import { MessagesIcon } from "../icons/messages-icon";
import { ProductIcon } from "../icons/product-icon";
import { CouponIcon } from "../icons/coupon-icon";
import { CategoryIcon } from "../icons/category-icon";
import { BillBoardIcon } from "../icons/billboard-icon";
import { RocketIcon } from "../icons/rocket-icon";
import { UserIcon } from "../icons/user-icon";
import { useExpandSlice } from "@/hooks/use-expand-slice";
import { CustomersIcon, SettingsIcon } from "../icons";

export const SidebarRoutes = () => {
    const params = useParams();
    const pathname = usePathname();

    const { expandSidebar } = useExpandSlice();


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
                    children: [
                        {
                            href: `/${params.storeId}/vendor/products/create`,
                            label: "Create Product",
                            icon: ProductIcon,
                            active: pathname === `/${params.storeId}/vendor/products/create`,
                        },
                        {
                            href: `/${params.storeId}/vendor/products/manage`,
                            label: "Manage Products",
                            icon: ProductIcon,
                            active: pathname === `/${params.storeId}/vendor/products/manage`,
                        },
                    ],
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

    const ADMIN_ROUTES = [
        {
            icon: Compass,
            label: "Courses",
            href: "/teacher/courses",
            active: true
        },
        {
            icon: Compass,
            label: "Analytics",
            href: "/teacher/analytics",
            active: true
        },
        {
            icon: Compass,
            label: "Manage Users",
            href: "/teacher/users",
            active: true
        }
    ]

    const HELP_ROUTES = [
        {
            href: `/${params.storeId}/vendor/category`,
            label: "Category",
            icon: CategoryIcon,
            active: pathname === `/${params.storeId}/vendor/category`,
        },
        {
            href: `/${params.storeId}/vendor/coupons`,
            label: "Coupons",
            icon: CouponIcon,
            active: pathname === `/${params.storeId}/vendor/coupons`,
        },
        {
            icon: RocketIcon,
            label: "Perfomance",
            href: `/${params.storeId}/vendor/perfomance`,
            active: pathname === `/${params.storeId}/vendor/perfomance`
        }
    ]
    
    const isAdminRoute = pathname?.startsWith(`/${params.storeId}/admin`);
    const routes = isAdminRoute ? ADMIN_ROUTES : VENDOR_ROUTES;

    return (
        <>
            {
                VENDOR_ROUTES.map((route, index) => (
                    <SidebarItem
                        key={index}
                        // icon={route.icon}
                        label={route.label}
                        items={route.items}
                    // href={route.href}
                    // active={route.active}
                    />
                ))
            }
        </>

    )
}
