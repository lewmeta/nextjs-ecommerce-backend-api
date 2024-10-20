'use client';

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Pencil, PlusCircle, Trash, Wand } from "lucide-react";
import { Color, Product, Size } from "@prisma/client";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { generateSubProductSKU } from "@/lib/generate-sku";

interface SubProductSizesProps {
    initialData: {
        sizes: Size[];
        product: Product;
        color: Color | null;
    };
    storeId: string;
    productId: string;
    subProductId: string;
}

const sizeSchema = z.object({
    size: z.string().optional(),
    qty: z.coerce.number().min(0),  // Ensure quantity is a non-negative number
    price: z.coerce.number().min(0),
    sku: z.string({ required_error: 'SKU is required to identify this varaint' }).min(1, { message: 'Generate an SKU before submitting.' }),
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
                sku: size.sku || '',
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

    const handleGenerateSKU = (index: number) => {
        const generateSKU = generateSubProductSKU(initialData.product.name, initialData.color?.color!)
        form.setValue(`sizes.${index}.sku`, generateSKU);
    }

    return (
        <>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Stock</CardTitle>
                    <CardDescription>
                        Manage your stock sizes and prices.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Size</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isEditing && (
                                (initialData ? (
                                    <>
                                        {initialData.sizes.map((s, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-semibold">
                                                    {s.sku}
                                                </TableCell>
                                                <TableCell>
                                                    {s.qty}
                                                </TableCell>
                                                <TableCell>
                                                    {s.price}
                                                </TableCell>
                                                <TableCell className="uppercase">
                                                    {s.size == null && 'Product has no size'}
                                                    {s.size !== null && s.size}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        No data found.
                                    </>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <Table>
                                    <TableBody>
                                        {fields.map((item, index) => (
                                            <TableRow key={item.id}>
                                                {/* SKU Field */}
                                                <TableCell className="font-semibold w-[120px]">
                                                    <FormField
                                                        control={control}
                                                        name={`sizes.${index}.sku`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input {...field} readOnly />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>

                                                {/* Stock Field */}
                                                <TableCell>
                                                    <FormField
                                                        control={control}
                                                        name={`sizes.${index}.qty`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label htmlFor={`stock-${index}`} className="sr-only">Stock</Label>
                                                                <Input type="number" {...field} id={`stock-${index}`} />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>

                                                {/* Price Field */}
                                                <TableCell>
                                                    <FormField
                                                        control={control}
                                                        name={`sizes.${index}.price`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label htmlFor={`price-${index}`} className="sr-only">Price</Label>
                                                                <Input type="number" {...field} id={`price-${index}`} />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>

                                                {/* Size Field */}
                                                <TableCell>
                                                    <FormField
                                                        control={control}
                                                        name={`sizes.${index}.size`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <ToggleGroup
                                                                    type="single"
                                                                    value={field.value}
                                                                    onValueChange={field.onChange}
                                                                    variant="outline"
                                                                >
                                                                    <ToggleGroupItem value="s">S</ToggleGroupItem>
                                                                    <ToggleGroupItem value="m">M</ToggleGroupItem>
                                                                    <ToggleGroupItem value="l">L</ToggleGroupItem>
                                                                </ToggleGroup>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="flex items-center gap-x-2">
                                                    <Button type="button" onClick={() => handleGenerateSKU(index)}>
                                                        <Wand className="h-4 w-4 mr-1" />
                                                        Generate SKU
                                                    </Button>
                                                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                                        <Trash />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </form>
                        </Form>
                    )}
                    {isEditing && (
                        <div className="w-full flex items-center justify-center mt-8">
                            <Button type="button" variant={'ghost'} onClick={() => append({ size: '', qty: 1, price: 0, sku: '' })}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                Add Variant
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="justify-center border-t p-4">
                    {isEditing ? (
                        <div className="flex gap-x-2 items-center">
                            <Button type="submit" onClick={handleSubmit(onSubmit)}>Save</Button>
                            <Button type="button" variant='ghost' onClick={toggleEdit}>Cancel</Button>
                        </div>
                    ) : (
                        <Button onClick={toggleEdit} variant="ghost">
                            <Pencil className="h-4 w-4 mr-2" /> Edit Sizes
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </>
    );
};
