import type { CartItem, Product } from '../data/products';
import { pushToDataLayer } from '../lib/dataLayer';

type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity: number;
};

const priceOf = (product: Product) => product.promotionalPrice ?? product.price;

export function mapProductToAnalyticsItem(product: Product | CartItem, quantity = 'quantity' in product ? product.quantity : 1): AnalyticsItem {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: priceOf(product),
    quantity,
  };
}

export const cartValue = (items: CartItem[]) => items.reduce((total, item) => total + priceOf(item) * item.quantity, 0);
export const pushPageViewCustom = (path: string, title: string) => pushToDataLayer({ event: 'page_view_custom', page_location: path, page_title: title });
export const pushViewItem = (product: Product) => pushToDataLayer({ event: 'view_item', ecommerce: { currency: 'BRL', value: priceOf(product), items: [mapProductToAnalyticsItem(product)] } });
export const pushSelectItem = (product: Product) => pushToDataLayer({ event: 'select_item', ecommerce: { items: [mapProductToAnalyticsItem(product)] } });
export const pushAddToCart = (product: Product, quantity = 1) => pushToDataLayer({ event: 'add_to_cart', ecommerce: { currency: 'BRL', value: priceOf(product) * quantity, items: [mapProductToAnalyticsItem(product, quantity)] } });
export const pushRemoveFromCart = (product: Product, quantity = 1) => pushToDataLayer({ event: 'remove_from_cart', ecommerce: { currency: 'BRL', value: priceOf(product) * quantity, items: [mapProductToAnalyticsItem(product, quantity)] } });
export const pushViewCart = (items: CartItem[]) => pushToDataLayer({ event: 'view_cart', ecommerce: { currency: 'BRL', value: cartValue(items), items: items.map((item) => mapProductToAnalyticsItem(item)) } });
export const pushBeginCheckout = (items: CartItem[]) => pushToDataLayer({ event: 'begin_checkout', ecommerce: { currency: 'BRL', value: cartValue(items), items: items.map((item) => mapProductToAnalyticsItem(item)) } });
export const pushPurchase = (transactionId: string, items: CartItem[]) => pushToDataLayer({ event: 'purchase', ecommerce: { transaction_id: transactionId, currency: 'BRL', value: cartValue(items), items: items.map((item) => mapProductToAnalyticsItem(item)) } });
export const pushSearch = (searchTerm: string) => pushToDataLayer({ event: 'search', search_term: searchTerm });
export const pushFilterProducts = (category: string) => pushToDataLayer({ event: 'filter_products', filter_type: 'category', filter_value: category });
