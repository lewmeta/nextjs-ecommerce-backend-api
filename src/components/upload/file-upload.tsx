"use client"

import { ourFileRouter } from "@/app/api/uploadthing/core"
import { useToast } from "@/hooks/use-toast";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing"
import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface FileUploadProps {
    // onChange: (url?: string, originalFilename?: string) => void;
    onChange: (url?: string, originalFilename?: string) => void;
    endpoint: keyof typeof ourFileRouter,
    value?: string
};

export const FileUpload = ({
    onChange,
    endpoint,
    value
}: FileUploadProps) => {
    const { toast } = useToast();

    const type = value?.split('.').pop()

    if (value) {
        return (
            <div className="flex flex-col justify-center items-center">
                {type !== "pdf" && (
                    <div className="relative w-40 h-40">
                        <Image
                            src={`${value}`}
                            alt="uploaded image"
                            className="object-contain"
                            fill
                        />
                    </div>
                )}
                <Button
                    onClick={() => onChange('')}
                    variant={'ghost'}
                    type="button"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )
    }
    return (
        <UploadButton
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                // console.log("onClientUploadComplete res:", res),
                onChange(res?.[0].url, res?.[0].name)
            }}
            onUploadError={(error: Error) => {
                toast({
                    title: error?.message
                })
            }}
        />
    )
}