'use client'

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";
import Image from "next/image";

export type BillboardColumn = {
    id: string;
    label: string;
    createdAt: string;
    imageUrl: string;
}

export const columns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: "imageUrl",
        header: "Image Url",
        cell: ({ row }) => <Image src={row.original.imageUrl} alt="Billboard" className="w-16 h-16 object-cover" width={100} height={50}/>
    },
    {
        accessorKey: "label",
        header: "Label"
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original}/>
    }
]