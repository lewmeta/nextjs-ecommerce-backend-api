"use client"

import { useExpandSlice } from "@/hooks/use-expand-slice";
import { cn } from "@/lib/utils";
import { MenuIcon } from "../icons/menu-icon";
import { useParams, usePathname } from "next/navigation";
import { SidebarItems } from "./sidebar-items";
import { BarChartIcon, LayersIcon, LayoutIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { UserIcon } from "../icons/user-icon";

export const Sidebar = () => {
    const { expandSidebar, toggleSidebar } = useExpandSlice();

    const pathname = usePathname();
    const params = useParams();

    const isAdminRoute = pathname?.startsWith(`/${params.storeId}/admin`);

    const VENDOR_ROUTES = [
        {
            href: `/${params.storeId}/dashboard`,
            label: "Dashboard",
            icon: LayoutIcon,
            active: pathname === `/${params.storeId}/dashboard`,
        },
        {
            icon: LayersIcon,
            label: "Browse",
            href: "/search",
            active: true
        }
    ]
    const ADMIN_ROUTES = [
        {
            icon: ListBulletIcon,
            label: "Courses",
            href: "/teacher/courses",
            active: true
        },
        {
            icon: BarChartIcon,
            label: "Analytics",
            href: "/teacher/analytics",
            active: true
        },
        {
            icon: UserIcon,
            label: "Manage Users",
            href: "/teacher/users",
            active: true
        }
    ]

    // console.log({ params: params.storeId })
    const routes = isAdminRoute ? ADMIN_ROUTES : VENDOR_ROUTES;

    return (
        <div className={cn("fixed top-0 left-0 h-screen p-[30px]  border-r border-gray-200 overflow-visible z-20 md:block hidden", expandSidebar ? "w-[300px]" : "w-[80px]")}>
            <div className="flex flex-col justify-between h-full w-full">
                <div className="h-[40px] flex justify-between items-center">
                    <div>
                        L
                    </div>
                    <MenuIcon onClick={toggleSidebar} />
                </div>
                <div className="h-full flex flex-col justify-between">
                    <div>
                        {routes.map((route) => (
                            <SidebarItems
                                href={route.href}
                                key={route.href}
                                lablel={route.label}
                                icon={route.icon}
                                active={route.active}

                            />
                        ))}
                    </div>
                    <div>
                        footer
                    </div>
                </div>
            </div>
        </div>
    )
}
