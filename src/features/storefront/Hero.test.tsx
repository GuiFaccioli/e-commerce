import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('uses a product-specific alternative text for the hero image', () => {
    render(<Hero onShowProducts={vi.fn()} onShowOffers={vi.fn()} />);

    expect(screen.getByRole('img', { name: /monitor gamer 27/i })).toBeInTheDocument();
  });
});
