import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const user = await currentUser();

        const body = await req.json();

        const { name, billboardId, imageUrl } = body;

        if (!user) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }
        if (!name) {
            return new NextResponse('Name is required'), { status: 400 }
        }
        if (!billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id,
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 405 })
        };

        const slug = slugify(name);

        // Check if the slug already exists in the database
        let existingSlug = await db.category.findFirst({
            where: {
                slug: slug,
                storeId: params.storeId
            },
        });

        if (existingSlug) {
            return NextResponse.json({ error: "This slug already exists!" }, { status: 409 });
        }

        const category = await db.category.create({
            data: {
                name,
                imageUrl,
                slug,
                billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse('Internal erorr', { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return NextResponse.json({error: 'Store id is requred'}, { status: 400})
        }

        const categories = await db.category.findMany({
            where: {
                storeId: params.storeId
            },
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse('Internal error', { status: 500 })
    }
}