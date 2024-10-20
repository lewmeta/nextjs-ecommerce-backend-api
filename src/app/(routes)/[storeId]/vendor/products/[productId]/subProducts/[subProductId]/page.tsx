import { currentUser } from '@/lib/auth'
import Link from "next/link";

import { LayoutComponent } from '@/components/layout-component'
import { db } from "@/lib/db";
import { redirect } from 'next/navigation';
import { Banner } from '@/components/banner';
import { ArrowLeft } from 'lucide-react';
import SubproductActions from './_components/sub-product-actions';
// import { IconBadge } from '@/components/icon-badge';
// import SubProductKsu from './_components/sub-product-sku';
import { SubProductImages } from './_components/sub-product-images';
import { SubProductSizes } from './_components/sub-product-sizes';
import { SubProductColorImage } from './_components/sub-product-color-image';
import { SubProductDiscount } from './_components/sub-product-discount';
import { ProductProgress } from '@/components/product-progress';

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

    console.log({ subProductId: params.subProductId })

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
            color: true,
            product: true,
        },
    });

    console.log({ subProduct: subProduct?.product })
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

    // const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);
    const progress = (completedFields / totalFields) * 100;

    return (
        <LayoutComponent>
            {!subProduct.isPublished && (
                <Banner
                    variant="warning"
                    label="This subProduct is unpublished. It will not be visible to the Customers"
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
                        <div className="max-w-[290px] mt-4 w-full">
                            <ProductProgress
                                variant={progress === 100 ? 'success' : 'default'}
                                size='default'
                                value={progress}
                            />
                        </div>
                    </div>
                    <SubproductActions
                        disabled={!isComplete}
                        isPublished={subProduct.isPublished}
                        productId={params.productId}
                        storeId={params.storeId}
                        subProductId={params.subProductId}
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_350px] lg:gap-8">
                    <div className="">
                        {/* <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl font-medium">Customize your Sub Products</h2>
                        </div> */}
                        {/* <SubProductKsu
                            initialData={subProduct}
                            productId={params.productId}
                            storeId={params.storeId}
                            subProductId={params.subProductId}
                        /> */}
                        <SubProductSizes
                            initialData={subProduct}
                            productId={params.productId}
                            storeId={params.storeId}
                            subProductId={params.subProductId}
                        />
                        <SubProductImages
                            initialData={subProduct}
                            productId={params.productId}
                            storeId={params.storeId}
                            subProductId={params.subProductId}
                        />
                        <SubProductColorImage
                            initialData={subProduct.color!}
                            productId={params.productId}
                            storeId={params.storeId}
                            subProductId={params.subProductId}
                        />
                    </div>
                    <div className="">
                        <SubProductDiscount
                            initialData={subProduct}
                            productId={params.productId}
                            storeId={params.storeId}
                            subProductId={params.subProductId}
                        />
                    </div>
                </div>
            </div>
        </LayoutComponent>
    )
}

export default Page
