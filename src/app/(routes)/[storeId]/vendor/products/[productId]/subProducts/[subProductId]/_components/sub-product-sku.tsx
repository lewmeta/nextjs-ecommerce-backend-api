'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, PlusCircle } from "lucide-react";

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SubProductSkuProps {
    initialData: {
        sku: string;
    };
    storeId: string;
    productId: string;
    subProductId: string;
};

const formSchema = z.object({
    sku: z.string().min(1, {
        message: "SKU is required!"
    }),
});

const SubProductKsu = ({
    initialData,
    storeId,
    productId,
    subProductId
}: SubProductSkuProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();
    const { toast } = useToast()

    const toggleEdit = () => setIsEditing((prev) => !prev);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
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
        <div className="mt-6 bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                Sub Product SKU.
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit SKU
                        </>
                    )}
                </Button>
            </div>
            {/* {!isEditing && (
                <p className="text-sm mt-2 dark:text-gray-300">
                    {initialData?.sku}
                </p>
            )} */}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4 dark:text-gray-300"
                    >
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. Sub Product SKU"
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
                        </div>
                    </form>
                </Form>
            )}
            <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                    <CardTitle>Stock</CardTitle>
                    <CardDescription>
                        Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">SKU</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="w-[100px]">Size</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    GGPC-001
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor="stock-1" className="sr-only">
                                        Stock
                                    </Label>
                                    <Input
                                        id="stock-1"
                                        type="number"
                                        defaultValue="100"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor="price-1" className="sr-only">
                                        Price
                                    </Label>
                                    <Input
                                        id="price-1"
                                        type="number"
                                        defaultValue="99.99"
                                    />
                                </TableCell>
                                <TableCell>
                                    <ToggleGroup
                                        type="single"
                                        defaultValue="s"
                                        variant="outline"
                                    >
                                        <ToggleGroupItem value="s">S</ToggleGroupItem>
                                        <ToggleGroupItem value="m">M</ToggleGroupItem>
                                        <ToggleGroupItem value="l">L</ToggleGroupItem>
                                    </ToggleGroup>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    GGPC-002
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor="stock-2" className="sr-only">
                                        Stock
                                    </Label>
                                    <Input
                                        id="stock-2"
                                        type="number"
                                        defaultValue="143"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor="price-2" className="sr-only">
                                        Price
                                    </Label>
                                    <Input
                                        id="price-2"
                                        type="number"
                                        defaultValue="99.99"
                                    />
                                </TableCell>
                                <TableCell>
                                    <ToggleGroup
                                        type="single"
                                        defaultValue="m"
                                        variant="outline"
                                    >
                                        <ToggleGroupItem value="s">S</ToggleGroupItem>
                                        <ToggleGroupItem value="m">M</ToggleGroupItem>
                                        <ToggleGroupItem value="l">L</ToggleGroupItem>
                                    </ToggleGroup>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    GGPC-003
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor="stock-3" className="sr-only">
                                        Stock
                                    </Label>
                                    <Input
                                        id="stock-3"
                                        type="number"
                                        defaultValue="32"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor="price-3" className="sr-only">
                                        Stock
                                    </Label>
                                    <Input
                                        id="price-3"
                                        type="number"
                                        defaultValue="99.99"
                                    />
                                </TableCell>
                                <TableCell>
                                    <ToggleGroup
                                        type="single"
                                        defaultValue="s"
                                        variant="outline"
                                    >
                                        <ToggleGroupItem value="s">S</ToggleGroupItem>
                                        <ToggleGroupItem value="m">M</ToggleGroupItem>
                                        <ToggleGroupItem value="l">L</ToggleGroupItem>
                                    </ToggleGroup>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                    <Button size="sm" variant="ghost" className="gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add Variant
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SubProductKsu
