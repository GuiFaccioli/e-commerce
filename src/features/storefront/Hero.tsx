import { products } from '../../data/products';

type HeroProps = {
  onShowProducts: () => void;
  onShowOffers: () => void;
};

export function Hero({ onShowProducts, onShowOffers }: HeroProps) {
  const featuredProduct = products.find((product) => product.id === 'TZ-MON27') ?? products[0];

  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero__content">
      <p className="hero__kicker">Performance sem ruído</p>
      <h1 id="hero-title">Tecnologia que acompanha o seu próximo nível.</h1>
      <p className="hero__description">Periféricos e hardware selecionados para setups que exigem precisão, conforto e desempenho consistente.</p>
      <div className="hero__actions">
        <button className="button button--primary" onClick={onShowProducts}>Explorar produtos</button>
        <button className="button button--secondary" onClick={onShowOffers}>Ver ofertas</button>
      </div>
    </div>
    <div className="hero__product">
      <img src={featuredProduct.image} alt={`${featuredProduct.name} em destaque`} />
      <div><span>Seleção TechZone</span><strong>{featuredProduct.name}</strong><small>A partir de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(featuredProduct.promotionalPrice ?? featuredProduct.price)}</small></div>
    </div>
  </section>;
}
