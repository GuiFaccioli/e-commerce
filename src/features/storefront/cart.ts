import type { CartItem, Product } from '../../data/products';

export function addCartItem(cart: CartItem[], product: Product): CartItem[] {
  const selectedVariantId = product.selectedVariantId ?? product.colorVariants[0]?.id;
  const selectedColor = product.selectedColor ?? product.colorVariants[0]?.colorName;
  const selectedImage = product.selectedImage ?? product.colorVariants[0]?.image;

  if (!selectedVariantId || !selectedColor || !selectedImage) return cart;

  const cartKey = `${product.id}-${selectedVariantId}`;
  const existingItem = cart.find((item) => item.cartKey === cartKey);

  if (existingItem) {
    return cart.map((item) => item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item);
  }

  return [...cart, {
    ...product,
    cartKey,
    quantity: 1,
    selectedVariantId,
    selectedColor,
    selectedImage,
  }];
}

export function updateCartQuantity(cart: CartItem[], cartKey: string, delta: number): CartItem[] {
  return cart.flatMap((item) => {
    if (item.cartKey !== cartKey) return [item];

    const quantity = item.quantity + delta;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  });
}
