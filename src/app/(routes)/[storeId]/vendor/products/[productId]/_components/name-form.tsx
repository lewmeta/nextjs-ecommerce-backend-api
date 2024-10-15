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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TitleFormProps {
    initialData: {
        name: string;
    },
    productId: string;
    storeId: string;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Name is required',
    }),

});

const ProductNameForm = ({
    initialData,
    storeId,
    productId

}: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const { toast } = useToast()

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const { isSubmitting, isLoading } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/${storeId}/products/${productId}`, values);
            toggleEdit();
            router.refresh();
            toast({
                title: "Title updated."
            })
        } catch (error) {
            toast({
                title: "Something went wrong!"
            })
        }
    }

    return (
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Product title
                </CardTitle>
                <CardDescription>
                    You can update this product title by toggling the pencil icon
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isEditing && (
                    <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors ring-1">
                        {initialData?.name}
                    </div>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4 "
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="e.g 'Advanced web development'"
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
            </CardContent>
            <CardFooter>
                <div className="font-medium flex items-center justify-between">
                    <Button
                        onClick={toggleEdit}
                        variant={'ghost'}
                        className="bg-muted"
                    >
                        {isEditing ? (
                            <>Cancel</>
                        ) : (
                            <>
                                Edit title
                                <Pencil className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default ProductNameForm
