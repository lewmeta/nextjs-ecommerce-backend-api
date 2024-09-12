import *as z from "zod"
// import { UserRole } from "@prisma/client"

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string()
        .min(6, {
            message: "Minimum 6 characters required",
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/\d/, {
            message: "Password must contain at least one number",
        })
        .regex(/[\W_]/, {
            message: "Password must contain at least one special character",
        }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string()
        .min(6, {
            message: "Minimum 6 characters required",
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/\d/, {
            message: "Password must contain at least one number",
        })
        .regex(/[\W_]/, {
            message: "Password must contain at least one special character",
        }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
    code: z.optional(z.string()),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});
