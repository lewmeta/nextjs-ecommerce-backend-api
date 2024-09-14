import { Navbar } from "@/components/navigation/navbar";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <>
            <Navbar />
            {children}
        </>
    );
}
