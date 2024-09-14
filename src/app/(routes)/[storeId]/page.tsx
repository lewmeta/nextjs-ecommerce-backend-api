"use client"

import { LayoutComponent } from '@/components/layout-component'
import { useParams } from 'next/navigation'

const StoreId = () => {
    const params = useParams();
    return (
        <LayoutComponent>
            storeId: {params.storeId}
        </LayoutComponent>
    )
}

export default StoreId