import { ourFileRouter } from "@/app/api/uploadthing/core";
import { useToast } from "@/hooks/use-toast";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface Multi {
    onChange: (url?: string | string[], originalFilename?: string) => void;
    endpoint: keyof typeof ourFileRouter;
    value?: string | string[];
    allowMultiple?: boolean; // Include this if you want to support multiple uploads
}

export const MultiFileUpload = ({
    onChange,
    endpoint,
    value,
    allowMultiple = false, // Default to false if not specified
}: Multi) => {
    const { toast } = useToast();

    const handleRemove = (url: string) => {
        if (allowMultiple && Array.isArray(value)) {
            const updatedFiles = value.filter((file) => file !== url);
            onChange(updatedFiles.length > 0 ? updatedFiles : undefined);
        } else {
            onChange(undefined);
        }
    };

    const renderFilePreview = (fileUrl: string) => (
        <div key={fileUrl} className="flex flex-col items-start justify-start relative">
            <div className="relative w-40 h-40">
                <Image
                    src={fileUrl}
                    alt="uploaded image"
                    className="object-cover rounded-md"
                    fill
                    onError={(e) => {
                        console.error("Image load error:", e);
                        e.currentTarget.src = "/path/to/fallback-image.png"; // Set a fallback image path
                    }}
                />
            </div>
            <Button onClick={() => handleRemove(fileUrl)} type="button" variant="default" className="mt-2">
                <X className="h-4 w-4" />
            </Button>
        </div>
    );

    if (Array.isArray(value)) {
        return (
            <div className="flex flex-col items-start justify-start">
                {value.map(renderFilePreview)}
            </div>
        );
    }

    if (typeof value === "string") {
        return <>{renderFilePreview(value)}</>;
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                if (allowMultiple) {
                    const newFiles = res?.map((file) => file.url) || [];
                    onChange(newFiles);
                } else {
                    onChange(res?.[0].url, res?.[0].name);
                }
            }}
            onUploadError={(error: Error) => {
                toast({ title: error?.message });
            }}
        />
    );
};
