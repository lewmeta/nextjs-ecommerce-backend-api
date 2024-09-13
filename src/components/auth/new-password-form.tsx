"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/message/form-error";
import { FormSuccess } from "@/components/message/form-success";

export const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const { isLoading, isSubmitting } = form.formState

    // const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    //     setError("");
    //     setSuccess("");

    //     try {
    //         const res = await axios.post(`/api/auth/new-password`, { values, token });

    //         const data = res.data;
    //         if (res.status === 200) {
    //             setSuccess(data.success);
    //         } else if (res.status) {
    //             setError(data.error);
    //         } else {
    //             if (data?.error) {
    //                 setError(data.error);
    //             }
    //         }
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             setError(error.response?.data?.error || error.message || "Something went wrong");
    //         } else {
    //             setError("An unknown error occurred. Please try again.");
    //         }
    //     }

    // };

    const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
        setError("");
        setSuccess("");

        try {
            const res = await axios.post(`/api/auth/new-password`, { values, token });
            const data = res.data;

            if (res.status === 200) {
                setSuccess(data.success || "Password reset successfully!");
            } else {
                // Handle error cases based on the status code
                switch (res.status) {
                    case 400:
                        setError("Bad Request: Please provide a valid token.");
                        break;
                    case 403:
                        setError("Invalid token. Please try requesting a new one.");
                        break;
                    case 410:
                        setError("The reset token has expired. Please request a new one.");
                        break;
                    case 404:
                        setError("The email associated with this token does not exist.");
                        break;
                    case 422:
                        setError(data.error || "Invalid input. Please check your data.");
                        break;
                    default:
                        setError("Unexpected error occurred. Please try again.");
                }
            }
        } catch (error) {
            // Axios error handling
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.error ||
                    error.message ||
                    "Something went wrong. Please try again."
                );
            } else {
                setError("An unknown error occurred. Please try again.");
            }
        }
    };

    return (
        <CardWrapper
            headerLabel="Enter a new password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading || isSubmitting}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full"
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
