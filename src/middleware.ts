import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes"
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {

    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return;

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return;
    }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname; // e.g., '/auth/login'
        if (nextUrl.search) {
            callbackUrl += nextUrl.search; // Append any query params
        }

        console.log("Callback URL:", callbackUrl); // Log the callback URL

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        console.log("Encoded Callback URL:", encodedCallbackUrl); // Log the encoded callback URL

        return NextResponse.redirect(new URL(
            `/auth/login?callbackUrl=${encodedCallbackUrl}`, // Redirect to login with callback URL
            nextUrl
        ));
    }

    return;
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)'],
}