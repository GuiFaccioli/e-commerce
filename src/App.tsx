import { useEffect, useMemo, useRef, useState } from 'react';
import { categories, products, type CartItem, type ColorVariant, type Product } from './data/products';
import { Hero } from './features/storefront/Hero';
import { addCartItem, updateCartQuantity } from './features/storefront/cart';
import { sortByFavorites } from './features/storefront/catalog';
import { filterOfferProducts } from './features/storefront/offers';
import { createAddFeedback, type AddFeedback } from './features/storefront/feedback';
import { cartValue, pushAddToCart, pushBeginCheckout, pushFilterProducts, pushPageViewCustom, pushRemoveFromCart, pushSearch, pushSelectItem, pushSelectItemVariant, pushViewCart, pushViewItem } from './analytics/dataLayer';
import { getServerCookieContext, saveServerCookieContext, type ServerCartItem } from './lib/serverCookieContext';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const priceOf = (product: Product) => product.promotionalPrice ?? product.price;

function variantOf(product: Product, variantId?: string): ColorVariant {
  return product.colorVariants.find((variant) => variant.id === variantId) ?? product.colorVariants[0];
}

function selectedProduct(product: Product, variantId?: string): Product {
  const variant = variantOf(product, variantId);
  return { ...product, image: variant.image, selectedColor: variant.colorName, selectedImage: variant.image, selectedVariantId: variant.id };
}

function restoreItem(item: ServerCartItem): CartItem[] {
  const product = products.find((candidate) => candidate.id === item.id);
  if (!product) return [];
  const selected = selectedProduct(product, item.variantId);
  return [{ ...selected, cartKey: `${selected.id}-${selected.selectedVariantId}`, quantity: item.quantity, selectedColor: selected.selectedColor!, selectedImage: selected.selectedImage!, selectedVariantId: selected.selectedVariantId! }];
}

function App() {
  const [category, setCategory] = useState('Todos');
  const [catalogMode, setCatalogMode] = useState<'all' | 'offers'>('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [recentlyViewedProductIds, setRecentlyViewedProductIds] = useState<string[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [addFeedback, setAddFeedback] = useState<AddFeedback | null>(null);
  const pageViewTracked = useRef(false);
  const contextLoaded = useRef(false);
  const feedbackTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (pageViewTracked.current) return;
    pageViewTracked.current = true;
    pushPageViewCustom(window.location.href, document.title);
  }, []);

  useEffect(() => () => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current);
  }, []);

  useEffect(() => {
    getServerCookieContext().then((context) => {
      if (context) {
        setFavoriteProductIds(context.favoriteProductIds);
        setRecentlyViewedProductIds(context.recentlyViewedProductIds);
        setCart(context.cartItems.flatMap(restoreItem));
      }
      contextLoaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (!contextLoaded.current) return;
    saveServerCookieContext({
      cartItems: cart.map(({ id, selectedVariantId, quantity }) => ({ id, variantId: selectedVariantId, quantity })),
      favoriteProductIds,
      recentlyViewedProductIds,
      lastUpdatedAt: null,
    });
  }, [cart, favoriteProductIds, recentlyViewedProductIds]);

  const visibleProducts = useMemo(() => sortByFavorites((catalogMode === 'offers' ? filterOfferProducts(products) : products).filter((product) => {
    const matchesCategory = category === 'Todos' || product.category === category;
    const matchesSearch = product.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'));
    return matchesCategory && matchesSearch;
  }), favoriteProductIds), [catalogMode, category, favoriteProductIds, search]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cartValue(cart);
  const offers = products.filter((product) => product.promotionalPrice);

  function toProducts() { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }
  function activateOffers() {
    setCatalogMode('offers');
    setCategory('Todos');
    setSearch('');
    window.setTimeout(() => {
      const heading = document.getElementById('catalog-title');
      heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      heading?.focus();
    }, 0);
  }
  function showAllProducts() { setCatalogMode('all'); }
  function chooseCategory(next: string) {
    setCategory(next);
    pushFilterProducts(next, search.trim(), products.filter((product) => (next === 'Todos' || product.category === next) && product.name.toLowerCase().includes(search.trim().toLowerCase())).length);
  }
  function chooseVariant(product: Product, variant: ColorVariant) {
    setSelectedVariants((current) => ({ ...current, [product.id]: variant.id }));
    pushSelectItemVariant(selectedProduct(product, variant.id));
  }
  function addProduct(product: Product) {
    const configured = selectedProduct(product, selectedVariants[product.id]);
    setCart((current) => addCartItem(current, configured));
    pushAddToCart(configured);
    setAddFeedback(createAddFeedback(product.id));
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setAddFeedback(null), 1800);
  }
  function showProduct(product: Product) {
    const configured = selectedProduct(product, selectedVariants[product.id]);
    pushSelectItem(configured);
    pushViewItem(configured);
    setRecentlyViewedProductIds((current) => [product.id, ...current.filter((id) => id !== product.id)].slice(0, 4));
    setSelected(product);
  }
  function openCart() { setCartOpen(true); pushViewCart(cart); }
  function changeQuantity(item: CartItem, delta: number) {
    setCart((current) => updateCartQuantity(current, item.cartKey, delta));
    if (delta > 0) pushAddToCart(item, 1);
    if (delta < 0) pushRemoveFromCart(item, 1);
  }

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="TechZone, início">TECHZONE</a>
      <nav aria-label="Navegação principal"><button onClick={toProducts}>Produtos</button><button onClick={activateOffers}>Ofertas</button></nav>
      <button className={`cart-button ${addFeedback ? 'has-feedback' : ''}`} onClick={openCart} aria-label={`Carrinho, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}>Carrinho <span>{cartCount}</span></button>
    </header>

    <main id="top">
      <Hero onShowProducts={toProducts} onShowOffers={activateOffers} />
      <section className="trust-bar" aria-label="Benefícios de comprar na TechZone"><p><strong>Compra protegida</strong><span>Ambiente seguro para sua jornada</span></p><p><strong>Envio nacional</strong><span>Atendimento para todo o Brasil</span></p><p><strong>Troca descomplicada</strong><span>Suporte quando você precisar</span></p></section>
      <section className="catalog" id="products" aria-labelledby="catalog-title">
        <div className="catalog__heading"><div><p className="section-label">{catalogMode === 'offers' ? 'Condições especiais' : 'Seleção TechZone'}</p><h2 id="catalog-title" tabIndex={-1}>{catalogMode === 'offers' ? 'Ofertas TechZone' : 'Monte um setup à sua altura.'}</h2></div><label className="search"><span>Buscar produto</span><input value={search} onChange={(event) => { setSearch(event.target.value); if (event.target.value.trim().length > 1) pushSearch(event.target.value.trim()); }} placeholder="Busque por mouse, teclado, monitor..." /></label></div>
        {catalogMode === 'offers' && <button className="catalog-reset" onClick={showAllProducts}>Ver seleção completa</button>}
        <div className="categories" aria-label="Categorias"><button className={category === 'Todos' ? 'is-active' : ''} onClick={() => chooseCategory('Todos')}>Todos</button>{categories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => chooseCategory(item)}>{item}</button>)}</div>
        {!visibleProducts.length ? <div className="empty-state"><h3>Nenhum produto encontrado.</h3><p>Tente outro termo ou veja toda a seleção TechZone.</p><button className="button button--secondary" onClick={() => { setSearch(''); chooseCategory('Todos'); }}>Limpar filtros</button></div> : <div className="product-grid">{visibleProducts.map((product) => {
          const configured = selectedProduct(product, selectedVariants[product.id]);
          const isFavorite = favoriteProductIds.includes(product.id);
          return <article className="product-card" key={product.id}>
            <div className="product-card__image"><img src={configured.image} alt={`${product.name} na cor ${configured.selectedColor}`} loading="lazy" /><span>{product.tag}</span><button className="favorite" aria-pressed={isFavorite} aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`} onClick={() => setFavoriteProductIds((current) => isFavorite ? current.filter((id) => id !== product.id) : [...current, product.id])}>♥</button></div>
            <p className="product-card__category">{product.category} · {product.rating.toFixed(1)} ★</p><h3>{product.name}</h3><p className="product-card__description">{product.description}</p>
            <div className="variants" aria-label={`Cores de ${product.name}`}>{product.colorVariants.map((variant) => <button type="button" key={variant.id} className={configured.selectedVariantId === variant.id ? 'is-selected' : ''} aria-label={`Selecionar cor ${variant.label}`} onClick={() => chooseVariant(product, variant)}><span style={{ backgroundColor: variant.swatch }} /></button>)}</div>
            <div className="price">{product.promotionalPrice && <del>{brl.format(product.price)}</del>}<strong>{brl.format(priceOf(product))}</strong></div>
            <div className="product-card__actions"><button className="button button--secondary" onClick={() => showProduct(product)}>Detalhes</button><button className={`button button--primary ${addFeedback?.productId === product.id ? 'is-added' : ''}`} onClick={() => addProduct(product)}>{addFeedback?.productId === product.id ? 'Adicionado ✓' : 'Adicionar'}</button></div>
          </article>;
        })}</div>}
      </section>
      <section className="offer-band" id="offers"><p className="section-label">Ofertas selecionadas</p><h2>Desempenho de ponta, escolhas certeiras.</h2><p>{offers.length} produtos com condições especiais para elevar seu setup.</p><button className="button button--inverse" onClick={activateOffers}>Ver ofertas</button></section>
    </main>

    <aside className={`cart-drawer ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen} aria-label="Carrinho de compras">
      <div className="drawer__header"><div><p className="section-label">Seu carrinho</p><h2>{cartCount} {cartCount === 1 ? 'item' : 'itens'}</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho">×</button></div>
      {!cart.length ? <div className="empty-state"><h3>Seu carrinho está vazio.</h3><p>Explore equipamentos para o seu próximo setup.</p><button className="button button--primary" onClick={() => { setCartOpen(false); toProducts(); }}>Ver produtos</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.cartKey}><img src={item.selectedImage} alt={`${item.name} na cor ${item.selectedColor}`} /><div><strong>{item.name}</strong><span>{item.selectedColor}</span><b>{brl.format(priceOf(item))}</b></div><div className="quantity"><button onClick={() => changeQuantity(item, -1)} aria-label={`Diminuir quantidade de ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item, 1)} aria-label={`Aumentar quantidade de ${item.name}`}>+</button></div><button className="text-button" onClick={() => { setCart((current) => current.filter((candidate) => candidate.cartKey !== item.cartKey)); pushRemoveFromCart(item, item.quantity); }}>Remover</button></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>{brl.format(total)}</strong></div><div className="drawer__actions"><button className="button button--secondary" onClick={() => setCartOpen(false)}>Continuar comprando</button><button className="button button--primary" onClick={() => { setCheckoutOpen(true); setCartOpen(false); pushBeginCheckout(cart); }}>Ir para pagamento</button></div></>}
    </aside>
    {cartOpen && <button className="backdrop" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho" />}

    {selected && <div className="dialog-backdrop" role="presentation"><section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="icon-button" onClick={() => setSelected(null)} aria-label="Fechar detalhes">×</button><img src={selectedProduct(selected, selectedVariants[selected.id]).image} alt={`${selected.name} em detalhe`} /><div><p className="section-label">{selected.category}</p><h2 id="detail-title">{selected.name}</h2><p>{selected.description}</p><p className="detail-price">{brl.format(priceOf(selected))}</p><button className="button button--primary" onClick={() => { addProduct(selected); setSelected(null); }}>Adicionar ao carrinho</button></div></section></div>}
    {checkoutOpen && <div className="dialog-backdrop" role="presentation"><section className="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Fechar pagamento">×</button><p className="section-label">Pagamento seguro</p><h2 id="checkout-title">Quase lá.</h2><p>Você será direcionado para o ambiente seguro de pagamento para concluir seu pedido.</p><div className="checkout-summary"><span>Subtotal</span><strong>{brl.format(total)}</strong></div><button className="button button--primary" onClick={() => setCheckoutOpen(false)}>Continuar quando disponível</button></section></div>}
    <p className="sr-status" role="status" aria-live="polite">{addFeedback?.message ?? ''}</p>
  </>;
}

export default App;
