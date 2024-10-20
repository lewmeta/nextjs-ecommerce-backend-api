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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Color Images</CardTitle>
                <CardDescription>
                    Manage from this category the color of the image of this variant of product.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isEditing && (
                    (initialData !== null && (
                        <>
                            <div className="w-20 h-20 mt-10 rounded-full p-1"
                                style={{ borderWidth: '2px', borderColor: initialData.color }}
                            >
                                <Image
                                    src={initialData.imageUrl}
                                    width='90'
                                    height='90'
                                    alt="color image"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
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
                                <Button disabled={isSubmitting} type="submit">
                                    Save
                                </Button>
                                <Button disabled={isSubmitting} onClick={toggleEdit} type="button" variant='ghost'>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter>
                {!isEditing && (
                    <Button variant={'ghost'} onClick={toggleEdit} className="flex items-center gap-2">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}