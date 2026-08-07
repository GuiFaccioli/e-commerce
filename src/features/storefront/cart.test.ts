import { describe, expect, it } from 'vitest';
import { products } from '../../data/products';
import { addCartItem, updateCartQuantity } from './cart';

const product = {
  ...products[0],
  selectedVariantId: products[0].colorVariants[0].id,
  selectedColor: products[0].colorVariants[0].colorName,
  selectedImage: products[0].colorVariants[0].image,
};

describe('cart state', () => {
  it('increments an existing product variant instead of duplicating it', () => {
    const once = addCartItem([], product);
    const twice = addCartItem(once, product);

    expect(twice).toHaveLength(1);
    expect(twice[0].quantity).toBe(2);
  });

  it('removes an item when its quantity reaches zero', () => {
    const cart = addCartItem([], product);

    expect(updateCartQuantity(cart, cart[0].cartKey, -1)).toEqual([]);
  });
});
