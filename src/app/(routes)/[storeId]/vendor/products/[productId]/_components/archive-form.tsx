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

interface ArchiveFormProps {
    initialData: {
        isArchived: boolean;
    },
    productId: string;
    storeId: string;
}

const formSchema = z.object({
    isArchived: z.boolean().optional(),
});

export const ArchiveForm = ({
    initialData,
    storeId,
    productId

}: ArchiveFormProps) => {
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
                title: "Archive status updated."
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
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Archive status
                </CardTitle>
                <CardDescription>
                    When this product is archived, it will not appear in the live products.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isEditing && (
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
                )}
                {isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4 "
                        >
                            <FormField
                                control={form.control}
                                name="isArchived"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                // @ts-ignore
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Archived
                                            </FormLabel>
                                            <FormDescription>
                                                This product will not appear anywhere in the store.
                                            </FormDescription>
                                        </div>
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
                                Edit Archive Status
                                <Pencil className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
