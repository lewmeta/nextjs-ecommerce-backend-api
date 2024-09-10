import { activateEmailTemplate } from "@/components/emails/activate-email-template";
import { sendEmail } from "@/utils/send-email";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

export const sendVerificationEmail = async (
    email: string,
    token: string,
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    // sendEmail(
    //     // email,
    //     // "Verify your Email",
    //     // confirmLink,
    //     // activateEmailTemplate


    // )
    sendEmail({
        to: email,
        subject: "Verify your Email",
        url: confirmLink,
        template: activateEmailTemplate,
    });
} 