'use client'

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface DescriptionFormProps {
    initialData: Product;
    productId: string;
    storeId: string;
}

const formSchema = z.object({
    description: z.string().min(10, {
        message: 'Minimum length is ten',
    }),

});

const DescriptionForm = ({
    initialData,
    productId,
    storeId

}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const {toast} = useToast();

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ''
        },
    });

    const { isSubmitting, isLoading } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/${storeId}/products/${productId}`, values);
            toast({
                title: 'Description updated.'
            });
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast({
                title: 'Something went wrong!'
            })
        }
     }

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Product description
                <Button
                    onClick={toggleEdit}
                    variant={'ghost'}
                >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData?.description}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4 "
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder="product description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isSubmitting}
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

export default DescriptionForm
