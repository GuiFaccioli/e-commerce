# Cart Feedback and Offers — Design Brief

## Feature Summary

Improve two existing storefront interactions without adding visual noise: confirm when an item enters the cart and make the Offers navigation display the discounted catalog subset.

## Primary User Action

Give shoppers immediate confidence that an add-to-cart action succeeded and let them compare discounted products without manually searching the full catalog.

## Design Direction

Stay inside the established Titanium Gallery system. Feedback is local to the action: the clicked button temporarily becomes `Adicionado ✓`; the existing cart counter makes one restrained scale pulse. No toast, banner, modal, or permanent success message is introduced.

## Interaction Model

- An add action records the configured product ID and immediately swaps that product card's primary button label to `Adicionado ✓`.
- The feedback lasts roughly 1.8 seconds, returns to `Adicionar`, and remains accessible through a polite live-status message.
- The cart counter receives the same short visual cue when the cart changes.
- Clicking `Ofertas` sets a dedicated offer-only catalog mode, clears category/search constraints that could hide valid sale items, scrolls to the catalog, and focuses its heading.
- Offer-only mode has an explicit `Ver seleção completa` action that restores the full catalog without losing cart or favorites state.

## States

- **Offer-only with matches:** only products with `promotionalPrice` are shown and the heading says `Ofertas TechZone`.
- **Offer-only with no matches:** show a concise empty state and the restore action.
- **Added product:** one product button and the cart count pulse are active; rapid additions reset the timer to keep feedback coherent.
- **Reduced motion:** label/state change remains, but all scale/transition effects are disabled.

## Accessibility

- The add confirmation is announced with a `role="status"` live region.
- The offer-only heading receives programmatic focus after navigation.
- Controls retain visible keyboard focus and accessible labels.
