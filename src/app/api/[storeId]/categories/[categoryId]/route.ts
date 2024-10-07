import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db"
import { slugify } from "@/lib/slugify";
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {

        if (!params.categoryId) {
            return NextResponse.json({ error: "Category Id is required" }, { status: 400 })
        }

        const category = await db.category.findUnique({
            where: {
                id: params.categoryId
            },
            include: {
                billboard: true
            },
        });

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {

        const user = await currentUser();

        const body = await req.json();

        const { name, billboardId, imageUrl } = body;

        if (!user?.id) {
            return NextResponse.json({ error: 'Unauthenticated' }, { status: 403 })
        }

        if (!params.categoryId) {
            return NextResponse.json({ error: "Category id is required" }, { status: 400 })
        }

        if (!name || !billboardId || !imageUrl) {
            return NextResponse.json({ error: "Missing some required fields" }, { status: 403 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        });

        if (!storeByUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 405 })
        }

        const updatedSlug = slugify(name);

        const category = await db.category.update({
            where: {
                id: params.categoryId
            },
            data: {
                name,
                billboardId,
                slug: updatedSlug,
                imageUrl: imageUrl,
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORIES_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 })
    }
}
export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const user = await currentUser();

        if (!user?.id){
            return NextResponse.json({error: "Unauthenticated"}, {status: 403})
        }

        const storeByUserId = await db.store.findUnique({
            where:{
                id: params.storeId,
                userId: user.id
            }
        });

        if (!storeByUserId){
            return NextResponse.json({error: "Unauthorized"}, { status: 405})
        }

        const category = await db.category.delete({
            where: {
                id: params.categoryId,
            }
        })

        return NextResponse.json(category)
        
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse('Internal error', { status: 500})
    }
}