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
        imageUrl: item.imageUrl,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    
    // Check if there are no billboards
    const isEmpty = formatedBillboards.length === 0;

    return (
        <LayoutComponent
        >
           <div className='flex-1 space-y-4 p-8 pt-6'>
                {isEmpty ? (
                    // Render a message or component when no billboards are available
                    <div className="text-center text-gray-500">
                        No billboards available for this store.
                    </div>
                ) : (
                    // Render the BillboardClient component with the data
                    <BillboardClient data={formatedBillboards} />
                )}
            </div>
        </LayoutComponent>
    )
}

export default Billboards
