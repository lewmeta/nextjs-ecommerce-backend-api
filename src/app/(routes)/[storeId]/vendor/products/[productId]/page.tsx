
import { Banner } from '@/components/banner';
import { LayoutComponent } from '@/components/layout-component'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation';
import { Actions } from './_components/actions';

const page = async (
    { params }: { params: { productId: string, storeId: string } }
) => {

    const user = await currentUser();

    if (!user?.id) {
        return redirect('/auth/login')
    }

    const product = await db.product.findUnique({
        where: {
            id: params.productId,
            storeId: params.storeId,
        },
        include: {
            subProducts: {
                orderBy: {
                    position: 'asc'
                },
                include: {
                    sizes: true
                }
            },
            questions: true
        },
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    const requiredFields = [
        product?.name,
        product?.description,
        product?.rating,
        // product?.numReviews,
        // product?.refundPolicy,
        product?.shippingPrice,
        // product?.subProducts?.map(subProduct => ({
        //     sku: subProduct.sku,
        //     // position: subProduct.position,
        //     images: subProduct.images,
        //     sizes: subProduct.sizes,
        // })),
        product?.subProducts.some((chapter => chapter.isPublished))
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields} / ${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <LayoutComponent>
            {!product?.isPublished && (
                <Banner
                    label='This product is not published. It will not be visible to your customers'
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className='flex flex-col gap-y-2'>
                        <h1 className="text-2xl font-medium">
                            Product Setup
                        </h1>
                        <span className='text-sm'>
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <Actions
                        disabled={!isComplete}
                        productId={params.productId}
                        isPublished={product?.isPublished!}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className='flex items-center gap-x-2'>
                            
                        </div>
                    </div>
                </div>
            </div>
        </LayoutComponent>
    )
}

export default page
