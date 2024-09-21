"use client"

import { ourFileRouter } from "@/app/api/uploadthing/core"
import { useToast } from "@/hooks/use-toast";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing"

interface FileUploadProps {
    onChange: (url?: string, originalFilename?: string) => void;
    endpoint: keyof typeof ourFileRouter
};

export const FileUpload = ({
    onChange,
    endpoint
}: FileUploadProps) => {
    const {toast} = useToast();

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log("onClientUploadComplete res:", res),
                onChange(res?.[0].url, res?.[0].name)
            }}
            onUploadError={(error:Error) => {
                toast({
                    title: error?.message
                })
            }}
        />
    )
}