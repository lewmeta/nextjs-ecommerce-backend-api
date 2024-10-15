'use client'

import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SubProductActionsProps {
    disabled: boolean;
    storeId: string;
    productId: string;
    subProductId: string
    isPublished: boolean;
}

const SubproductActions = ({
    disabled,
    isPublished,
    productId,
    storeId,
    subProductId
}: SubProductActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();


    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/`)

            if (isPublished) {
                await axios.patch(`/api/${storeId}/products/${productId}/subProducts/${subProductId}/unpublish`)
                toast({
                    title: 'Subproduct upublished!'
                })
            } else {
                await axios.patch(`/api/${storeId}/products/${productId}/subProducts/${subProductId}/publish`)
                toast({
                    title: 'Subproduct published!'
                })
            }
            router.refresh();
            return

        } catch (error) {
            toast({
                title: 'Something went wrong!'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/${storeId}/products/${productId}/subProducts/${subProductId}`)
            toast({
                title: 'Subproduct deleted!'
            })

            router.push(`/${storeId}/vendor/products/${productId}`)
        } catch (error) {
            toast({
                title: 'Something went wrong!'
            })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={isLoading || disabled}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default SubproductActions
