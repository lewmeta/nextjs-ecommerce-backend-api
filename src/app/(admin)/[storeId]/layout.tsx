import { Navbar } from "@/components/navigation/navbar";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { storeId: string }
}>) {

    const user = await currentUser();

    if (!user?.id) {
        redirect("/auth/login");
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId: user.id,
        },
    });

    if (!store) {
        redirect("/");
    }
    return (

        <>
            <Navbar />
            {children}
        </>
    );
}
