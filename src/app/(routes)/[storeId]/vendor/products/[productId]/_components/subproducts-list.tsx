"use client";

import { Product, SubProduct } from "@prisma/client";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from '@hello-pangea/dnd'

import { Grip, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface SubProductListProps {
    items: SubProduct[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
}

export const SubProductList = ({
    items,
    onReorder,
    onEdit
}: SubProductListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [subproducts, setSubproducts] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setSubproducts(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
    
        const items = Array.from(subproducts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);
    
        const updatedChapters = items.slice(startIndex, endIndex + 1);
    
        setSubproducts(items);
    
        const bulkUpdateData = updatedChapters.map((chapter) => ({
          id: chapter.id,
          position: items.findIndex((item) => item.id === chapter.id)
        }));
    
        onReorder(bulkUpdateData);
      }
    if (!isMounted) {
        return null
    }

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            <Droppable droppableId="subProducts">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {subproducts.map((subproduct, index) => (
                            <Draggable
                                key={subproduct.id}
                                draggableId={subproduct.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div className={`flex items-center gap-x-2 bg-gray-200 border-gray-200 border text-gray-700 rounded-md mb-4 text-sm ${subproduct.isPublished && "bg-blue-100 border-blue-200 text-blue-700"} dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:${subproduct.isPublished && "bg-blue-800 border-blue-600 text-blue-300"}`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div className={`px-2 py-3 border-r border-r-gray-200 hover:bg-gray-300 rounded-l-md transition
                                                ${subproduct.isPublished && "border-r-blue-200 hover:bg-blue-200"}
                                                dark:border-r-slate-800 dark:hover:bg-slate-700
                                                dark:${subproduct.isPublished && "border-r-blue-600 hover:bg-blue-800"}
                                            `}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-5 w-5" />
                                        </div>
                                        {subproduct.sku}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            <Badge
                                                className={`bg-gray-500
                                                ${subproduct.isPublished && "bg-sky-700"}
                                                dark:bg-slate-500
                                                dark:${subproduct.isPublished && "bg-sky-700"}
                                                `}
                                            >
                                                {subproduct.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil
                                                onClick={() => onEdit(subproduct.id)}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}