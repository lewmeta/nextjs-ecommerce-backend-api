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

export const SidebarRoutes = () => {
    const params = useParams();
    const pathname = usePathname();

    const { expandSidebar } = useExpandSlice();


    const VENDOR_ROUTES = [
        {
            href: `/${params.storeId}/vendor`,
            label: "Dashboard",
            icon: Overview,
            active: pathname === `/${params.storeId}/vendor`,
        },
        {
            href: `/${params.storeId}/vendor/orders`,
            label: "Orders",
            icon: OrdersIcon,
            active: pathname === `/${params.storeId}/vendor/orders`,
        },
        {
            href: `/${params.storeId}/vendor/orders`,
            label: "Orders",
            icon: MessagesIcon,
            active: pathname === `/${params.storeId}/vendor/orders`,
        },
        {
            href: `/${params.storeId}/vendor/billboards`,
            label: "Billboards",
            icon: BillBoardIcon,
            active: pathname === `/${params.storeId}/vendor/billboards`,
        },
        {
            href: `/${params.storeId}/vendor/products`,
            label: "Products",
            icon: ProductIcon,
            active: pathname === `/${params.storeId}/vendor/products`,
        },
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
            icon: UserIcon,
            label: "Users",
            href: `/${params.storeId}/vendor/users`,
            active: pathname === `/${params.storeId}/vendor/users`
        },
        {
            icon: PerformanceIcon,
            label: "Perfomance",
            href: `/${params.storeId}/vendor/perfomance`,
            active: pathname === `/${params.storeId}/vendor/perfomance`
        }
    ]

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
        <div className="flex flex-col w-full gap-1">
            {routes.map((route, index) => (
                <SidebarItem
                    key={index}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                    active={route.active}
                />
            ))}

            {/* <div className="">
                <div className="text-center">
                    <span className="text-gray-500">Help and docs</span>

                    {HELP_ROUTES.map((route, index) => (
                        <SidebarItem
                            key={index}
                            icon={route.icon}
                            label={route.label}
                            href={route.href}
                            active={route.active}
                        />
                    ))}

                </div>
            </div> */}
        </div>
    )
}
