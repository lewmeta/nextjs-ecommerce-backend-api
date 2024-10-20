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
        <div key={fileUrl} className="relative w-[200px] h-[200px] overflow-hidden flex flex-wrap">
                <Image
                    src={fileUrl}
                    alt="uploaded image"
                    className="object-cover rounded-md"
                   fill
                />
            {/* <div>
            </div> */}
            <div
                onClick={() => handleRemove(fileUrl)}
                className="cursor-pointer absolute top-0 right-0  h-8 w-8 rounded-tl-full rounded-bl-full text-white flex items-center justify-center bg-blue-900"
            >
                <X className="h-4 w-4" />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-start justify-start">
            <div className="flex items-start flex-wrap gap-4 justify-start">
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
