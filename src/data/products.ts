export type Category = 'Teclados' | 'Mouses' | 'Headsets' | 'Monitores' | 'Mousepads' | 'Webcams' | 'Controles' | 'Acessórios';

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  promotionalPrice?: number;
  description: string;
  image: string;
  stock: number;
  rating: number;
  tag: string;
};

export type CartItem = Product & { quantity: number };

export const categories: Category[] = ['Teclados', 'Mouses', 'Headsets', 'Monitores', 'Mousepads', 'Webcams', 'Controles', 'Acessórios'];

export const products: Product[] = [
  { id: 'TZ-K87', name: 'Teclado Mecânico RGB Phantom K87', category: 'Teclados', price: 429.9, promotionalPrice: 349.9, description: 'Switches blue, layout compacto TKL e iluminação RGB por tecla.', image: 'K87', stock: 18, rating: 4.8, tag: 'RGB' },
  { id: 'TZ-MXP', name: 'Mouse Gamer Precision X Pro', category: 'Mouses', price: 259.9, promotionalPrice: 219.9, description: 'Sensor 26K DPI, 8 botões programáveis e cabo paracord.', image: 'X PRO', stock: 32, rating: 4.9, tag: 'Mais vendido' },
  { id: 'TZ-HS71', name: 'Headset Surround 7.1 Storm', category: 'Headsets', price: 389.9, description: 'Áudio virtual 7.1, microfone removível e conchas memory foam.', image: '7.1', stock: 15, rating: 4.7, tag: 'Pro' },
  { id: 'TZ-MON27', name: 'Monitor Gamer 27” 165Hz', category: 'Monitores', price: 1899.9, promotionalPrice: 1699.9, description: 'Painel IPS QHD, 1ms e taxa de atualização de 165Hz.', image: '165Hz', stock: 7, rating: 4.8, tag: 'Oferta' },
  { id: 'TZ-MPXL', name: 'Mousepad XL Control Speed', category: 'Mousepads', price: 119.9, promotionalPrice: 89.9, description: 'Superfície híbrida para controle e velocidade em setups amplos.', image: 'XL', stock: 44, rating: 4.6, tag: 'Oferta' },
  { id: 'TZ-WFHD', name: 'Webcam Full HD StreamCam', category: 'Webcams', price: 299.9, description: 'Full HD 1080p com foco automático e tampa de privacidade.', image: 'FHD', stock: 21, rating: 4.5, tag: 'Novo' },
  { id: 'TZ-CWPP', name: 'Controle Wireless Pro Player', category: 'Controles', price: 349.9, promotionalPrice: 299.9, description: 'Conexão 2.4GHz, gatilhos precisos e bateria para longas sessões.', image: 'PRO', stock: 13, rating: 4.6, tag: 'Pro' },
  { id: 'TZ-HUBC', name: 'Hub USB-C Gamer Station', category: 'Acessórios', price: 189.9, description: 'Expansão USB-C com HDMI, USB 3.0 e leitor de cartões.', image: 'USB-C', stock: 25, rating: 4.4, tag: 'Novo' },
  { id: 'TZ-MIC', name: 'Microfone Condensador Stream Voice', category: 'Acessórios', price: 499.9, promotionalPrice: 429.9, description: 'Captação cardioide, shock mount e controle de ganho integrado.', image: 'MIC', stock: 10, rating: 4.8, tag: 'Stream' },
  { id: 'TZ-ARM', name: 'Suporte Articulado para Monitor', category: 'Acessórios', price: 279.9, description: 'Braço articulado VESA com ajuste de altura e organização de cabos.', image: 'ARM', stock: 17, rating: 4.5, tag: 'Setup' },
  { id: 'TZ-CHAIR', name: 'Cadeira Gamer Compact Pro', category: 'Acessórios', price: 899.9, promotionalPrice: 749.9, description: 'Ergonomia compacta com almofadas lombar e cervical removíveis.', image: 'SEAT', stock: 6, rating: 4.3, tag: 'Oferta' },
  { id: 'TZ-KIT', name: 'Kit Teclado e Mouse Starter RGB', category: 'Teclados', price: 239.9, promotionalPrice: 199.9, description: 'Combo de entrada com iluminação RGB e mouse 7200 DPI.', image: 'KIT', stock: 29, rating: 4.4, tag: 'Starter' },
];
