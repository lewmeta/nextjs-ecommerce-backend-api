import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const user = await currentUser();

        const values = await req.json();
        const { name } = values;


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

        // const slug = slugify(name)

        const product = await db.product.update({
            where: {
                storeId: params.storeId,
                id: params.productId
            },
            data: {
                ...values,
                // slug: slug
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse('Iternal Server Errro', { status: 500 })
    }
}