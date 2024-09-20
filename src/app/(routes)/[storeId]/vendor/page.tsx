'use client'

import { CategoryIcon } from "@/components/icons/category-icon";
import { CouponIcon } from "@/components/icons/coupon-icon";
import { FilterIcon } from "@/components/icons/filter-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { RocketIcon } from "@/components/icons/rocket-icon";
import { ShareIcon } from "@/components/icons/share-icon";
import { LayoutComponent } from "@/components/layout-component"
import { Heading } from "@/components/navigation/heading";
import { useParams, usePathname } from "next/navigation"

const VendorPage = () => {
    const pathname = usePathname();
    const params = useParams()
    const ROUTES = [
        {
            href: `/${params.storeId}/vendor/category`,
            label: "Filter",
            icon: FilterIcon,
            active: pathname === `/${params.storeId}/vendor/category`,
        },
        {
            href: `/${params.storeId}/vendor/coupons`,
            label: "Share",
            icon: ShareIcon,
            active: pathname === `/${params.storeId}/vendor/coupons`,
        },
        {
            icon: PlusIcon,
            label: "Add product",
            href: `/${params.storeId}/vendor/perfomance`,
            active: pathname === `/${params.storeId}/vendor/perfomance`
        }
    ]
    return (
        <LayoutComponent
            title="Dashboard"
            // routes={
            //     ROUTES
            // }
        >
            <Heading 
            title="Dashboard"
            description="Check out your dahsboard and your perfomance metrixes"
            routes={ROUTES}
            />
            content
        </LayoutComponent>
    )
}

export default VendorPage