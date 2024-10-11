import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string; subProductId: string } }
) {
    try {
        const user = await currentUser();

        const { sku, isPublished, ...values } = await req.json();

        console.log({ values: values })

        if (!user?.id) {
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 })
        }

        // Check if subproduct exists before updating.

        const existingSubproduct = await db.subProduct.findFirst({
            where: {
                id: params.subProductId,
                productId: params.productId
            }
        })

        if (!existingSubproduct) {
            return new NextResponse("No suproduct found", { status: 401 })
        }

        // Check if the SKU already exists for another subproduct (optional if SKU can be edited)
        if (sku) {
            const skuExists = await db.subProduct.findFirst({
                where: {
                    sku: sku,
                    NOT: { id: params.subProductId }, // Exclude current subproduct
                },
            });

            if (skuExists) {
                return NextResponse.json({ message: "This SKU already exists!" }, { status: 409 });
            }
        }

        const subProduct = await db.subProduct.update({
            where: {
                id: params.subProductId,
                productId: params.productId,
            },
            data: { ...values }
        })


        return NextResponse.json(subProduct);
    } catch (error) {
        console.log('[SUBPRODUCT_PATCH]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }

}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; productId: string; subProductId: string } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse('Unauthenticated', { status: 401 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 })
        }

        const subProductById = await db.subProduct.findFirst({
            where: {
                id: params.subProductId,
                productId: params.productId
            },
        });

        if (!subProductById) {
            return new NextResponse('Sub Product not found', { status: 404 })
        }

        const publishedSubProductsProduct = await db.subProduct.findMany({
            where: {
                productId: params.productId,
                isPublished: true
            },
        });

        if (!publishedSubProductsProduct.length) {
            await db.product.update({
                where: {
                    id: params.productId
                },
                data: {
                    isPublished: false
                }
            })
        }

        const subProduct = await db.subProduct.delete({
            where: {
                id: params.subProductId,
            }
        })

        return NextResponse.json(subProduct)
    } catch (erorr) {
        console.log('[SUBPRODUCT_DELETE]', erorr);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}