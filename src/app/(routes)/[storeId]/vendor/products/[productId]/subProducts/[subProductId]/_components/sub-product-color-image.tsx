import { Color } from "@prisma/client";

interface SubProductColorImage {
    initialData: {
        color: Color;
    };
    storeId: string;
    productId: string;
    subProductId: string;
}
export const SubProductColorImage = ({
    initialData,
    productId,
    storeId,
    subProductId
}: SubProductColorImage) => {
  return (
    <div>
      Subproduct color images.
    </div>
  )
}