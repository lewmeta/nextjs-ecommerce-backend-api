import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function PUT(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse('Unauthenticated', { status: 403})
        }

        const { list } = await req.json();

        const storeByUserId = await db.store.findUnique({
            where: {
                id: params.storeId,
                userId: user.id
            },
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 401})
        }

        for (let item of list) {
            await db.subProduct.update({
                where: {
                    id: item.id
                },
                data: { position: item.position}
            })
        }

        return new NextResponse('Success', { status: 200})

    } catch (error) {
        console.log('[REORDER]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}