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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Product discount
                </CardTitle>
                <CardDescription>
                    You can control your product discount from this section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isEditing && (
                    <div className="flex items-start flex-col gap-x-2">
                        <Label>Discount</Label>
                        <Input
                            type="number"
                            disabled={isSubmitting}
                            defaultValue={initialData?.discount} 
                            readOnly
                            className="mt-3"                           
                        />
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
                                <Button
                                    type="button"
                                    variant={'ghost'}
                                    onClick={toggleEdit}
                                >
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
                        <Button onClick={toggleEdit} variant="ghost">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Discount
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}
