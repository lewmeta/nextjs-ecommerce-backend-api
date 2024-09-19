"use client"

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { DialogModal } from "./dialog-modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";
import { StoreSchema } from "@/schemas";
import { useToast } from "@/hooks/use-toast";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useCurrentUser } from "@/hooks/use-current-user";

export const StoreModal = () => {
    const storeModal = useStoreModal();
    const router = useRouter();
    const { toast } = useToast();
    const userRole = useCurrentRole();
    const user = useCurrentUser();


    const form = useForm<z.infer<typeof StoreSchema>>({
        resolver: zodResolver(StoreSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof StoreSchema>) => {
        console.log(values);
        try {
            isSubmitting
            const res = await axios.post("/api/stores", values);

            toast({
                title: res.data.success || "Store created!"
            })

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: error.name,
                    description: "This can be solved by fixing the problem"
                })
            } else {
                toast({
                    title: "Something went wrong!",
                    description: "This can be fixed by do this and that"
                })
            }
        }
    }

    return (
        <DialogModal
            title="Create your store"
            description="Add a new store to manage products and categories."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="Store name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                    <Button
                                        disabled={isSubmitting}
                                        variant="outline"
                                        onClick={storeModal.onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button disabled={isSubmitting} type="submit">Continue</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </DialogModal>
    )
}