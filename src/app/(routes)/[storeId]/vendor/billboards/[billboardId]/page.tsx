import { LayoutComponent } from "@/components/layout-component"
import { db } from "@/lib/db"
import { BillboardForm } from "./_components/billboard-form"

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
    const billboard = await db.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    })

    return (
        <LayoutComponent>
            <div className="flex-1 space-y-4 p-4 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
        </LayoutComponent>
    )
}

export default BillboardPage
