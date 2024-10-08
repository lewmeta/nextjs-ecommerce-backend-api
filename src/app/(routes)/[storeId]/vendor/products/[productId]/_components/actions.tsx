'use client'

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionProps {
    disabled: boolean;
    productId: string;
    isPublished: boolean;
}

export const Actions = ({
    disabled,
    productId,
    isPublished
}: ActionProps) => {
    const router = useRouter();
    // TODO: add confetti hook
    const [isLoading, setIsLoading] = useState(false);

    const onClick = () => { };

    const onDelete = () => { };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={isLoading || disabled}
                variant={'outline'}
                size={'sm'}
            >
                {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={onDelete} >
                <Button size={'sm'} disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}
