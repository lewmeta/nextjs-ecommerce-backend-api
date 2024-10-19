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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductStatusFormProps {
    initialData: {
        isArchived: boolean;
        isFeatured: boolean;
    },
    productId: string;
    storeId: string;
}

const formSchema = z.object({
    // isArchived: z.boolean().optional(),
    // isFeatured: z.boolean().optional(),
    productStatus: z.enum(["featured", "archived"], {
        required_error: "Please select a status for the product."
    }),

    // productStatus: z.boolean({
    //     required_error: "Please select product status to display.",
    // }),
});

export const ProductStatusForm = ({
    initialData,
    storeId,
    productId

}: ProductStatusFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const { toast } = useToast()

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productStatus: initialData.isArchived ? "archived" : "featured",
        },
    })

    const { isSubmitting, isLoading } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const status = values.productStatus;

        // Map the combined value back to isArchived and isFeatured
        const payload = {
            isArchived: status === "archived",
            isFeatured: status === "featured",
        };

        console.log({ values: payload })
        try {
            await axios.patch(`/api/${storeId}/products/${productId}`, payload);
            toggleEdit();
            router.refresh();
            toast({
                title: "Product status updated."
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: error.response?.data.message || "An error occured!"
                })
            } else {
                toast({
                    title: "Something went wrong!"
                })
            }
        }
    }

    return (
        <>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>
                        Product status
                    </CardTitle>
                    <CardDescription>
                        When this product is archived, it will not appear in the live products.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* {!isEditing && (
                        <div className="flex items-center min-h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors gap-2 cursor-not-allowed">
                            {initialData.isArchived ? (
                                <>
                                    <Checkbox
                                        defaultChecked
                                        disabled
                                    />
                                    Archived
                                </>

                            ) : (
                                <>
                                    <Checkbox
                                        disabled
                                    />
                                    Not archived
                                </>
                            )}
                        </div>
                    )} */}
                    {!isEditing && (
                        <div>
                            {initialData.isArchived
                                ? "Archived"
                                : "Featured"
                            }
                        </div>
                    )}

                    {isEditing && (
                        // <Form {...form}>
                        //     <form onSubmit={form.handleSubmit(onSubmit)}
                        //         className="space-y-4 mt-4 "
                        //     >
                        //         <FormField
                        //             control={form.control}
                        //             name="productStatus"
                        //             render={({ field }) => (
                        //                 <FormItem>
                        //                     <FormLabel>Status</FormLabel>
                        //                     <Select onValueChange={field.onChange}>
                        //                         <FormControl>
                        //                             <SelectTrigger>
                        //                                 <SelectValue placeholder="Select a status for this product" />
                        //                             </SelectTrigger>
                        //                         </FormControl>
                        //                         <SelectContent>
                        //                             <SelectContent>
                        //                                 <SelectItem value="isFeatured">Featured</SelectItem>
                        //                                 <SelectItem value="isArchived">Archived</SelectItem>
                        //                             </SelectContent>
                        //                         </SelectContent>
                        //                     </Select>
                        //                     <FormDescription>
                        //                         You can manage the visibilty of your product.
                        //                     </FormDescription>
                        //                     <FormMessage />
                        //                 </FormItem>
                        //             )}
                        //         />
                        //         <div className="flex items-center gap-x-2">
                        //             <Button
                        //                 disabled={isSubmitting}
                        //                 type="submit"
                        //             >
                        //                 Save
                        //             </Button>
                        //         </div>
                        //     </form>
                        // </Form>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="productStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="normal">Normal</SelectItem>
                                                    <SelectItem value="featured">Featured</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isSubmitting}>Save</Button>
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
                                    Edit Status
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
