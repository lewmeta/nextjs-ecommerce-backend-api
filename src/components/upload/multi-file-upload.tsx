// MultipleFileUpload.tsx
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { useToast } from "@/hooks/use-toast";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface MultipleFileUploadProps {
    onChange: (urls?: string[]) => void;
    endpoint: keyof typeof ourFileRouter;
    value?: string[];
}

export const MultiFileUpload = ({ onChange, endpoint, value = [] }: MultipleFileUploadProps) => {
    const { toast } = useToast();

    const handleRemove = (url: string) => {
        const updatedFiles = value.filter(file => file !== url);
        onChange(updatedFiles.length > 0 ? updatedFiles : undefined);
    };

    const renderFilePreview = (fileUrl: string) => (
        <div key={fileUrl} className=" relative">
            <div className="relative w-40 h-40">
                <Image
                    src={fileUrl}
                    alt="uploaded image"
                    className="object-cover rounded-md"
                   fill
                />
            </div>
            <div
                onClick={() => handleRemove(fileUrl)}
                className="mt-2 cursor-pointer mb-3"
            >
                <X className="h-4 w-4" />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-start justify-start">
            <div className="flex items-start gap-4 justify-start">
            {value.map(renderFilePreview)}
            </div>
            <div className="mt-5">
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    const newFiles = res?.map((file) => file.url) || [];
                    onChange([...value, ...newFiles]); // Combine existing and new files
                }}
                onUploadError={(error: Error) => {
                    toast({
                        title: error?.message,
                    });
                }}
            />
            </div>
        </div>
    );
};
