export type AddFeedback = {
  productId: string;
  message: string;
};

export function createAddFeedback(productId: string): AddFeedback {
  return { productId, message: 'Produto adicionado ao carrinho' };
}
