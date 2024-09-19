import { MainNav } from "./main-nav"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

export const Navbar = async () => {

    const user = await currentUser();
    
    if (user?.id) {
        redirect("/auth/login");
    }

    const stores = await db.store.findMany({
        where: {
            userId: user?.id
        },
    });

    // console.log(stores)

    return (
        <div className="flex items-center">
            <Sidebar/>
            <MainNav />
        </div>
    )
}
