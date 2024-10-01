import { db } from "@/lib/db";
import { MainNav } from "./main-nav"
import { Sidebar } from "./sidebar"
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MobileNavbar } from "./mobile-navbar";

export const Navbar = async () => {

    const user = await currentUser();

    if (!user?.id) {
        redirect("/auth/login")
    }
    const stores = await db.store.findMany({
        where: {
            userId: user?.id,
        },
    });

    return (
        <div className="flex items-center bg-sky-500">
            <MainNav />
            <MobileNavbar/>
        </div>
    )
}
