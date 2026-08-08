# Cart Feedback and Offers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make cart additions visibly acknowledged and make the Offers action show discounted products only.

**Architecture:** Keep interaction state in `App.tsx`; add a pure offer-mode helper to make filtering testable. CSS owns the button/cart pulse and honors reduced motion.

**Tech Stack:** React, TypeScript, Vitest, CSS.

## Global Constraints

- Use local, restrained feedback only; do not add toasts, banners, or modals.
- Offer mode only includes products with `promotionalPrice`.
- Add feedback must have a polite live announcement and reduced-motion fallback.

### Task 1: Add offer-mode behavior with tests

**Files:** Create `src/features/storefront/offers.ts`, `src/features/storefront/offers.test.ts`; modify `src/App.tsx`.

- [ ] Write a failing test for `filterOfferProducts(products)` returning only products with `promotionalPrice`.
- [ ] Run `npm.cmd test -- src/features/storefront/offers.test.ts` and confirm it fails because the helper is absent.
- [ ] Implement `filterOfferProducts(products: Product[]): Product[]` using `product.promotionalPrice !== undefined`.
- [ ] Add `catalogMode: 'all' | 'offers'` to `App.tsx`; make header/hero/offer-band actions call an `activateOffers` handler that sets offer mode, resets search/category, scrolls to the catalog, and focuses its heading.
- [ ] Show `Ofertas TechZone` and `Ver seleção completa` while offer mode is active.
- [ ] Run the targeted test, typecheck, lint, and build.

### Task 2: Add non-intrusive cart confirmation with tests

**Files:** Create `src/features/storefront/feedback.ts`, `src/features/storefront/feedback.test.ts`; modify `src/App.tsx`, `src/styles.css`.

- [ ] Write a failing test for `createAddFeedback(productId)` producing `{ productId, message: 'Produto adicionado ao carrinho' }`.
- [ ] Run `npm.cmd test -- src/features/storefront/feedback.test.ts` and confirm it fails because the helper is absent.
- [ ] Implement the helper and use it to set a temporary `addFeedback` state after add-to-cart actions; clear it after 1.8 seconds with cleanup on unmount.
- [ ] Render `Adicionado ✓` only on the matching product button, use `role="status"`, and add a temporary class to pulse the cart count.
- [ ] Add CSS for the concise active state, one cart-count pulse, and reduced-motion suppression.
- [ ] Run all tests, typecheck, lint, and build.
