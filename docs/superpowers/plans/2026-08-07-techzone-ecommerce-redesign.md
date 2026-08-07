# TechZone Ecommerce Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a responsive, accessible premium TechZone storefront that keeps working catalog behaviour and removes every public study, debug, and fake-commerce message.

**Architecture:** `App.tsx` remains the stateful composition root. Extract testable cart transformations and presentational storefront components; retain analytics and cookie-context persistence behind current library APIs, but never display implementation details to shoppers. Replace the styles with Titanium Gallery semantic tokens.

**Tech Stack:** React 19, TypeScript, Vite, CSS, Vitest, React Testing Library.

## Global Constraints

- Preserve local products, variants, favorites, cart, filters, analytics events, and cookie-context synchronization.
- Customer copy is Portuguese and cannot mention study, test, debug, cookies, tracking, or fake payment.
- Do not claim that a purchase was completed without a real orders/payment backend.
- Meet WCAG 2.1 AA, keyboard support, visible focus, reduced motion, and 320px responsive behavior.
- Use a neutral light canvas, graphite surfaces, and restrained technical green. Do not use gradients, glassmorphism, decorative grids, or oversized card radii.

---

### Task 1: Establish test tooling and cart state

**Files:**
- Modify: `package.json`, `vite.config.ts`
- Create: `src/test/setup.ts`, `src/features/storefront/cart.ts`, `src/features/storefront/cart.test.ts`

**Interfaces:**
- Produces `addCartItem(cart: CartItem[], product: Product): CartItem[]` and `updateCartQuantity(cart: CartItem[], cartKey: string, delta: number): CartItem[]`.

- [ ] **Step 1: Write the failing state test.**

```ts
it('increments a repeated product variant instead of duplicating it', () => {
  const product = selectDefaultVariant(products[0]);
  const once = addCartItem([], product);
  expect(addCartItem(once, product)).toHaveLength(1);
  expect(addCartItem(once, product)[0].quantity).toBe(2);
});

it('removes an item when its quantity reaches zero', () => {
  const cart = addCartItem([], selectDefaultVariant(products[0]));
  expect(updateCartQuantity(cart, cart[0].cartKey, -1)).toEqual([]);
});
```

- [ ] **Step 2: Verify RED.**

Run: `npm test -- src/features/storefront/cart.test.ts`

Expected: FAIL because the test command and cart helper module do not exist.

- [ ] **Step 3: Configure tests and implement the minimal helper.**

Run: `npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`

Add scripts `"test": "vitest run"` and `"test:watch": "vitest"`. Configure `test.environment` as `jsdom` and import `@testing-library/jest-dom/vitest` in `src/test/setup.ts`.

```ts
export function updateCartQuantity(cart: CartItem[], cartKey: string, delta: number): CartItem[] {
  return cart.flatMap((item) => {
    if (item.cartKey !== cartKey) return [item];
    const quantity = item.quantity + delta;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  });
}
```

`addCartItem` must derive `${product.id}-${product.selectedVariantId}`, increment a matching item, or append a complete `CartItem` with quantity `1`.

- [ ] **Step 4: Verify GREEN and commit.**

Run: `npm test -- src/features/storefront/cart.test.ts && npm run typecheck && npm run lint`

Expected: PASS with no TypeScript or ESLint errors.

```bash
git add package.json package-lock.json vite.config.ts src/test/setup.ts src/features/storefront/cart.ts src/features/storefront/cart.test.ts
git commit -m "test: add storefront state coverage"
```

### Task 2: Build accessible catalogue and product-detail components

**Files:**
- Create: `src/features/storefront/ProductCard.tsx`, `src/features/storefront/ProductCatalog.tsx`, `src/features/storefront/ProductDialog.tsx`, `src/features/storefront/ProductCatalog.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `ProductCatalog` receives products, favorites, selected variants, and `onAddToCart`, `onSelectVariant`, `onToggleFavorite`, and `onViewDetails` callbacks.
- `ProductDialog` receives a selected product, selected variant, `onClose`, `onSelectVariant`, and `onAddToCart`.

- [ ] **Step 1: Write the failing catalogue test.**

```tsx
it('adds the selected product from the catalogue', async () => {
  const user = userEvent.setup();
  const onAddToCart = vi.fn();
  render(<ProductCatalog products={[products[0]]} favoriteProductIds={[]} selectedVariants={{}} onAddToCart={onAddToCart} onSelectVariant={vi.fn()} onToggleFavorite={vi.fn()} onViewDetails={vi.fn()} />);
  await user.click(screen.getByRole('button', { name: /adicionar .* carrinho/i }));
  expect(onAddToCart).toHaveBeenCalledWith(products[0]);
});
```

- [ ] **Step 2: Verify RED.**

Run: `npm test -- src/features/storefront/ProductCatalog.test.tsx`

Expected: FAIL because `ProductCatalog` does not exist.

- [ ] **Step 3: Implement the smallest accessible catalogue.**

`ProductCard` uses an `<article>`, product image, `aria-pressed` favorite button, labelled variant buttons, original/promotional price, and distinct `Ver detalhes`/`Adicionar ao carrinho` controls. `ProductDialog` uses `<dialog>` or `role="dialog" aria-modal="true"`, a labelled heading, and a close control. Replace the existing inline catalogue and product modal in `App.tsx`, retaining tracking calls in `App.tsx` handlers.

- [ ] **Step 4: Verify GREEN and commit.**

Run: `npm test -- src/features/storefront/ProductCatalog.test.tsx && npm run typecheck && npm run lint && npm run build`

Expected: all commands pass.

```bash
git add src/App.tsx src/features/storefront/ProductCard.tsx src/features/storefront/ProductCatalog.tsx src/features/storefront/ProductDialog.tsx src/features/storefront/ProductCatalog.test.tsx
git commit -m "feat: build premium product catalog"
```

### Task 3: Build cart and remove simulated checkout completion

**Files:**
- Create: `src/features/storefront/CartDrawer.tsx`, `src/features/storefront/CheckoutDialog.tsx`, `src/features/storefront/CartDrawer.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `CartDrawer` receives `isOpen`, `cart`, `total`, `onClose`, `onQuantityChange`, `onRemove`, `onClear`, and `onProceed`.
- `CheckoutDialog` receives `isOpen`, `cart`, `total`, and `onClose`.

- [ ] **Step 1: Write failing cart states.**

```tsx
it('explains an empty cart and lets the shopper return to products', () => {
  render(<CartDrawer isOpen cart={[]} total={0} onClose={vi.fn()} onQuantityChange={vi.fn()} onRemove={vi.fn()} onClear={vi.fn()} onProceed={vi.fn()} />);
  expect(screen.getByText(/seu carrinho está vazio/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ver produtos/i })).toBeEnabled();
});
```

- [ ] **Step 2: Verify RED.**

Run: `npm test -- src/features/storefront/CartDrawer.test.tsx`

Expected: FAIL because `CartDrawer` does not exist.

- [ ] **Step 3: Implement the honest boundary.**

The drawer provides items, quantity updates, remove/clear controls, subtotal, and a disabled checkout route for an empty cart. The checkout dialog may collect contact and payment preference but ends with secure-payment-provider continuation language. It must not create a transaction ID, clear the cart, emit `pushPurchase`, or show a purchase-success message.

- [ ] **Step 4: Remove false-transaction code from `App.tsx`.**

Remove `order`, `isPurchasing`, `purchaseInProgress`, `submitOrder`, `pushPurchase`, `*-fake` payment values, and the simulated-success section. Keep `pushBeginCheckout` when the checkout dialog opens; keep add/remove/view-cart analytics.

- [ ] **Step 5: Verify GREEN and commit.**

Run: `npm test -- src/features/storefront/CartDrawer.test.tsx src/features/storefront/cart.test.ts && npm run typecheck && npm run lint && npm run build`

Expected: all checks pass and `rg -n -i "fake|simulada|compra simulada" src/App.tsx src/features/storefront` has no output.

```bash
git add src/App.tsx src/features/storefront/CartDrawer.tsx src/features/storefront/CheckoutDialog.tsx src/features/storefront/CartDrawer.test.tsx src/features/storefront/cart.ts
git commit -m "feat: add honest checkout flow"
```

### Task 4: Compose the public storefront and isolate operations tooling

**Files:**
- Create: `src/features/storefront/StoreHeader.tsx`, `src/features/storefront/Hero.tsx`, `src/features/storefront/TrustBar.tsx`, `src/features/storefront/StoreHeader.test.tsx`
- Modify: `src/App.tsx`, `src/components/TrackingDebugPanel.tsx`

- [ ] **Step 1: Write the failing header contract test.**

```tsx
it('announces the cart item count', () => {
  render(<StoreHeader cartCount={2} onOpenCart={vi.fn()} onShowProducts={vi.fn()} onShowOffers={vi.fn()} />);
  expect(screen.getByRole('button', { name: /carrinho, 2 itens/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify RED.**

Run: `npm test -- src/features/storefront/StoreHeader.test.tsx`

Expected: FAIL because `StoreHeader` does not exist.

- [ ] **Step 3: Compose the retail shell.**

`StoreHeader` provides TechZone, categories, offers, and accessible cart count. `Hero` uses an existing product image with concise premium Portuguese copy. `TrustBar` presents only operationally defensible confidence cues. Remove `TrackingDebugPanel` and the server-cookie status section from the public composition; persistence effects may remain, but session/timestamp state used only for public debug UI must be deleted.

- [ ] **Step 4: Verify and commit.**

Run: `npm test -- src/features/storefront/StoreHeader.test.tsx && rg -n -i "estudo|teste|tracking playground|checkout fake|pix-fake|estoque fake|cookies de servidor" src/App.tsx src/features/storefront`

Expected: test passes and `rg` finds no forbidden shopper copy.

```bash
git add src/App.tsx src/components/TrackingDebugPanel.tsx src/features/storefront/StoreHeader.tsx src/features/storefront/Hero.tsx src/features/storefront/TrustBar.tsx src/features/storefront/StoreHeader.test.tsx
git commit -m "feat: compose production storefront"
```

### Task 5: Apply Titanium Gallery styles and final verification

**Files:**
- Modify: `src/styles.css`, `src/main.tsx`
- Create: `src/features/storefront/Hero.test.tsx`

- [ ] **Step 1: Write the failing hero image contract.**

```tsx
it('provides product-specific alternative text for the hero image', () => {
  render(<Hero onShowProducts={vi.fn()} onShowOffers={vi.fn()} />);
  expect(screen.getByRole('img', { name: /techzone/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify RED.**

Run: `npm test -- src/features/storefront/Hero.test.tsx`

Expected: FAIL until the final hero contract exists.

- [ ] **Step 3: Implement the Titanium Gallery system.**

Replace `src/styles.css` with semantic OKLCH tokens for canvas, surface, strong surface, ink, muted text, divider, accent, accent ink, and a named z-index scale. Implement fluid typography, light gallery layouts, product-first cards, visible focus styles, responsive grids and overlays, and a `prefers-reduced-motion` block. Keep card radii at 16px or smaller and never pair decorative wide shadows with a border.

- [ ] **Step 4: Run final verification.**

Run: `npm test && npm run typecheck && npm run lint && npm run build`

Expected: all commands pass without warnings.

Run the dev server with `npm run dev -- --host 127.0.0.1`; inspect desktop and 320px widths. Verify keyboard users can open/close the cart and product dialog, select variants, and activate every visible control.

- [ ] **Step 5: Commit the visual system.**

```bash
git add src/styles.css src/main.tsx src/features/storefront
git commit -m "feat: apply titanium gallery storefront design"
```

## Self-Review

- Tasks 2–4 preserve catalogue behavior while stripping public developer/demo surfaces.
- Task 3 prevents the UI from falsely claiming a completed payment.
- Task 5 covers the selected visual language, responsive behavior, and accessibility.
- All interfaces named by a task are defined by the same task or an earlier one.
