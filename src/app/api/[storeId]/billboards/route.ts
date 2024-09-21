import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const user = await currentUser();

        const body = await req.json();

        const { label, description, imageUrl } = body;

        if (!user?.id) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }
        if (!description) {
            return new NextResponse("Description is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user?.id
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unathorized", { status: 405 });
        }

        const billboard = await db.billboard.create({
            data: {
                label,
                imageUrl,
                description,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const billboards = await db.billboard.findMany({
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}