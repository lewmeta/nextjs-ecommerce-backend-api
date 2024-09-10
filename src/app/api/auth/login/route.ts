import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const values = await req.json();
        const validatedFields = LoginSchema.safeParse(values);

        if (!validatedFields.success) {
            // Collect all Zod error messages
            const errorMessages = validatedFields.error.errors.map((err) => err.message);
            return new NextResponse(`${errorMessages}`, { status: 409 })
        }

        const { email, password, code } = validatedFields.data;

        const existingUser = await getUserByEmail(email);

        if (!existingUser || existingUser.email || !existingUser.password) {
            return NextResponse.json({ error: "Email does not exist!" }, { status: 409 });
        }


    } catch (error) {
        console.log("[LOGIN]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}