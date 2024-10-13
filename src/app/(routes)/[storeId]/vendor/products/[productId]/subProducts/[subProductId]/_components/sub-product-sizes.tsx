'use client';

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Pencil, Trash } from "lucide-react";
import { Size } from "@prisma/client";
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
import { Input } from "@/components/ui/input";

interface SubProductSizesProps {
    initialData: {
        sizes: Size[];
    };
    storeId: string;
    productId: string;
    subProductId: string;
}

const sizeSchema = z.object({
    size: z.string().optional(),
    qty:  z.coerce.number().min(0),  // Ensure quantity is a non-negative number
    price: z.coerce.number().min(0),
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
        resolver: zodResolver(z.object({ sizes: z.array(sizeSchema) })),
        defaultValues: {
            sizes: initialData.sizes.map((size) => ({
                size: size.size || '',
                qty: Number(size.qty),  // Ensure this is a number
                price: Number(size.price), // Ensure this is a number
            })),
        },
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "sizes",
    });

    const onSubmit = async (values: FormValues) => {
        // Parse qty and price to ensure they are numbers
        const parsedValues = {
            sizes: values.sizes.map(size => ({
                size: size.size,
                qty: Number(size.qty), // Convert qty to a number
                price: Number(size.price) // Convert price to a number
            })),
        };

        console.log(parsedValues.sizes); // Debugging the parsed values
        console.log(values.sizes)
        try {
            await axios.patch(`/api/${storeId}/products/${productId}/subProducts/${subProductId}`, parsedValues);
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
                            Size: {s.size}, Qty: {s.qty}, Price: {s.price}
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
                                    name={`sizes.${index}.size`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Size</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="border rounded-md p-2"
                                                    placeholder="Size"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`sizes.${index}.qty`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    placeholder="Quantity"
                                                    className="border rounded-md p-2"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`sizes.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <input 
                                                type="number"
                                                    {...field}
                                                    className="border rounded-md p-2" 
                                                    placeholder="Price"
                                                />
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
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
