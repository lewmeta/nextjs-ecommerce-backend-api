'use client'

import { useParams, useRouter } from "next/navigation";

import { PlusIcon } from "@/components/icons/plus-icon"
import { Heading } from "@/components/navigation/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/alert/api-list";
import { BillboardColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";

interface BillboardClientProps {
    data: BillboardColumn[];
}

export const BillboardClient = ({
    data
}: BillboardClientProps) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.length})`}
                    description="Manage billboards for your store"
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/billboards/new`)}
                >
                    <PlusIcon className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                searchKey="label"
                columns={columns}
                data={data}
            />

            <Heading
                title="BILLBOARD APIs"
                description="API Calls for Billboards"
            />
            <Separator />
            <ApiList
                entityIdName="billboardId"
                entityName="billboards"
            />
        </>
    )
}