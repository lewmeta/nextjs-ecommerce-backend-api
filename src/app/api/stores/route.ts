import { currentUser } from "@/lib/auth";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const user = await currentUser();
        const values = await req.json;

        const { name } = values;

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!name) {
            return new NextResponse("Name is required!", { status: 400 });
        }

        const store = await db.store.create({
            data: {
                name,
                userId: user.id
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}