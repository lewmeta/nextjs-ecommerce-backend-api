'use client'

import { Size } from "@prisma/client"
import { useState } from "react";

interface SubProductSizesProps {
    initalData: { sizes: Size[] | null },
    storeId: string;
    productId: string;
    subProductId: string;
}

export const SubProductSizes = ({
    initalData,
    productId,
    storeId,
    subProductId,
}: SubProductSizesProps) => {
    const [noSize, setNoSize] = useState(false);

    const handleSize = () => {

    }

    const handleRemove = () => {

    }

    return (
        <div>
            Sub Product Sizes
        </div>
    )
}