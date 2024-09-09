import { NextResponse } from "next/server";
import bcyrpt from "bcryptjs"

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export async function POST(
    req: Request
) {
    try {
        const values = await req.json();

        const validatedFields = RegisterSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }

        const { email, password, name } = validatedFields.data;

        const hashedPassword = await bcyrpt.hash(password, 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            // return new NextResponse("Email is already in use!", { status: 409 });
            return NextResponse.json({ error: "Email is already in use!" }, { status: 409 });

        }

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        return NextResponse.json(user);
    } catch (error) {
        console.log("[REGISTER]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}