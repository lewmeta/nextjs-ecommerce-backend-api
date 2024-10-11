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
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Image as Images } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/upload/file-upload";
import{ MultiFileUpload} from "@/components/upload/multi-file-upload";


interface SubProductImagesProps {
    initialData: {
        images: Images[];
    } | null;
    storeId: string;
    productId: string;
    subProductId: string;
};

const formSchema = z.object({
    images: z.object({ url: z.string() }).array(),
});


const SubProductImages = ({
    initialData,
    storeId,
    productId,
    subProductId
}: SubProductImagesProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();
    const { toast } = useToast()

    const toggleEdit = () => setIsEditing((prev) => !prev);


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
                SubProduct Images
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit SKU
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData?.images.map((image) => (
                        <div key={image.id} className="relative">
                            <Image
                                src={image.url}
                                width={200}
                                height={200}
                                objectFit="cover"
                                alt={image.id}
                            />
                        </div>
                    ))}
                </>
            )}
            {/* {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4 dark:text-gray-300"
                    >
                        <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem className=" flex flex-col items-start">
                                <FormControl>
                                    <FileUpload
                                        endpoint="subProductImage"
                                        onChange={(urls) => field.onChange(urls)}
                                        value={field.value.map((image) => image.url) }
                                        allowMultiple
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
            )} */}

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
                                            value={field.value as any}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default SubProductImages
