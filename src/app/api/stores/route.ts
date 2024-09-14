import { currentUser } from "@/lib/auth";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const user = await currentUser();
        const values = await req.json();

        const { name } = values;

        if (!user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (!name) {
            return NextResponse.json({ error: "Name is required!" }, { status: 400 });
        }

        const existingStore = await db.store.findFirst({
            where: {
                name,
            },
        });

        if (existingStore) {
            return NextResponse.json({ error: "A store with this name already exists!" }, { status: 409 });
        }

        await db.store.create({
            data: {
                name,
                userId: user.id
            }
        });

        return NextResponse.json({ success: "Store created successfully!" }, { status: 200 });
    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}