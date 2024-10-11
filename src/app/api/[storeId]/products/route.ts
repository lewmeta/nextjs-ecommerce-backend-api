import { NextResponse } from "next/server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const user = await currentUser();

        const body = await req.json();

        const { name } = body;

        if (!user?.id) {
            return NextResponse.json({message: "Unauthenticated"}, { status: 403 })
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 })
        }

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if (!storeByUserId) {
        return NextResponse.json({message:'Unauthorized'}, { status: 405 })
        }

        const slug = slugify(name)

        // Check if the slug already exists in the database
        let existingSlug = await db.product.findFirst({
            where: {
                slug: slug,
                storeId: params.storeId
            },
        });

        if (existingSlug) {
            return NextResponse.json({message: "This slug already exists!"}, { status: 409 });
        }

        const product = await db.product.create({
            data: {
                name,
                storeId: params.storeId,
                slug: slug,
            }
        });

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_CREATE]', error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}