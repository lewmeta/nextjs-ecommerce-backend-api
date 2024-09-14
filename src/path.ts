import { BarChartIcon, LayersIcon, LayoutIcon, ListBulletIcon } from "@radix-ui/react-icons";
// import { useParams, usePathname } from "next/navigation"
import { UserIcon } from "./components/icons/user-icon";

// const params = useParams();
// const pathname = usePathname();

export const VENDOR_ROUTES = [
    {
        // href: `/${params.storeId}/dashboard`,
        label: "Dashboard",
        icon: LayoutIcon,
        // active: pathname === `/${params.storeId}/dashboard`,
    },
    {
        icon: LayersIcon,
        label: "Browse",
        href: "/search",
        active: ""
    }
]

export const ADMIN_ROUTES = [
    {
        icon: ListBulletIcon,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: BarChartIcon,
        label: "Analytics",
        href: "/teacher/analytics",
    },
    {
        icon: UserIcon,
        label: "Manage Users",
        href: "/teacher/users",
    }
] 