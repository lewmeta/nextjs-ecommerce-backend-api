import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        const existingToken = await getVerificationTokenByToken(token);

        if (!existingToken) {
            return NextResponse.json({ error: "Token does not exist!" }, { status: 404 });
        }

        // Check if token has expired
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return NextResponse.json({ error: "Token has expired!" }, { status: 410 }); // 410 Gone
        }

        // Find the user associated with the token email
        const existingUser = await getUserByEmail(existingToken.email);
        if (!existingUser) {
            return NextResponse.json({ error: "Email does not exist!" }, { status: 404 });
        }


        // Update user emailVerified status and save
        await db.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(), // Mark email as verified
                email: existingToken.email,
            },
        });

        const verificationCode = await db.verificationToken.findFirst({
            where: {
                id: existingToken.id
            }
        })
        // Delete the verification token after successful verification
        if (verificationCode) {
            await db.verificationToken.delete({
                where: { id: existingToken.id }
            });
        }
        // Return success response
        return NextResponse.json({ success: "Email verified successfully!" });

    } catch (error) {
        console.error("[VERIFICATION_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}