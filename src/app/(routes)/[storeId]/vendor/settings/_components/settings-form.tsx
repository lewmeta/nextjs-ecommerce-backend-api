'use client'

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Trash } from "lucide-react"
import { Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

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

import { Heading } from "@/components/navigation/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Separator } from "@/components/ui/separator"
import { StoreSchema } from "@/schemas"
import { ApiAlert } from "@/components/alert/api-alert"
import { useOrigin } from "@/hooks/use-origin"

interface SettingsFormProps {
    initialData: Store
}
const SettingsForm = ({
    initialData
}: SettingsFormProps) => {
    const { toast } = useToast()

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const origin = useOrigin();

    const form = useForm<z.infer<typeof StoreSchema>>({
        resolver: zodResolver(StoreSchema),
        defaultValues: initialData,
    })

    const onSubmit = async (values: z.infer<typeof StoreSchema>) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, values);
            toast({
                title: 'Store updated',
                description: 'You have successfully updated your store.'
            })
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Contact the system administrator for further asistance."
            });
        } finally {
            setLoading(false);
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push('/');
            toast({
                title: 'Store deleted.',
                description: 'Store deleted.'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: 'Make sure you removed all products and categories first.',
                    description: 'Make sure you removed all products and categories first.'
                });
            } else {
                toast({
                    title: 'Something went wrong.',
                    description: 'Loos like something went wrong.'
                });
            }
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
    return (
        <>
            <AlertModal
                isOPen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />
            <Heading title="Store settings" description="Manage store preferences" />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full px-4 mt-8"
                >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading} placeholder="Store name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>
                </form>
            </Form>

            {/* <Separator /> */}
            <div className="px-4 mt-8">
                <ApiAlert
                    title="NEXT_PUBLIC_API_URL"
                    variant="public"
                    description={`${origin}/api/stores/${params.storeId}`}
                />

                <Separator />

                <div className="flex items-center flex-col justify-between ">
                    Danger zode

                    <div className="border-destructive border rounded-md">
                        <Button
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsForm
