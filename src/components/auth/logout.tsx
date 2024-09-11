"use client"

import { signOut } from "next-auth/react";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
    children?: React.ReactNode;
};

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        signOut({ callbackUrl: '/auth/login' });
    };

    return (
        <span
            onClick={onClick}
            className="cursor-pointer"
        >
            {children}
        </span>
    )
}