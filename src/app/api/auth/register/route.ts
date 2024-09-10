import { NextResponse } from "next/server";
import bcyrpt from "bcryptjs"

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(
    req: Request
) {
    try {
        const values = await req.json();

        const validatedFields = RegisterSchema.safeParse(values);

        if (!validatedFields.success) {
            // Collect all Zod error messages
            const errorMessages = validatedFields.error.errors.map((err) => err.message);
            return new NextResponse(`${errorMessages}`, { status: 409 })
        }

        const { email, password, name } = validatedFields.data;


        const hashedPassword = await bcyrpt.hash(password, 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return NextResponse.json({ error: "Email is already in use!" }, { status: 409 });
        }

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        const verificationToken = await generateVerificationToken(email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return NextResponse.json(verificationToken, { status: 200 });
    } catch (error) {
        console.log("[REGISTER]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}