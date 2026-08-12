import prisma from '@/lib/prisma';
import { VariantStatus } from '@prisma/client';

export async function getVariantsByProduct(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createVariant(data: {
  productId: string;
  size?: string;
  finish?: string;
  material?: string;
  sku?: string;
  status?: VariantStatus;
}) {
  return prisma.productVariant.create({
    data: {
      productId: data.productId,
      size: data.size,
      finish: data.finish,
      material: data.material,
      sku: data.sku,
      status: data.status || VariantStatus.ACTIVE,
    },
  });
}

export async function updateVariant(
  id: string,
  data: Partial<{
    size: string;
    finish: string;
    material: string;
    sku: string;
    status: VariantStatus;
  }>
) {
  return prisma.productVariant.update({
    where: { id },
    data,
  });
}

export async function deleteVariant(id: string) {
  return prisma.productVariant.delete({
    where: { id },
  });
}
