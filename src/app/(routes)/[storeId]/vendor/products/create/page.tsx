'use client'

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormField,
    FormMessage,
    FormDescription,

} from '@/components/ui/form'
import { LayoutComponent } from "@/components/layout-component";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(1,
        { message: "Minimum length  required is 1" }),
})

const CreateProduct = () => {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log({values: values})
        try {
            const response = await axios.post(`/api/${params.storeId}/products`, values);

            router.push(`/${params.storeId}/vendor/products/${response.data.id}`);
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: error.response?.data.error
                })
            } else {
                toast({
                    title: 'Something went wrong!'
                })
            }
        }
    }

    return (
        <LayoutComponent>
            <div className="max-w-5xl mx-auto flex  h-full p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Name you new product</h1>
                    <p className="text-sm">
                        What would you like to name your product? Don&apos;t worry, you
                        can change this later.
                    </p>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 mt-8"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product title</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g Macbook Pro M2 chip"
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            What will you teach in this course?
                                        </FormDescription>  <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Link href={`/${params.storeId}/vendor/products`}>
                                    <Button
                                        variant={'ghost'}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    variant={'default'}
                                >
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </LayoutComponent>
    )
}

export default CreateProduct
