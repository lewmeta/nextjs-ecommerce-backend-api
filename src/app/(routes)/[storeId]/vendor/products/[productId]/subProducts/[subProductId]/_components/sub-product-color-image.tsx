'use client';

import * as z from "zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash } from "lucide-react";
import { Size } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { FileUpload } from "@/components/upload/file-upload";

interface SubProductColorImage {
    initialData: Color;
    storeId: string;
    productId: string;
    subProductId: string;
}

const formSchema = z.object({
    color: z.string().min(1, { message: 'Please provide a hex value for color' }),
    imageUrl: z.string().min(1, { message: 'Please provide an image' }),
});

export const SubProductColorImage = ({
    initialData,
    productId,
    storeId,
    subProductId
}: SubProductColorImage) => {
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const toggleEdit = () => setIsEditing((prev) => !prev);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            color: initialData?.color || '',
            imageUrl: initialData?.imageUrl || '',
        }
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/${storeId}/products/${productId}/subProducts/${subProductId}`, values);
            toast({ title: "Sub Product Sizes updated" });
            toggleEdit();
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: error.response?.data.message
                })
            } else {
                toast({
                    title: 'Something went wrong!'
                })
            }
        }
    }

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                Color Image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : <><Pencil className="h-4 w-4 mr-2" /> Edit Color Image</>}
                </Button>
            </div>
            {!isEditing && (
                (initialData !== null && (
                    <>
                        <span>{initialData.color}</span>
                        <Image
                            src={initialData.imageUrl}
                            width={60}
                            height={60}
                            alt="image color"
                        />
                    </>
                ))
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name={`color`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="border rounded-md p-2"
                                            placeholder="eg. #00000"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`imageUrl`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="colorImage"
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={isSubmitting || !isValid}>Save</Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}