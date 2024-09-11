"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocials?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocials,
}: CardWrapperProps) => {
    return (
        <Card className="w-[470px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            {showSocials && (
                <CardHeader className="pt-0 mt-0">
                    <Social />
                </CardHeader>
            )}
            <CardContent >
                <div className="text-center mb-2">or continue with email</div>
                {children}
            </CardContent>
            {/* {showSocials && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )} */}
            <CardFooter>
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}