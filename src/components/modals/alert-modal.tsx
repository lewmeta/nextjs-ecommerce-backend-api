'use client'

import { useEffect, useState } from "react";
import { DialogModal } from "./dialog-modal";
import { Button } from "../ui/button";

interface AlertModalProps {
    isOPen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOPen,
    loading,
    onClose,
    onConfirm
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null
    }

    return (
        <DialogModal
            title="Are you sure?"
            description="This action cannot be undone"
            isOpen={isOPen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                    disabled={loading}
                    variant='outline'
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    disabled={loading}
                    variant="destructive"
                    onClick={onConfirm}>
                    Continue
                </Button>
            </div>
        </DialogModal>
    )
}