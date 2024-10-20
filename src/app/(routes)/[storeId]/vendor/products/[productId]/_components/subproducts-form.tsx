'use client'

import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, RefreshCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Product, Size, SubProduct } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SubProductList } from "./subproducts-list";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSKU } from "@/lib/generate-sku";

interface SubProductFormProps {
    initialData: Product & { subProducts: SubProduct[] };
    productId: string;
    storeId: string;
};

const formSchema = z.object({
    sku: z.string().min(1, { message: 'Minimum length required is one.' })
})

export const SubproductForm = ({
    initialData,
    productId,
    storeId,
}: SubProductFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();

    const { toast } = useToast();

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sku: ''
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/${storeId}/products/${productId}/subProducts`, values);
            toast({
                title: `Product variant ${values.sku} created`
            });
            toggleCreating();
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: error.response?.data.message || 'An Error occured.',
                });

            } else {
                toast({
                    title: "Something went wrong"
                });
            }
        }
    }

    const onEdit = (id: string) => {
        router.push(`/${storeId}/vendor/products/${productId}/subProducts/${id}`);
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/${storeId}/products/${productId}/subProducts/reorder`, {
                list: updateData
            });
            toast({
                title: 'Subproducts reordered.'
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Something went wrong!"
            });
        } finally {
            setIsUpdating(false)
        }
    }

    const onSKUGenerate = () => {
        const newSKU = generateSKU(initialData.name)
        form.setValue("sku", newSKU);
    }

    return (
        <Card className="relative mt-5">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <CardHeader>
                <CardTitle>Sub Products</CardTitle>
                <CardDescription>This manage everything to do with this sub product variant</CardDescription>
            </CardHeader>

            <CardContent className="mb-0">
                {!isCreating && (
                    <div className={cn(
                        'text-sm ',
                        !initialData?.subProducts.length && 'text-slate-500 italic'
                    )}>
                        {!initialData?.subProducts.length && 'No SuProducts'}
                        <SubProductList
                            onEdit={onEdit}
                            onReorder={onReorder}
                            items={initialData.subProducts || []}
                        />
                    </div>
                )}
                {isCreating && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Generate an sku for this variant"
                                                {...field}
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-x-3">
                                <Button
                                    type="button"
                                    onClick={onSKUGenerate}
                                    variant="outline"
                                    className="flex items-center gap-x-2 mt-2"
                                    disabled={isSubmitting}
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Regenerate SKU
                                </Button>
                                <Button
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                    className="mt-2"
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={toggleCreating}
                    variant={'ghost'}
                    className="!mt-0"
                >
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a product variant
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
