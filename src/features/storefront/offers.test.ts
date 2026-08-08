import { expect, it } from 'vitest';
import { products } from '../../data/products';
import { filterOfferProducts } from './offers';

it('returns only products with promotional prices', () => {
  const offers = filterOfferProducts(products);

  expect(offers).not.toHaveLength(0);
  expect(offers.every((product) => product.promotionalPrice !== undefined)).toBe(true);
});
