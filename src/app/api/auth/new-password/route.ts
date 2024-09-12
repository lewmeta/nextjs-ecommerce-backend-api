import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { values, token } = await req.json();
        const validatedFields = NewPasswordSchema.safeParse(values);

        // Check for missing token
        if (!token) {
            return NextResponse.json({ error: "Missing token!" }, { status: 400 }); // 400: Bad Request
        }

        // Validate form fields
        if (!validatedFields.success) {
            const errorMessages = validatedFields.error.errors.map((err) => err.message);
            return NextResponse.json({ error: `Invalid input: ${errorMessages.join(", ")}` }, { status: 422 }); // 422: Unprocessable Entity
        }

        const { password } = validatedFields.data;

        // Check if token exists
        const existingToken = await getPasswordResetTokenByToken(token);
        if (!existingToken) {
            return NextResponse.json({ error: "Invalid or expired token!" }, { status: 403 }); // 403: Forbidden
        }

        // Check if token has expired
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return NextResponse.json({ error: "Token has expired!" }, { status: 410 }); // 410: Gone
        }

        // Check if user exists
        const existingUser = await getUserByEmail(existingToken.email);
        if (!existingUser) {
            return NextResponse.json({ error: "User with this email does not exist!" }, { status: 404 }); // 404: Not Found
        }

        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword },
        });

        // Delete the used password reset token
        await db.passwordResetToken.delete({
            where: { id: existingToken.id },
        });

        return NextResponse.json({ success: "Password reset successfully!" }, { status: 200 }); // 200: OK
    } catch (error) {
        console.error("[RESET ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }); // 500: Internal Server Error
    }
}
