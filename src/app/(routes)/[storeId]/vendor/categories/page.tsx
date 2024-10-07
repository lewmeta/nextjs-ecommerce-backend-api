import { format } from "date-fns";

import { db } from "@/lib/db";

import { CategoryColumn } from "./_components/columns";
import { CategoriesClient } from "./_components/client";
import { LayoutComponent } from "@/components/layout-component";

const CategoriesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        imageUrl: item.imageUrl,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <LayoutComponent>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <CategoriesClient data={formattedCategories} />
                </div>
            </div>
        </LayoutComponent>
    );
};

export default CategoriesPage;
