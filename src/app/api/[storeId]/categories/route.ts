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

        // if (existingSlug){
        //     // return NextResponse.json({error: "Slug already exists"}, { status: 403})
        // }
        if (existingSlug) {
            return NextResponse.json({ error: "Email is already in use!" }, { status: 409 });
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