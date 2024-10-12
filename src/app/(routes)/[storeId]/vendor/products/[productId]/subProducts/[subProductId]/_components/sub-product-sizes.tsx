
'use client'

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Pencil, Trash } from "lucide-react";
import { Size, SubProduct } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type SizeField = Omit<Size, 'id' | 'subProductId'>;

interface SubProductSizesProps {
    initialData: {
        sizes: Size[];
    },
    storeId: string;
    productId: string;
    subProductId: string;
}

const sizeSchema = z.object({
    size: z.string().optional(),
    qty: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, 'Price must be at least 0'),
});

type FormValues = {
    sizes: Array<z.infer<typeof sizeSchema>>;
};

export const SubProductSizes = ({
    initialData,
    productId,
    storeId,
    subProductId,
}: SubProductSizesProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const toggleEdit = () => setIsEditing((prev) => !prev);

    const form = useForm<FormValues>({
        resolver: zodResolver(z.array(sizeSchema)),
        defaultValues: {
            sizes: initialData.sizes.map(size => ({
                size: size.size || '',
                qty: size.qty,
                price: size.price,
            })) || [{ size: '', qty: 1, price: 0 }],
        },
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "sizes",
    });

    const onSubmit = async (values: FormValues) => {
        console.log({ values });
        try {
            await axios.patch(`/api/${storeId}/products/${productId}/subProducts/${subProductId}`, values);
            toast({ title: "Sub Product Sizes updated" });
            toggleEdit();
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({ title: error.response?.data.message });
            } else {
                toast({ title: "Something went wrong!" });
            }
        }
    };

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                SubProduct Sizes
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : <><Pencil className="h-4 w-4 mr-2" /> Edit Sizes</>}
                </Button>
            </div>
            {!isEditing && (
                <div className="flex items-center gap-3">
                    {initialData.sizes.map((s) => (
                        <div key={s.id} className="relative h-[150px] w-[200px] rounded-sm overflow-hidden flex items-center gap-2">
                            Size: {s.size}, Quantity: {s.qty}, Price: {s.price}
                        </div>
                    ))}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 dark:text-gray-300">
                        {fields.map((item, index) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <FormField
                                    control={control}
                                    name={`sizes.${index}.size`} // Dynamic naming
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Size</FormLabel>
                                            <FormControl>
                                                <input {...field} className="border rounded-md p-2" placeholder="Size" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`sizes.${index}.qty`} // Dynamic naming
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <input type="number" {...field} className="border rounded-md p-2" placeholder="Quantity" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`sizes.${index}.price`} // Dynamic naming
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <input type="number" {...field} className="border rounded-md p-2" placeholder="Price" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                    <Trash />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => append({ size: '', qty: 1, price: 0 })}>
                            Add Size
                        </Button>
                        <div className="flex items-center gap-x-2">
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
