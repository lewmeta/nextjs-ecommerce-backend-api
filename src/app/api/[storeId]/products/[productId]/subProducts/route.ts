import { currentRole, currentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const user = await currentUser();
        const { sku } = await req.json();

        if (!user?.id) {
            return new NextResponse('Unauthenticated', { status: 403 })
        }

        const storeByUserId = await db.store.findUnique({
            where: {
                id: params.storeId,
                userId: user?.id
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 401})
        }

        const lastSubProduct = await db.subProduct.findFirst({
            where: {
                productId: params.productId 
            },
            orderBy: {
                position: 'desc'
            },
        });

        const newPosition = lastSubProduct ? lastSubProduct.position + 1 : 1;

        if (sku) {
            const skuExists = await db.subProduct.findFirst({
                where: {
                    sku: sku,
                    productId: params.productId
                },
            });

            if (skuExists) {
                return NextResponse.json({ message: "This SKU already exists, try a different one!" }, { status: 409 });
            }
        }

        const subProduct = await db.subProduct.create({
            data: {
                sku,
                productId: params.productId,
                position: newPosition
            }
        })

        return NextResponse.json(subProduct)

    } catch (error) {
        console.log('[SUBPRODUCTS]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}