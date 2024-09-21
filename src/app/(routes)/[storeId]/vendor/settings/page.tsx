import { LayoutComponent } from "@/components/layout-component"
import SettingsForm from "./_components/settings-form"
import { currentUser } from "@/lib/auth"
import { redirect } from "next/navigation";
import { db } from "@/lib/db";


const Page = async ({ params }: { params: { storeId: string } }) => {
    const user = await currentUser();

    if (!user?.id){
        redirect('/auth/login');
    }

    const store =await db.store.findFirst({
        where: {
            id: params.storeId,
            userId: user.id
        }
    });

    if (!store){
        redirect("/")
    }

    return (
        <LayoutComponent
        >
            <div className="">
                <SettingsForm initialData={store} />
            </div>
        </LayoutComponent>
    )
}

export default Page
