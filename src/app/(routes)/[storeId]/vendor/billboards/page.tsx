import { format } from "date-fns"

import { LayoutComponent } from '@/components/layout-component'
import { db } from '@/lib/db'
import { BillboardClient } from './_components/billboard-client'
import { BillboardColumn } from './_components/columns';

const Billboards = async (
    { params }: { params: { storeId: string } }
) => {

    const billboards = await db.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    });

    const formatedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))
    return (
        <LayoutComponent
        >
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardClient
                    data={formatedBillboards}
                />
            </div>
        </LayoutComponent>
    )
}

export default Billboards
