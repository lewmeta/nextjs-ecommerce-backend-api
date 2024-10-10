'use client'

import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
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
    const params = useParams();

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
            await axios.post(`/api/${storeId}/products${productId}/subProducts`, values);
            toast({
                title: "Subproduct created"
            });
            toggleCreating();
            router.refresh();
        } catch {
            toast({
                title: "Something went wrong"
            });
        }
    }

    const onEdit = (id: string) => {
        router.push(`/${storeId}/vendor/products/${productId}/subProducts/${id}`);
    }

    const onReoder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/${storeId}/products/${productId}/subProducts/redorder`, {
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

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}

            <div className="font-medium flex items-center justify-between">
                Subproducts
                <Button
                    onClick={toggleCreating}
                    variant={'ghost'}
                >
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a subproduct
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Add SubProduct sku"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    'text-sm mt-2',
                    !initialData?.subProducts.length && 'text-slate-500 italic'
                )}>
                    {!initialData?.subProducts.length && 'No SuProducts'}
                    <SubProductList
                        onEdit={onEdit}
                        onReoder={onReoder}
                        items={initialData.subProducts || []}
                    />
                </div>
            )}
        </div>
    )
}
