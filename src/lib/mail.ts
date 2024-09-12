import { activateEmailTemplate } from "@/components/emails/activate-email-template";
import { resetPassordTemplate } from "@/components/emails/reset-password-template";
import { sendEmail } from "@/utils/send-email";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

export const sendVerificationEmail = async (
    email: string,
    token: string,
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    sendEmail({
        to: email,
        subject: "Verify your Email",
        url: confirmLink,
        template: activateEmailTemplate,
    });
}

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    sendEmail({
        to: email,
        subject: "Reset your password",
        url: resetLink,
        template: resetPassordTemplate,
    });
}
