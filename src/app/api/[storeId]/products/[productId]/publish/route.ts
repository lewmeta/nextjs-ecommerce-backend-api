import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string; } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if (!storeByUserId) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 403 })
        }

        const product = await db.product.findFirst({
            where: {
                id: params.productId,
                storeId: params.storeId
            },
            include: {
                subProducts: true
            }
        })

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const haspublishedSubProduct = product?.subProducts?.length && product.subProducts.some((subProduct) => subProduct.isPublished);

        if (!product.name || !product.description || !product.categoryId || !haspublishedSubProduct) {
            return NextResponse.json({
                message: "Missing required fields"
            }, { status: 400 })
        }

        const publishedProduct = await db.product.update({
            where: {
                id: params.productId,
                storeId: params.storeId
            },
            data: {
                isPublished: true
            },
        });

        return NextResponse.json({
            message: "Product published successfully",
            product: publishedProduct
        });

    } catch (error) {
        console.log('[PRODUCT_ID_PUBLISH]', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}