'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SubProduct } from "@prisma/client";

interface SubProductDiscountProps {
    initialData: {
        discount: number;
    };
    storeId: string;
    productId: string;
    subProductId: string;
}

const formSchema = z.object({
    discount: z.coerce.number().optional(),
});

export const SubProductDiscount = ({
    initialData,
    productId,
    storeId,
    subProductId
}: SubProductDiscountProps) => {
    
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();
    const { toast } = useToast()

    const toggleEdit = () => setIsEditing((prev) => !prev);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            discount: initialData.discount || 0,
        },
    });

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/${storeId}/products/${productId}/subProducts/${subProductId}`, values);

            toast({
                title: "Sub Product KSU updated"
            });

            toggleEdit();
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: error.response?.data.message
                })
            } else {
                toast({
                    title: "Something went wrong!"
                })
            }
        }
    }

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                SubProduct Discount
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Discount
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2 dark:text-gray-300">
                    {initialData?.discount}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4 dark:text-gray-300"
                    >
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        type="number"
                                            disabled={isSubmitting}
                                            placeholder="e.g. 25"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
