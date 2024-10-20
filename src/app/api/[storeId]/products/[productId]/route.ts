import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
// import { slugify } from "@/lib/slugify";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const user = await currentUser();

        const { sku, slug, ...values } = await req.json();

        if (!user?.id) {
            return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 405 })
        }

        // Check if the SKU already exists for another subproduct (optional if SKU can be edited)
        if (sku) {
            const skuExists = await db.subProduct.findFirst({
                where: {
                    sku: sku,
                    // NOT: { id: params.subProductId }, // Exclude current subproduct
                },
            });

            if (skuExists) {
                return NextResponse.json({ message: "This SKU already exists!" }, { status: 409 });
            }
        }

        const product = await db.product.update({
            where: {
                storeId: params.storeId,
                id: params.productId
            },
            data: {
                ...values,
                slug: slug
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse('Iternal Server Errro', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { productId: string, storeId: string } }
) {
    try {

        const user = await currentUser();

        const userId = user?.id

        if (!userId) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
        }

        if (!params.productId) {
            return NextResponse.json({ message: "Product id is required" }, { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 405 });
        }

        const product = await db.product.delete({
            where: {
                id: params.productId
            },
        });

        return NextResponse.json({
            message: "Product successfully deleted!",
            product: product
        })

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}