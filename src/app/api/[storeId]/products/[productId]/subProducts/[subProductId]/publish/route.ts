import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string; subProductId: string } }
) {
    try {

        // Check if user is logged in;
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

        // check if subProduct exists before publishing;
        const subProduct = await db.subProduct.findFirst({
            where: {
                id: params.subProductId,
                productId: params.productId,
            },
            include: {
                sizes: true,
                color: true,
                images: true,
            }
        })

        if (!subProduct || !subProduct.sizes.length || !subProduct.sizes.length || !subProduct.color || !subProduct.images || !subProduct.sku) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
        }

        const publishedSubProduct = await db.subProduct.update({
            where: {
                id: params.subProductId,
                productId: params.productId
            },
            data: {
                isPublished: true,
            }
        })

        return NextResponse.json(publishedSubProduct)

    } catch (error) {
        console.log('[SUBPRODUCT_PUBLISH]', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}