'use client'

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";

interface ProductDetailsProps {
    name: string;
    slug: string;
    description?: string;
    productId: string;
    storeId: string;
}

const formSchema = z.object({
    name: z.string(
        {
            required_error: "Please provide a product name.",
        }
    ).min(1, {
        message: 'Product name is required.',
    }),
    slug: z.string().min(1, { message: 'slug is required for this product' }),
    description: z.string(
        {
            required_error: "Please provide a product description.",
        }
    ).min(1, {
        message: 'Product description is required.',
    }),

});

export const ProductDetailsForm = ({
    name,
    slug,
    description,
    storeId,
    productId

}: ProductDetailsProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const { toast } = useToast()

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name ? name : "",
            description: description ? description : ""
        }
    })

    const { isSubmitting, isLoading } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/${storeId}/products/${productId}`, values);
            toggleEdit();
            toast({
                title: "Product details updated."
            })
            router.refresh();

        } catch (error) {
            toast({
                title: "Something went wrong!"
            })
        }
    }

    const onSlugGenerate = () => {
        const slug = slugify(name)
        form.setValue("slug", slug);
    }

    return (
        <>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                        Provide details of the Product like name and description.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isEditing && (
                        <>
                            <div className="my-2">
                                <Label className="mb-3">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    className="w-full mt-2"
                                    defaultValue={name}
                                    readOnly
                                />
                            </div>
                            <div className="my-2">
                                <Label className="mb-3">Slug</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    className="w-full mt-2"
                                    defaultValue={slug}
                                    readOnly
                                />
                            </div>

                            <div className="my-2">
                                <Label className="mb-2">Description</Label>
                                <Textarea
                                    id="description"
                                    defaultValue={description}
                                    className="min-h-32 mt-2"
                                    readOnly
                                />
                            </div>
                        </>
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
                                            <FormLabel>Name *</FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    placeholder="e.g 'Generate a slug from title'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <Button
                                                type="button"
                                                className="flex items-center gap-x-2 mt-2"
                                                onClick={onSlugGenerate}
                                            >
                                                <RefreshCcw className="h-4 w-4" />
                                                Generate Slug
                                            </Button>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isLoading}
                                                    placeholder="Give a description for your product"
                                                    {...field}
                                                    className="min-h-32"
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
                            className="text-primary bg-muted"
                        >
                            {isEditing ? (
                                <>Cancel</>
                            ) : (
                                <>
                                    Edit Details
                                    <Pencil className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}
