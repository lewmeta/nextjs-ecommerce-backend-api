import { currentUser } from '@/lib/auth'
import Link from "next/link";

import { LayoutComponent } from '@/components/layout-component'
import { db } from "@/lib/db";
import { redirect } from 'next/navigation';
import { Banner } from '@/components/banner';

interface SubProductIdPageProps {
    params: {
        storeId: string
        productId: string;
        subProductId: string;
    },
};

const Page = async ({
    params
}: SubProductIdPageProps) => {

    const user = await currentUser();

    if (!user?.id) {
        return redirect('/auth/login')
    }

    const subProduct = await db.subProduct.findUnique({
        where: {
            id: params.subProductId,
            productId: params.productId,
        },
        include: {
            sizes: true
        }
    })

    if (!subProduct) {
        return redirect(`/${params.storeId}/products/${params.productId}`)
    }

    const requiredFields = [
        subProduct.images,
        subProduct.sizes,
        subProduct.color,
        subProduct.discount,
        subProduct.sku,
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <LayoutComponent>
            {!subProduct.isPublished && (
                <Banner
                    variant="warning"
                    label="This chapter is unpublished. It will not be visible in the course"
                />
            )}
        </LayoutComponent>
    )
}

export default Page
