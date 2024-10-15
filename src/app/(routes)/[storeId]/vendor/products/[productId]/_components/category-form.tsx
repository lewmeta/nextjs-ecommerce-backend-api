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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Add Product Category
                </CardTitle>
                <CardDescription>
                    Add a product category from the dropdown menu option.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isEditing && (
                    <div className={cn("flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors", !initialData.categoryId && 'italic')}>
                        {selectOption?.label || "No category"}
                    </div>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
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
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className="mt-3"
                            >
                                Save
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter>
                <div className="font-medium flex items-center justify-between">
                    <Button
                        onClick={toggleEdit}
                        variant={'ghost'}
                        className="text-primary bg-muted"
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
            </CardFooter>
        </Card>
    )
}
