import type { Product } from '../../data/products';

export function filterOfferProducts(products: Product[]): Product[] {
  return products.filter((product) => product.promotionalPrice !== undefined);
}
