import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string; subProductId: string } }
) {
    try {
        const user = await currentUser();

        const { sizes, imageUrl, color, images, sku, isPublished, ...values } = await req.json();

        const colors = {
            color: color,
            imageUrl: imageUrl
        }

        console.log({ sizes: sizes })

        if (!user?.id) {
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 })
        }

        // Check if subproduct exists before updating.

        const existingSubproduct = await db.subProduct.findFirst({
            where: {
                id: params.subProductId,
                productId: params.productId
            }
        })

        if (!existingSubproduct) {
            return new NextResponse("No suproduct found", { status: 401 })
        }

        // Check if the SKU already exists for another subproduct (optional if SKU can be edited)
        if (sku) {
            const skuExists = await db.subProduct.findFirst({
                where: {
                    sku: sku,
                    productId: params.productId,
                    NOT: { id: params.subProductId }, // Exclude current subproduct
                },
            });

            if (skuExists) {
                return NextResponse.json({ message: "This SKU already exists!" }, { status: 409 });
            }
        }

        const updateData: any = {
            sku,
            ...values,
        };


        // Only update images if they are provided
        if (images && images.length > 0) {
            updateData.images = {
                deleteMany: {}, // Clear old images
                create: images.map((url: string) => ({ url })), // Add new images
            };
        }

        // Only handle size operations if sizes are provided
        if (sizes && Array.isArray(sizes)) {
            // Step 1: Get all existing sizes from the database
            const existingSizes = await db.size.findMany({
                where: { subProductId: params.subProductId },
            });

            // Step 2: Extract the IDs of the sizes sent from the frontend
            const sizesToUpdateIds = sizes.map((size: { id: string; }) => size.id);

            // Step 3: Find which sizes in the database are not included in the frontend submission
            const sizesToDelete = existingSizes
                .filter(size => !sizesToUpdateIds.includes(size.id))
                .map(size => size.id); // These sizes will be deleted

            // Step 4: Delete the sizes that were not in the frontend submission
            if (sizesToDelete.length > 0) {
                await db.size.deleteMany({
                    where: {
                        id: { in: sizesToDelete },
                    },
                });
            }

            updateData.sizes = {
                // Use upsert with the correct structure
                upsert: sizes.map((size: { id: string; size: string; qty: number; price: number; }) => ({
                    where: { id: size.id || "new" }, // use a condition to identify the size
                    create: {
                        size: size.size,
                        qty: size.qty,
                        price: size.price,
                    },
                    update: {
                        qty: size.qty,
                        price: size.price,
                    },
                })),
            };
        }

        // Handle color and image updates
        if (color && imageUrl) {
            updateData.color = {
                upsert: {
                    create: colors, // If there's no color, create it
                    update: colors, // If the color exists, update it
                },
            };
        }

        const subProduct = await db.subProduct.update({
            where: {
                id: params.subProductId,
                productId: params.productId,
            },
            data: {
                ...updateData,
            },
        });

        return NextResponse.json(subProduct);
    } catch (error) {
        console.log('[SUBPRODUCT_PATCH]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }

}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; productId: string; subProductId: string } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse('Unauthenticated', { status: 401 })
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 })
        }

        const subProductById = await db.subProduct.findFirst({
            where: {
                id: params.subProductId,
                productId: params.productId
            },
        });

        if (!subProductById) {
            return new NextResponse('Sub Product not found', { status: 404 })
        }

        const publishedSubProductsProduct = await db.subProduct.findMany({
            where: {
                productId: params.productId,
                isPublished: true
            },
        });

        if (!publishedSubProductsProduct.length) {
            await db.product.update({
                where: {
                    id: params.productId
                },
                data: {
                    isPublished: false
                }
            })
        }

        const subProduct = await db.subProduct.delete({
            where: {
                id: params.subProductId,
            }
        })

        return NextResponse.json(subProduct)
    } catch (erorr) {
        console.log('[SUBPRODUCT_DELETE]', erorr);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}