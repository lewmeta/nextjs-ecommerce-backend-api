'use client'

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Trash } from "lucide-react"
import { Billboard } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/navigation/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { BillboardSchema } from "@/schemas"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/upload/file-upload"

type BillboardFormValues = z.infer<typeof BillboardSchema>

interface BillboardFormProps {
    initialData: Billboard | null
}

export const BillboardForm = ({
    initialData
}: BillboardFormProps) => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit billboard' : ' Create billboard'
    const description = initialData ? 'Edit a billboard' : 'Add a billboard';
    const toastMessage = initialData ? 'Billboard updated' : 'Billboard created'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(BillboardSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
            description: '',
        },
    });

    const onSubmit = async (values: BillboardFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, values)
            }

            router.refresh();
            router.push(`/${params.storeId}/vendor/billboards`);
            toast({
                title: toastMessage,
                description: toastMessage,
            })

        } catch (error) {
            toast({
                title: 'Something went wrong!',
                description: "Contact the system admin for assistance."
            })
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/vendor/billboards`)
            toast({
                title: 'Billboard deleted.',
                description: 'You have deleted this billboard.'
            })
        } catch (error) {
            toast({
                title: 'Make sure you removed all categories using this billboard first.',
                description: "Make sure you removed all categories using this billboard first.."
            })
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }
    return (
        <>
            <AlertModal
                isOPen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        endpoint="billboardImage"
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Billboard label"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Billboard description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}