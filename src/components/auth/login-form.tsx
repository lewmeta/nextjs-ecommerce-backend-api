"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios from "axios";


import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/message/form-error";
import { FormSuccess } from "@/components/message/form-success";
import { Checkbox } from "../ui/checkbox";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") as string;
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    // const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [isPending] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        console.log(values)

        try {
            const res = await axios.post(`/api/auth/login`, { values, callbackUrl });

            const data = res.data;

            if (res.status === 200) {
                // Handle success response
                setSuccess("Login successful!");
                // Check if two-factor authentication is required
                if (data?.twoFactor) {
                    setShowTwoFactor(true);  // Show two-factor input if needed
                }

                // Optionally, redirect user after successful login
                if (callbackUrl) {
                    window.location.href = callbackUrl;
                }
            } else if (res.status === 202) {
                // Success: Email verification required
                if (data?.success) {
                    setSuccess(data.success);  // Show the API's message
                }
                // setSuccess("Confirmation email sent! Please verify your email before logging in.");
            } else {
                // Handle response errors that aren't handled in the catch block
                // setError(data.message || "Login failed. Please try again.");
                if (data?.error) {
                    setError(data.error);  // Use the error message from the API
                }
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || error.message || "Something went wrong");
            } else {
                setError("An unknown error occurred. Please try again.");
            }
        }

    }


    return (
        <CardWrapper
            headerLabel="Sign in to your account"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocials
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="max-w-[130px] w-full h-[1px] bg-slate-200">
                        </div>
                        Or use Email.
                        <div className="max-w-[130px] w-full h-[1px] bg-slate-200">
                        </div>
                    </div>
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="123456"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* <FormLabel>Email</FormLabel> */}
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Email address"
                                                    type="email"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* <FormLabel>Password</FormLabel> */}
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Password"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                        <FormItem className="flex  items-center justify-between space-x-3 ">
                                            <div className="flex items-center space-x-3">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="mt-0 pt-0"
                                                    />
                                                </FormControl>
                                                <FormDescription
                                                    className="!mt-0"
                                                >
                                                    Rember me on this device.
                                                </FormDescription>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal !mt-0"
                                            >
                                                <Link href="/auth/reset">
                                                    Forgot password?
                                                </Link>
                                            </Button>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );

}
