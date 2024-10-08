import { DataTable } from "@/components/ui/data-table";
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { redirect, useParams } from "next/navigation";
import { Column, ProductColumn } from "./_components/columns";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { ProductsClient } from "./_components/client";

const ProductsPage = async ({
    params
}: { params: { storeId: string } }
) => {
    const user = await currentUser();

    if (!user?.id) {
        return redirect('/auth/login')
    }

    const products = await db.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            questions: true,
            subProducts: {
                include: {
                    sizes: true
                }
            },
        }
    });

    const formattedProducts = products.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        color: item.subProducts[0]?.color,
        price: formatter.format(item.subProducts[0]?.sizes[0].price),
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
        size: item.subProducts[0]?.sizes[0].size,
    })) as unknown as  ProductColumn[]

    return (
        <div>
            <ProductsClient 
            data={formattedProducts}
            />
        </div>
    )
}

export default ProductsPage