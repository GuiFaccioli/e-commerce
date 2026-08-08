import { expect, it } from 'vitest';
import { createAddFeedback } from './feedback';

it('creates a concise add-to-cart confirmation', () => {
  expect(createAddFeedback('TZ-K87')).toEqual({ productId: 'TZ-K87', message: 'Produto adicionado ao carrinho' });
});
