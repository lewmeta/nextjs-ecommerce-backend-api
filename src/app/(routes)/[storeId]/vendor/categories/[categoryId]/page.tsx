import { db } from "@/lib/db";

import { CategoryForm } from "./_components/category-form";
import { LayoutComponent } from "@/components/layout-component";
const CategoryPage = async ({
    params
}: {
    params: { categoryId: string, storeId: string }
}) => {
    const category = await db.category.findUnique({
        where: {
            id: params.categoryId
        }
    });

    const billboards = await db.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    });

    return (
        <LayoutComponent>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <CategoryForm billboards={billboards} initialData={category} />
                </div>
            </div>
        </LayoutComponent>
    );
}

export default CategoryPage;
