import { currentUser } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing();

const handleAuth = async () => {
    const user = await currentUser(); // Fetch the current user using your hook

    if (!user || !user.id) {
        throw new Error("Unauthorized");
    }

    return { userId: user.id };
}

export const ourFileRouter = {
    billboardImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),


} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter