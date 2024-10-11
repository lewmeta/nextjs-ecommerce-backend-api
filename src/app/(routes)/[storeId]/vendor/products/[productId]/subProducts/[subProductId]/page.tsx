import { currentUser } from '@/lib/auth'
import Link from "next/link";

import { LayoutComponent } from '@/components/layout-component'
import { db } from "@/lib/db";
import { redirect } from 'next/navigation';
import { Banner } from '@/components/banner';
import { ArrowLeft } from 'lucide-react';
import SubproductActions from './_components/sub-product-actions';

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
            sizes: true,
            images: true,
        },
    });

    if (!subProduct) {
        return redirect(`/${params.storeId}/products/${params.productId}`)
    }

    const requiredFields = [
        subProduct.images.length > 0,
        subProduct.color,
        subProduct.sizes.length > 0,
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
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className='w-full'>
                        <Link
                            href={`/${params.storeId}/vendor/products/${params.productId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to product setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Subproduct Creation</h1>
                            </div>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 ">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <SubproductActions
                        disabled={!isComplete}
                        isPublished={subProduct.isPublished}
                        productId={params.productId}
                        storeId={params.storeId}
                        subProductId={params.subProductId}
                    />
                </div>
            </div>
        </LayoutComponent>
    )
}

export default Page
