"use client"

import axios from "axios"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AlertModal } from "@/components/modals/alert-modal";

import { BillboardColumn } from "./columns";
import { useToast } from "@/hooks/use-toast";

interface CellActionProps {
    data: BillboardColumn
}

export const CellAction = ({
    data
}: CellActionProps) => {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast()
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
            toast({
                title: "Billboard deleted!",
                description: "You have successfully deleted this bbillboard."
            })
        } catch (error) {
            toast({
                title: "Make sure you removed all categories using this billboard first.",
                description: "Make sure you removed all categories using this billboard first."
            })
        } finally {
            setOpen(false)
            setLoading(false)
        }
    }

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast({
            title: "Billboard ID copied to clipboard.",
            description: "Billboard ID copied to clipboard."
        });
    };

    return (
        <>
            <AlertModal
                isOPen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger
                    asChild
                >
                    <Button
                        variant={"ghost"}
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">
                            Open menu
                        </span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id.
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(`/${params.storeId}/vendor/billboards/${data.id}`)
                        }
                    >
                        <Edit className="mr-2 h-4 w-4" /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}