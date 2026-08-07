import type { Product } from '../../data/products';

export function sortByFavorites(products: Product[], favoriteProductIds: string[]): Product[] {
  return [...products].sort((first, second) => {
    const firstIndex = favoriteProductIds.indexOf(first.id);
    const secondIndex = favoriteProductIds.indexOf(second.id);

    if (firstIndex === -1 && secondIndex === -1) return 0;
    if (firstIndex === -1) return 1;
    if (secondIndex === -1) return -1;
    return firstIndex - secondIndex;
  });
}
