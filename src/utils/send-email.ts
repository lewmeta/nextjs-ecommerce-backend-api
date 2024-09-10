import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground"

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env;

const oauth2Client = new google.auth.OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    OAUTH_PLAYGROUND,
);

// Set credentials with the refresh token
oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
});

// send email;

export const sendEmail = async (to: string, url: string, subject: string, template: (to: string, url: string) => string) => {
    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;
    if (!accessToken) {
        throw new Error("Failed to retrieve access token");
    }

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken: accessToken,
        },
    } as SMTPTransport.Options);

    const mailingOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: subject,
        html: template(to, url),
    };
    smtpTransport.sendMail(mailingOptions, (err, infos) => {
        if (err) return err
        return infos
    })
}