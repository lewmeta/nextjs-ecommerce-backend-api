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

    if (!store) {
        redirect("/")
    }
    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed w-full inset-y-0 z-50">
                <Navbar />
            </div>
            <div className="hidden md:flex h-full flex-col fixed inset-y-0 z-50">
                <Sidebar items={[]} />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
    );
}
