
import { Banner } from '@/components/banner';
import { LayoutComponent } from '@/components/layout-component'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation';
import { Actions } from './_components/actions';
import { IconBadge } from '@/components/icon-badge';
import { ChevronLeft, LayoutDashboard, ListCheck } from 'lucide-react';
import ProductNameForm from './_components/name-form';
import DescriptionForm from './_components/description-form';
import { CategoryForm } from './_components/category-form';
import { SubproductForm } from './_components/subproducts-form';
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            name: 'asc'
        }
    });

    const requiredFields = [
        product?.name,
        product?.description,
        // product?.rating,
        // product?.numReviews,
        // product?.refundPolicy,
        product?.categoryId,
        product?.shippingPrice,
        product?.subProducts?.length! > 0,
        product?.subProducts.some((chapter => chapter.isPublished)),
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
                {/* <div className="flex items-center justify-between">
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
                </div> */}

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Pro Controller
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                        In stock
                    </Badge>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Actions
                            disabled={!isComplete}
                            productId={params.productId}
                            storeId={params.storeId}
                            isPublished={product?.isPublished!}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge
                                icon={LayoutDashboard}
                            />
                            <h2 className="text-xl">
                                Customize your product
                            </h2>
                        </div>
                        <ProductNameForm
                            initialData={product!}
                            productId={params.productId}
                            storeId={params.storeId}
                        />
                        <DescriptionForm
                            initialData={product!}
                            productId={product?.id!}
                            storeId={product?.storeId!}
                        />
                        <CategoryForm
                            initialData={product!}
                            productId={product?.id!}
                            storeId={product?.storeId!}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListCheck} />
                                <h2 className="text-xl">
                                    Subproducts
                                </h2>
                            </div>
                            <SubproductForm
                                initialData={product!}
                                productId={params.productId}
                                storeId={params.storeId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </LayoutComponent>
    )
}

export default page
