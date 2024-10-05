import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {

        const user = await currentUser();

        const body = await req.json();

        const { label, imageUrl, description } = body;

        if (!user?.id) {
            return new NextResponse('Unauthenticated', { status: 403 })
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }
        if (!description) {
            return new NextResponse("descrition is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const billboard = await db.billboard.update({
            where: {
                id: params.billboardId
            },
            data: {
                label,
                imageUrl,
                description
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}