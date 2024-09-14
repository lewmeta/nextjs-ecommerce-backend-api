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
    description?: string;
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
                {children}
            </CardContent>
            <CardFooter className="pt-0 ">
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}