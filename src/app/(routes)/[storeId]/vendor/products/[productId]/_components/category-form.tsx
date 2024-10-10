"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Router } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { useToast } from "@/hooks/use-toast";

interface CategoryFormProps {
    initialData: Product;
    productId: string;
    storeId: string;
    options: {
        label: string;
        value: string;
    }[];
}

const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm = ({
    initialData,
    productId,
    storeId,
    options
}: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter()
    const { toast } = useToast();

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ''
        },
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            axios.patch(`/api/${storeId}/products/${productId}`, values)
            toggleEdit();
            toast({
                title: "Category updated."
            });
            router.refresh();

        } catch (error) {
            toast({
                title: 'Something went wrong!'
            })
        }
    }

    const selectOption = options.find(option => option.value === initialData.categoryId);


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                Product Category
                <Button
                    onClick={toggleEdit}
                    variant={'ghost'}
                >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    'text-sm mt-2',
                    !initialData.categoryId && 'text-slate-800 italic'
                )}>
                    {selectOption?.label || "No category"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
                                            disabled={isSubmitting}
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
