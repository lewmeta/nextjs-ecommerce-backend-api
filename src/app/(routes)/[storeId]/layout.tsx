import { Navbar } from "@/components/navigation/navbar";
import { Sidebar } from "@/components/navigation/sidebar";
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

    const stores = await db.store.findMany({
        where: {
            userId: user?.id,
        },
    });


    if (!store) {
        redirect("/")
    }
    return (
        <div className="h-full w-full relative ">
            <div className="overflow-hidden fixed w-full h-auto left-auto">
                <Navbar />
            </div>
            <div className="hidden md:flex h-full flex-col fixed top-0 z-50">
                <Sidebar items={stores} />
            </div>
            <main className="h-full z-[200]">
                {children}
            </main>
        </div>
    );
}
