import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const { values, callbackUrl } = await req.json();
        const validatedFields = LoginSchema.safeParse(values);

        console.log(callbackUrl);
        if (!validatedFields.success) {
            return NextResponse.json({ error: "Invalid fields!" }, { status: 400 });
        }

        const { email, password, code } = validatedFields.data;

        const existingUser = await getUserByEmail(email);

        // Check if the user exists and has a valid email and password
        if (!existingUser || !existingUser?.email || !existingUser?.password) {
            return NextResponse.json({ error: "Email does not exist!" }, { status: 404 });
        }

        // Check if the email is verified
        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(existingUser.email as string);
            await sendVerificationEmail(verificationToken.email, verificationToken.token);

            return NextResponse.json({ success: "Confirmation email sent! Please verify." }, { status: 202 });
        }

        // TODO: Add two-factor authentication logic here

        // If the email is verified, proceed to login
        try {
            const signInResponse = await signIn("credentials", {
                email,
                password,
                redirect: false // Prevent automatic redirection
            });

            if (signInResponse?.error) {
                return NextResponse.json({ error: signInResponse.error }, { status: 401 });
            }

            // Return success if login is successful
            return NextResponse.json({ success: "Login successful", redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT }, { status: 200 });

        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return NextResponse.json({ error: "Invalid credentials!" }, { status: 401 });
                    default:
                        return NextResponse.json({ error: "Authentication failed!" }, { status: 500 });
                }
            }
            throw error;
        }

    } catch (error) {
        console.log("[LOGIN ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}