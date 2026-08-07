import { expect, it } from 'vitest';
import { products } from '../../data/products';
import { sortByFavorites } from './catalog';

it('places favorites before non-favorite products', () => {
  const result = sortByFavorites(products.slice(0, 2), [products[1].id]);

  expect(result[0].id).toBe(products[1].id);
});
