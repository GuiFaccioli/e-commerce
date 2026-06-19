import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { categories, products, type CartItem, type ColorVariant, type Product } from './data/products';
import { TrackingDebugPanel } from './components/TrackingDebugPanel';
import { cartValue, pushAddToCart, pushBeginCheckout, pushFilterProducts, pushPageViewCustom, pushPurchase, pushRemoveFromCart, pushSearch, pushSelectItem, pushSelectItemVariant, pushViewCart, pushViewItem } from './analytics/dataLayer';
import { getServerCookieContext, saveServerCookieContext, type ServerCartItem } from './lib/serverCookieContext';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const productPrice = (product: Product) => product.promotionalPrice ?? product.price;

type CheckoutForm = { name: string; email: string; phone: string; payment: string };

function getVariant(product: Product, variantId?: string): ColorVariant {
  return product.colorVariants.find((variant) => variant.id === variantId) ?? product.colorVariants[0];
}

function withVariant(product: Product, variant: ColorVariant): Product {
  return {
    ...product,
    image: variant.image,
    selectedColor: variant.colorName,
    selectedImage: variant.image,
    selectedVariantId: variant.id,
  };
}

function cartItemFromServerCookie(item: ServerCartItem): CartItem[] {
  const product = products.find((candidate) => candidate.id === item.id);
  if (!product) return [];

  const productWithVariant = withVariant(product, getVariant(product, item.variantId));
  return [{
    ...productWithVariant,
    cartKey: `${productWithVariant.id}-${productWithVariant.selectedVariantId}`,
    quantity: item.quantity,
    selectedColor: productWithVariant.selectedColor!,
    selectedImage: productWithVariant.selectedImage!,
    selectedVariantId: productWithVariant.selectedVariantId!,
  }];
}

function App() {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [recentlyViewedProductIds, setRecentlyViewedProductIds] = useState<string[]>([]);
  const [serverSessionId, setServerSessionId] = useState<string | null>(null);
  const [serverContextUpdatedAt, setServerContextUpdatedAt] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [order, setOrder] = useState<{ id: string; total: number } | null>(null);
  const [form, setForm] = useState<CheckoutForm>({ name: '', email: '', phone: '', payment: 'pix-fake' });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const pageViewTracked = useRef(false);
  const purchaseInProgress = useRef(false);
  const serverContextLoaded = useRef(false);

  useEffect(() => {
    if (pageViewTracked.current) return;
    pageViewTracked.current = true;
    pushPageViewCustom(window.location.href, document.title);
  }, []);

  useEffect(() => {
    getServerCookieContext().then((context) => {
      if (!context) {
        serverContextLoaded.current = true;
        return;
      }

      setServerSessionId(context.sessionId);
      setServerContextUpdatedAt(context.lastUpdatedAt);
      setFavoriteProductIds(context.favoriteProductIds);
      setRecentlyViewedProductIds(context.recentlyViewedProductIds);
      setCart(context.cartItems.flatMap((item) => cartItemFromServerCookie(item)));
      serverContextLoaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (!serverContextLoaded.current) return;

    saveServerCookieContext({
      cartItems: cart.map((item) => ({ id: item.id, variantId: item.selectedVariantId, quantity: item.quantity })),
      favoriteProductIds,
      recentlyViewedProductIds,
      lastUpdatedAt: null,
    }).then((context) => {
      if (!context) return;
      setServerSessionId(context.sessionId);
      setServerContextUpdatedAt(context.lastUpdatedAt);
    });
  }, [cart, favoriteProductIds, recentlyViewedProductIds]);

  const filteredProducts = useMemo(() => {
    const visibleProducts = products.filter((product) => {
      const matchesCategory = category === 'Todos' || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return [...visibleProducts].sort((first, second) => {
      const firstFavoriteIndex = favoriteProductIds.indexOf(first.id);
      const secondFavoriteIndex = favoriteProductIds.indexOf(second.id);

      if (firstFavoriteIndex === -1 && secondFavoriteIndex === -1) return 0;
      if (firstFavoriteIndex === -1) return 1;
      if (secondFavoriteIndex === -1) return -1;
      return firstFavoriteIndex - secondFavoriteIndex;
    });
  }, [category, favoriteProductIds, search]);

  const cartTotal = cartValue(cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const offers = products.filter((product) => product.promotionalPrice);
  const recentlyViewedProducts = recentlyViewedProductIds.flatMap((productId) => products.find((product) => product.id === productId) ?? []);
  const formattedServerContextUpdatedAt = serverContextUpdatedAt ? new Date(serverContextUpdatedAt).toLocaleString('pt-BR') : 'ainda não sincronizado';

  function selectedProduct(product: Product) {
    return withVariant(product, getVariant(product, selectedVariants[product.id]));
  }

  function scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  function countFilteredProducts(nextCategory: string, nextSearch: string) {
    return products.filter((product) => {
      const matchesCategory = nextCategory === 'Todos' || product.category === nextCategory;
      const matchesSearch = product.name.toLowerCase().includes(nextSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    }).length;
  }

  function chooseCategory(next: string) {
    const normalizedSearch = search.trim();
    setCategory(next);
    pushFilterProducts(next, normalizedSearch, countFilteredProducts(next, normalizedSearch));
  }

  function handleSearch(value: string) {
    const normalizedSearch = value.trim();
    setSearch(value);
    pushFilterProducts(category, normalizedSearch, countFilteredProducts(category, normalizedSearch));
    if (normalizedSearch.length > 1) pushSearch(normalizedSearch);
  }

  function toggleFavorite(productId: string) {
    setFavoriteProductIds((current) => {
      if (current.includes(productId)) return current.filter((id) => id !== productId);
      return [...current, productId];
    });
  }

  function rememberViewedProduct(productId: string) {
    setRecentlyViewedProductIds((current) => [productId, ...current.filter((id) => id !== productId)].slice(0, 4));
  }

  function chooseVariant(product: Product, variant: ColorVariant) {
    const currentVariant = getVariant(product, selectedVariants[product.id]);
    if (currentVariant.id === variant.id) return;

    setSelectedVariants((current) => ({ ...current, [product.id]: variant.id }));
    pushSelectItemVariant(withVariant(product, variant));
  }

  function viewDetails(product: Product) {
    const productWithVariant = selectedProduct(product);
    pushSelectItem(productWithVariant);
    pushViewItem(productWithVariant);
    rememberViewedProduct(product.id);
    setSelected(product);
  }

  function addToCart(product: Product) {
    const productWithVariant = selectedProduct(product);
    const cartKey = `${productWithVariant.id}-${productWithVariant.selectedVariantId}`;

    setCart((current) => {
      const exists = current.find((item) => item.cartKey === cartKey);
      if (exists) return current.map((item) => item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...productWithVariant, cartKey, quantity: 1, selectedColor: productWithVariant.selectedColor!, selectedImage: productWithVariant.selectedImage!, selectedVariantId: productWithVariant.selectedVariantId! }];
    });
    pushAddToCart(productWithVariant);
  }

  function changeQuantity(product: CartItem, delta: number) {
    if (delta < 0) pushRemoveFromCart(product, 1);
    if (delta > 0) pushAddToCart(product, 1);
    setCart((current) => current.flatMap((item) => {
      if (item.cartKey !== product.cartKey) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  }

  function removeItem(product: CartItem) {
    pushRemoveFromCart(product, product.quantity);
    setCart((current) => current.filter((item) => item.cartKey !== product.cartKey));
  }

  function openCart() {
    setCartOpen(true);
    pushViewCart(cart);
  }

  function beginCheckout() {
    if (!cart.length) return;
    setCheckoutOpen(true);
    setCartOpen(false);
    pushBeginCheckout(cart);
  }

  function submitOrder(event: FormEvent) {
    event.preventDefault();
    if (!cart.length || purchaseInProgress.current) return;

    purchaseInProgress.current = true;
    setIsPurchasing(true);
    const transactionId = `TZ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const purchasedItems = [...cart];
    const total = cartValue(purchasedItems);

    pushPurchase(transactionId, purchasedItems);
    setOrder({ id: transactionId, total });
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setForm({ name: '', email: '', phone: '', payment: 'pix-fake' });
    window.setTimeout(() => {
      purchaseInProgress.current = false;
      setIsPurchasing(false);
    }, 500);
  }

  function ColorOptions({ product, showLabels = true }: { product: Product; showLabels?: boolean }) {
    const activeVariant = getVariant(product, selectedVariants[product.id]);

    return <div className="color-options" aria-label={`Cores de ${product.name}`}>
      {product.colorVariants.map((variant) => <button
        type="button"
        key={variant.id}
        className={`color-option ${activeVariant.id === variant.id ? 'color-option-selected' : ''}`}
        onClick={(event) => {
          event.stopPropagation();
          chooseVariant(product, variant);
        }}
        title={variant.label}
        aria-label={`Selecionar cor ${variant.label}`}
      >
        <span className="color-swatch" style={{ backgroundColor: variant.swatch }} />
        {showLabels && <span>{variant.label}</span>}
      </button>)}
    </div>;
  }

  return <>
    <header className="header">
      <a className="logo" href="#top">TechZone <span>Periféricos</span></a>
      <nav>
        <button onClick={scrollToProducts}>Produtos</button>
        <button onClick={() => { chooseCategory('Todos'); document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' }); }}>Ofertas</button>
        <button className="cart-link" onClick={openCart}>Carrinho ({cartCount})</button>
      </nav>
    </header>

    <main id="top">
      <section className="hero">
        <div>
          <p className="eyebrow">Loja fake para estudo de analytics</p>
          <h1>Periféricos para setup gamer e produtividade</h1>
          <p>Explore uma vitrine fictícia com carrinho, checkout simulado e eventos GA4 e-commerce preparados em <code>window.dataLayer</code>.</p>
          <div className="actions"><button className="btn primary" onClick={scrollToProducts}>Ver produtos</button><button className="btn outline" onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}>Ver ofertas</button></div>
        </div>
        <div className="hero-card"><span>RGB</span><strong>TechZone Lab</strong><small>tracking playground</small></div>
      </section>

      {order && <section className="success"><p className="eyebrow">Confirmação</p><h2>Compra simulada realizada com sucesso</h2><p>Pedido: <strong>{order.id}</strong></p><p>Total: <strong>{brl.format(order.total)}</strong></p><button className="btn primary" onClick={() => { setOrder(null); scrollToProducts(); }}>Voltar para loja</button></section>}

      <section className="filters" id="products">
        <div><p className="eyebrow">Filtros / Categorias</p><h2>Produtos em destaque</h2></div>
        <input aria-label="Buscar produto" placeholder="Buscar por nome do produto" value={search} onChange={(event) => handleSearch(event.target.value)} />
        <div className="chips"><button className={category === 'Todos' ? 'active' : ''} onClick={() => chooseCategory('Todos')}>Todos</button>{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => chooseCategory(item)}>{item}</button>)}</div>
      </section>

      <section className="grid">
        {filteredProducts.map((product) => {
          const productWithVariant = selectedProduct(product);
          const isFavorite = favoriteProductIds.includes(product.id);

          return <article className="product-card" key={product.id} onClick={() => pushSelectItem(productWithVariant)}>
            <div className="product-image-wrap"><button
              type="button"
              className={`favorite-button ${isFavorite ? 'favorite-button-active' : ''}`}
              onClick={(event) => {
                event.stopPropagation();
                toggleFavorite(product.id);
              }}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >★</button><img className="product-image" src={productWithVariant.image} alt={`${product.name} - ${productWithVariant.selectedColor}`} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><em>{product.tag}</em></div>
            <p className="category">{product.category} · ★ {product.rating}</p>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <ColorOptions product={product} showLabels={false} />
            <div className="price">{product.promotionalPrice && <del>{brl.format(product.price)}</del>}<strong>{brl.format(productPrice(product))}</strong></div>
            <small>Estoque fake: {product.stock}</small>
            <div className="card-actions"><button className="btn outline-light" onClick={(event) => { event.stopPropagation(); viewDetails(product); }}>Ver detalhes</button><button className="btn primary" onClick={(event) => { event.stopPropagation(); addToCart(product); }}>Carrinho</button></div>
          </article>;
        })}
      </section>

      <section className="offers" id="offers"><p className="eyebrow">Ofertas</p><h2>{offers.length} periféricos com preço promocional</h2><p>Produtos fictícios para validar eventos de seleção, detalhe e adição ao carrinho.</p></section>

      <section className="server-context">
        <p className="eyebrow">Cookies de servidor</p>
        <h2>Contexto lembrado pela API</h2>
        <p>O frontend envia carrinho, favoritos e produtos vistos para <code>/api/server-cookies/context</code>. O servidor grava cookies <code>HttpOnly</code> e devolve o estado por API.</p>
        <div className="server-context-grid">
          <span><strong>Sessão</strong>{serverSessionId ?? 'aguardando API'}</span>
          <span><strong>Carrinho</strong>{cartCount} item(ns)</span>
          <span><strong>Favoritos</strong>{favoriteProductIds.length} produto(s)</span>
          <span><strong>Último sync</strong>{formattedServerContextUpdatedAt}</span>
          <span><strong>Vistos recentemente</strong>{recentlyViewedProducts.length ? recentlyViewedProducts.map((product) => product.name).join(', ') : 'nenhum ainda'}</span>
        </div>
      </section>
    </main>

    <aside className={`drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
      <div className="drawer-head"><h2>Carrinho</h2><button onClick={() => setCartOpen(false)}>Fechar</button></div>
      {!cart.length ? <p>Seu carrinho está vazio.</p> : cart.map((item) => <div className="cart-item" key={item.cartKey}>
        <img className="cart-thumb" src={item.selectedImage} alt={`${item.name} - ${item.selectedColor}`} />
        <div><strong>{item.name}</strong><span>Cor: {item.selectedColor}</span><span>{brl.format(productPrice(item))}</span></div>
        <div className="qty"><button onClick={() => changeQuantity(item, -1)}>-</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item, 1)}>+</button></div>
        <button onClick={() => removeItem(item)}>Remover</button>
      </div>)}
      <div className="subtotal"><span>Subtotal</span><strong>{brl.format(cartTotal)}</strong></div>
      <div className="drawer-actions"><button className="btn outline-light" onClick={() => setCartOpen(false)}>Continuar comprando</button><button className="btn outline-light" onClick={() => { cart.forEach((item) => pushRemoveFromCart(item, item.quantity)); setCart([]); }}>Limpar</button><button className="btn primary" onClick={beginCheckout}>Finalizar compra</button></div>
    </aside>

    {selected && (() => {
      const modalProduct = selectedProduct(selected);
      return <div className="modal" role="dialog" aria-modal="true"><article><button className="close" onClick={() => setSelected(null)}>×</button><div className="product-image-wrap product-image-wrap-large"><img className="product-image" src={modalProduct.image} alt={`${selected.name} - ${modalProduct.selectedColor}`} /><em>{selected.tag}</em></div><p className="category">{selected.category} · ★ {selected.rating}</p><h2>{selected.name}</h2><p>{selected.description}</p><ColorOptions product={selected} /><p>Cor selecionada: <strong>{modalProduct.selectedColor}</strong></p><p>Estoque fake: {selected.stock} unidades</p><div className="price"><strong>{brl.format(productPrice(selected))}</strong></div><button className="btn primary" onClick={() => addToCart(selected)}>Adicionar ao carrinho</button></article></div>;
    })()}

    {checkoutOpen && <div className="modal" role="dialog" aria-modal="true"><form className="checkout" onSubmit={submitOrder}><button type="button" className="close" onClick={() => setCheckoutOpen(false)}>×</button><p className="eyebrow">Checkout fake</p><h2>Finalizar compra</h2><input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input required placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}><option value="pix-fake">Pix fake</option><option value="cartao-fake">Cartão fake</option><option value="boleto-fake">Boleto fake</option></select><div className="summary"><strong>Resumo do pedido</strong>{cart.map((item) => <span key={item.cartKey}>{item.quantity}x {item.name} · {item.selectedColor}</span>)}<b>Total: {brl.format(cartTotal)}</b></div><button className="btn primary" type="submit" disabled={isPurchasing}>Comprar agora</button></form></div>}
    <TrackingDebugPanel />
  </>;
}

export default App;
