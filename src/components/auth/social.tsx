"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

import { GoogleIcon } from "@/components/icons/google-icon"
import { GithubIcon } from "@/components/icons/github-icon"
import { FacebookIcon } from "@/components/icons/facebook-icon"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { Button } from "@/components/ui/button"

export const Social = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl")

    const onClick = (provider: "google" | "github" | "facebook") => {
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT
        });
    }
    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("google")}
            >
                <GoogleIcon className="h-5 w-5" />
            </Button>
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("facebook")}
            >
                <FacebookIcon className="h-5 w-5 text-sky-600" />
            </Button>
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("github")}
            >
                <GithubIcon className="h-5 w-5" />
            </Button>
        </div>
    )
}
