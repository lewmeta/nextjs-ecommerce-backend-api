'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Upload } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Color, Image as Images } from "@prisma/client";
import Image from "next/image";
import { MultiFileUpload } from "@/components/upload/multi-file-upload";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


interface SubProductImagesProps {
    initialData: {
        images: Images[];
        color: Color | null;
    };
    storeId: string;
    productId: string;
    subProductId: string;
};

const formSchema = z.object({
    images: z.array(z.string().url())
        .min(3, "At least 3 images are required")
        .max(6, "A maximum of 6 images is allowed")
    // .nonempty("At least one image is required"),
});

export const SubProductImages = ({
    initialData,
    storeId,
    productId,
    subProductId
}: SubProductImagesProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();
    const { toast } = useToast()

    const toggleEdit = () => setIsEditing((prev) => !prev);
    const initialImageUrls = initialData?.images?.map(img => img.url) || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: [],
        }
    });

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/${storeId}/products/${productId}/subProducts/${subProductId}`, values);

            toast({
                title: "Sub Product Images updated"
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

    console.log({ color: initialData.color?.color })
    return (
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                    Manage all of your product images from this section, like creating, updating and deleting
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isEditing && (
                    <div className="flex items-center w-full gap-3">
                        <div className="grid gap-2 w-full">
                            <div className="flex items-center gap-3 w-full h-full"
                            >
                                {initialData.images.slice(0, 2).map((image, index) => (
                                    <div className="w-full h-[400px]  relative">
                                        <Image
                                            key={index}
                                            alt={`Product image ${index + 1}`}
                                            src={image.url}
                                            className="aspect-square w-full h-full rounded-md object-cover"
                                            fill
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-start gap-3">
                                {initialData?.images.slice(2, 7).map((image, index) => (
                                    <button key={index} className="relative w-[140px] h-[140px]"
                                    >
                                        <Image
                                            alt={`Product image ${index + 1}`}
                                            className="aspect-square w-full h-full rounded-md object-center object-cover"
                                            src={image.url}
                                            fill
                                        />
                                    </button>
                                ))}
                            </div>
                            <div>
                                {initialData?.color && (
                                    <div className="w-20 h-20 mt-10 rounded-full p-1"
                                        style={{ borderWidth: '2px', borderColor: initialData.color?.color }}
                                    >
                                        <Image
                                            src={initialData.color.imageUrl}
                                            width='140'
                                            height='140'
                                            alt="color image"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4 dark:text-gray-300"
                        >
                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-start">
                                        <FormControl>
                                            <MultiFileUpload
                                                endpoint="subProductImage"
                                                onChange={(urls) => field.onChange(urls)}
                                                // value={field.value}
                                                value={field.value?.length ? field.value : initialImageUrls}
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
                <div className="font-medium flex items-center justify-between">
                    {!isEditing && (
                        <Button variant={'ghost'} onClick={toggleEdit} className="flex items-center gap-2">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Images
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}