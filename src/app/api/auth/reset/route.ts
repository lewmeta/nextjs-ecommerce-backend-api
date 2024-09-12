import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { ResetSchema } from "@/schemas";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const values = await req.json();
        const validatedFields = ResetSchema.safeParse(values);

        if (!validatedFields.success) {
            // Collect all Zod error messages
            const errorMessages = validatedFields.error.errors.map((err) => err.message);
            return NextResponse.json({ error: `${errorMessages}` }, { status: 409 })
        }


        const { email } = validatedFields.data;

        const existingUser = await getUserByEmail(email);

        // if (!existingUser?.emailVerified) {
        //     return NextResponse.json({ error: "This email is not verified!" }, { status: 404 });
        // }

        if (!existingUser?.emailVerified) {
            const verificationToken = await generateVerificationToken(existingUser?.email as string);
            await sendVerificationEmail(verificationToken.email, verificationToken.token);

            return NextResponse.json({ error: "Email not verified, verification email sent!." }, { status: 202 });
        }

        const passwordResetToken = await generateVerificationToken(email);

        await sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token,
        )

        return NextResponse.json({ success: "Reset email sent!" }, { status: 200 });

    } catch (error) {
        console.log("[RESET ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}