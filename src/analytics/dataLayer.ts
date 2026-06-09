import type { CartItem, Product } from '../data/products';

declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

type Ga4Item = { item_id: string; item_name: string; item_category: string; price: number; quantity: number };

const priceOf = (product: Product) => product.promotionalPrice ?? product.price;
const toGa4Item = (item: Product | CartItem, quantity = 'quantity' in item ? item.quantity : 1): Ga4Item => ({
  item_id: item.id,
  item_name: item.name,
  item_category: item.category,
  price: priceOf(item),
  quantity,
});

function pushToDataLayer(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export const cartValue = (items: CartItem[]) => items.reduce((total, item) => total + priceOf(item) * item.quantity, 0);
export const pushViewItem = (product: Product) => pushToDataLayer({ event: 'view_item', ecommerce: { currency: 'BRL', value: priceOf(product), items: [toGa4Item(product)] } });
export const pushSelectItem = (product: Product) => pushToDataLayer({ event: 'select_item', ecommerce: { items: [toGa4Item(product)] } });
export const pushAddToCart = (product: Product, quantity = 1) => pushToDataLayer({ event: 'add_to_cart', ecommerce: { currency: 'BRL', value: priceOf(product) * quantity, items: [toGa4Item(product, quantity)] } });
export const pushRemoveFromCart = (product: Product, quantity = 1) => pushToDataLayer({ event: 'remove_from_cart', ecommerce: { currency: 'BRL', value: priceOf(product) * quantity, items: [toGa4Item(product, quantity)] } });
export const pushViewCart = (items: CartItem[]) => pushToDataLayer({ event: 'view_cart', ecommerce: { currency: 'BRL', value: cartValue(items), items: items.map((item) => toGa4Item(item)) } });
export const pushBeginCheckout = (items: CartItem[]) => pushToDataLayer({ event: 'begin_checkout', ecommerce: { currency: 'BRL', value: cartValue(items), items: items.map((item) => toGa4Item(item)) } });
export const pushPurchase = (transactionId: string, items: CartItem[]) => pushToDataLayer({ event: 'purchase', ecommerce: { transaction_id: transactionId, currency: 'BRL', value: cartValue(items), items: items.map((item) => toGa4Item(item)) } });
export const pushSearch = (searchTerm: string) => pushToDataLayer({ event: 'search', search_term: searchTerm });
export const pushFilterProducts = (category: string) => pushToDataLayer({ event: 'filter_products', filter_type: 'category', filter_value: category });
