"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetSchema } from "@/schemas";
import axios from "axios";

import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    // FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/message/form-error";
import { FormSuccess } from "@/components/message/form-success";

export const ResetForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    });

    const { isValid, isSubmitting } = form.formState

    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");

        try {
            const res = await axios.post(`/api/auth/reset`, values);

            const data = res.data;

            if (res.status === 200) {
                setSuccess(data.success);
            } else if (res.status === 404) {
                setError(data.error);
            } else {
                if (data?.error) {
                    setError(data.error);
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || error.message || "Something went wrong");
            } else {
                setError("An unknown error occurred. Please try again.");
            }
        }

    };
    return (
        <CardWrapper
            headerLabel="Forgot your password?"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Email</FormLabel> */}
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isSubmitting}
                                            placeholder="Email address"
                                            type="email"
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
                        disabled={isSubmitting || !isValid}
                        type="submit"
                        className="w-full"
                    >
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
