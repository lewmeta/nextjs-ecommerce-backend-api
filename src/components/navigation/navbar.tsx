import { MainNav } from "./main-nav"
import { Sidebar } from "./sidebar"

export const Navbar = () => {
    return (
        <div className="flex items-center">
            <Sidebar />
            <MainNav />
        </div>
    )
}
