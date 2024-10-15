import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    { params }: { params: { storeId: string; productId: string; subProductId: string } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 })
        }

        // check if Store exists ;
        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if (!storeByUserId) {
            return NextResponse.json({ message: "Unauthorized!" }, { status: 403 })
        }

        const unpublishedSubProduct = await db.subProduct.update({
            where: {
                id: params.subProductId,
                productId: params.productId,
            },
            data: {
                isPublished: false
            }
        })

        const publishedSubProductsInProduct = await db.subProduct.findMany({
            where: {
                productId: params.productId,
                isPublished: true
            }
        })

        if (!publishedSubProductsInProduct.length) {
            await db.product.update({
                where: {
                    id: params.productId,
                },
                data: {
                    isPublished: false
                }
            })
        } 

        return NextResponse.json(unpublishedSubProduct)

    } catch (error) {
        console.log('[SUBPRODUCT_UNPUBLISH]', error);
        return new NextResponse("Internal Server Error", { status: 500})
    }
}