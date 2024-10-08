'use client'

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/alert/api-list";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/navigation/heading";
import { Separator } from "@/components/ui/separator";
import { ProductColumn, Column } from "./columns";
import { LayoutComponent } from "@/components/layout-component";

interface ProductsClientProps {
    data: ProductColumn[]
}

export const ProductsClient = ({
    data
}: ProductsClientProps) => {
    const params = useParams();
    const router = useRouter();

    return (
        <LayoutComponent>
            <div className="flex items-center justify-between pr-4">
                <Heading title="Products" />
                <Button onClick={() => router.push(`/${params.storeId}/vendor/products/${params.productId}`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable columns={Column} data={data} searchKey="name" />
            <Heading
                title="API"
                description="API Calls for products"
            />
            <Separator />
            <ApiList
                entityName="products"
                entityIdName="productId"
            />
        </LayoutComponent>
    )
}