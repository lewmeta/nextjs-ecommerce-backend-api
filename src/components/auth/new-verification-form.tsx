"use client"

import { useCallback, useEffect, useState } from "react"
import { BeatLoader } from "react-spinners"
import { useSearchParams } from "next/navigation"

import { FormError } from "@/components/message/form-error";
import { FormSuccess } from "@/components/message/form-success";
import axios from "axios";
import { CardWrapper } from "./card-wrapper";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        axios.post(`/api/auth/new-verification`, { token })
            .then((res) => {
                const { data } = res;
                if (data.success) {
                    setSuccess(data.success);
                } else if (data.error) {
                    setError(data.error);
                }
            })
            .catch((err) => {
                console.log(err);
                setError(err || "Something went wrong!")
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);
    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonHref="/auth/login"
            backButtonLabel="Back to Login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <BeatLoader />
                )}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    )
}