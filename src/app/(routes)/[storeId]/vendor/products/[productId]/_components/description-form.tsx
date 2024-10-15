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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    const { toast } = useToast();

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
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Product Description
                </CardTitle>
                <CardDescription>
                    Edit this product description by toggling the edit icon below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isEditing && (
                    <div className="flex items-center min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors ring-1">
                        {initialData?.description}
                    </div>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
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
                            <div className="flex items-center mt-3 gap-x-2">
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
            </CardContent>
            <CardFooter>
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
                            Edit description
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default DescriptionForm
