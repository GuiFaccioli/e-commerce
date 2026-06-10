export type Category = 'Teclados' | 'Mouses' | 'Headsets' | 'Monitores' | 'Mousepads' | 'Webcams' | 'Controles' | 'Acessórios';

export type ColorVariant = {
  id: string;
  label: string;
  colorName: string;
  image: string;
  swatch: string;
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  promotionalPrice?: number;
  description: string;
  image: string;
  colorVariants: ColorVariant[];
  stock: number;
  rating: number;
  tag: string;
  selectedColor?: string;
  selectedImage?: string;
  selectedVariantId?: string;
};

export type CartItem = Product & { quantity: number; cartKey: string; selectedColor: string; selectedImage: string; selectedVariantId: string };

export const categories: Category[] = ['Teclados', 'Mouses', 'Headsets', 'Monitores', 'Mousepads', 'Webcams', 'Controles', 'Acessórios'];

const productImage = (folder: string, file: string) => `/products/${folder}/${file}`;

export const products: Product[] = [
  {
    id: 'TZ-K87',
    name: 'Teclado Mecânico RGB Phantom K87',
    category: 'Teclados',
    price: 429.9,
    promotionalPrice: 349.9,
    description: 'Switches blue, layout compacto TKL e iluminação RGB por tecla.',
    image: productImage('teclado_mecanico_rgb_phantom_k87', 'teclado_mecanico_rgb_phantom_k87_preto_rgb_base.png'),
    colorVariants: [
      { id: 'preto-rgb', label: 'Preto RGB', colorName: 'Preto', image: productImage('teclado_mecanico_rgb_phantom_k87', 'teclado_mecanico_rgb_phantom_k87_preto_rgb_base.png'), swatch: '#111111' },
      { id: 'branco-rgb', label: 'Branco', colorName: 'Branco', image: productImage('teclado_mecanico_rgb_phantom_k87', 'teclado_mecanico_rgb_phantom_k87_branco_rgb.png'), swatch: '#f8fafc' },
      { id: 'rosa-rgb', label: 'Rosa', colorName: 'Rosa', image: productImage('teclado_mecanico_rgb_phantom_k87', 'teclado_mecanico_rgb_phantom_k87_rosa_rgb.png'), swatch: '#f9a8d4' },
      { id: 'lilas-rgb', label: 'Lilás', colorName: 'Roxo', image: productImage('teclado_mecanico_rgb_phantom_k87', 'teclado_mecanico_rgb_phantom_k87_lilas_rgb.png'), swatch: '#c4b5fd' },
    ],
    stock: 18,
    rating: 4.8,
    tag: 'RGB',
  },
  {
    id: 'TZ-MXP',
    name: 'Mouse Gamer Precision X Pro',
    category: 'Mouses',
    price: 259.9,
    promotionalPrice: 219.9,
    description: 'Sensor 26K DPI, 8 botões programáveis e cabo paracord.',
    image: productImage('mouse_gamer_precision_x_pro', 'mouse_gamer_precision_x_pro_preto_rgb_base.png'),
    colorVariants: [
      { id: 'preto-rgb', label: 'Preto RGB', colorName: 'Preto', image: productImage('mouse_gamer_precision_x_pro', 'mouse_gamer_precision_x_pro_preto_rgb_base.png'), swatch: '#111111' },
      { id: 'branco-rgb', label: 'Branco', colorName: 'Branco', image: productImage('mouse_gamer_precision_x_pro', 'mouse_gamer_precision_x_pro_branco_rgb.png'), swatch: '#f8fafc' },
      { id: 'vermelho-preto', label: 'Vermelho', colorName: 'Vermelho', image: productImage('mouse_gamer_precision_x_pro', 'mouse_gamer_precision_x_pro_vermelho_preto_rgb.png'), swatch: '#dc2626' },
      { id: 'azul-preto', label: 'Azul', colorName: 'Azul', image: productImage('mouse_gamer_precision_x_pro', 'mouse_gamer_precision_x_pro_azul_preto_rgb.png'), swatch: '#2563eb' },
    ],
    stock: 32,
    rating: 4.9,
    tag: 'Mais vendido',
  },
  {
    id: 'TZ-HS71', name: 'Headset Surround 7.1 Storm', category: 'Headsets', price: 389.9, description: 'Áudio virtual 7.1, microfone removível e conchas memory foam.', image: productImage('headset_surround_7_1_storm', 'headset_surround_7_1_storm_preto_base.png'), colorVariants: [{ id: 'preto', label: 'Preto', colorName: 'Preto', image: productImage('headset_surround_7_1_storm', 'headset_surround_7_1_storm_preto_base.png'), swatch: '#111111' }], stock: 15, rating: 4.7, tag: 'Pro',
  },
  {
    id: 'TZ-MON27', name: 'Monitor Gamer 27” 165Hz', category: 'Monitores', price: 1899.9, promotionalPrice: 1699.9, description: 'Painel IPS QHD, 1ms e taxa de atualização de 165Hz.', image: productImage('monitor_gamer_27_165hz', 'monitor_gamer_27_165hz_preto_base.png'), colorVariants: [{ id: 'preto', label: 'Preto', colorName: 'Preto', image: productImage('monitor_gamer_27_165hz', 'monitor_gamer_27_165hz_preto_base.png'), swatch: '#111111' }], stock: 7, rating: 4.8, tag: 'Oferta',
  },
  {
    id: 'TZ-MPXL', name: 'Mousepad XL Control Speed', category: 'Mousepads', price: 119.9, promotionalPrice: 89.9, description: 'Superfície híbrida para controle e velocidade em setups amplos.', image: productImage('mousepad_xl_control_speed', 'mousepad_xl_control_speed_preto_base.png'), colorVariants: [{ id: 'preto', label: 'Preto', colorName: 'Preto', image: productImage('mousepad_xl_control_speed', 'mousepad_xl_control_speed_preto_base.png'), swatch: '#111111' }], stock: 44, rating: 4.6, tag: 'Oferta',
  },
  {
    id: 'TZ-WFHD', name: 'Webcam Full HD StreamCam', category: 'Webcams', price: 299.9, description: 'Full HD 1080p com foco automático e tampa de privacidade.', image: productImage('webcam_full_hd_streamcam', 'webcam_full_hd_streamcam_preta_base.png'), colorVariants: [{ id: 'preto', label: 'Preto', colorName: 'Preto', image: productImage('webcam_full_hd_streamcam', 'webcam_full_hd_streamcam_preta_base.png'), swatch: '#111111' }], stock: 21, rating: 4.5, tag: 'Novo',
  },
  {
    id: 'TZ-CWPP', name: 'Controle Wireless Pro Player', category: 'Controles', price: 349.9, promotionalPrice: 299.9, description: 'Conexão 2.4GHz, gatilhos precisos e bateria para longas sessões.', image: productImage('controle_wireless_pro_player', 'controle_wireless_pro_player_preto_base.png'), colorVariants: [{ id: 'preto', label: 'Preto', colorName: 'Preto', image: productImage('controle_wireless_pro_player', 'controle_wireless_pro_player_preto_base.png'), swatch: '#111111' }], stock: 13, rating: 4.6, tag: 'Pro',
  },
  {
    id: 'TZ-HUBC',
    name: 'Hub USB-C Gamer Station',
    category: 'Acessórios',
    price: 189.9,
    description: 'Expansão USB-C com HDMI, USB 3.0 e leitor de cartões.',
    image: productImage('hub_usb_c_gamer_station', 'hub_usb_c_gamer_station_branco_base.png'),
    colorVariants: [
      { id: 'branco', label: 'Branco', colorName: 'Branco', image: productImage('hub_usb_c_gamer_station', 'hub_usb_c_gamer_station_branco_base.png'), swatch: '#f8fafc' },
      { id: 'cinza-espacial', label: 'Cinza', colorName: 'Cinza', image: productImage('hub_usb_c_gamer_station', 'hub_usb_c_gamer_station_cinza_espacial.png'), swatch: '#6b7280' },
      { id: 'grafite', label: 'Grafite', colorName: 'Grafite', image: productImage('hub_usb_c_gamer_station', 'hub_usb_c_gamer_station_grafite.png'), swatch: '#374151' },
      { id: 'azul-marinho', label: 'Azul', colorName: 'Azul', image: productImage('hub_usb_c_gamer_station', 'hub_usb_c_gamer_station_azul_marinho.png'), swatch: '#1e3a8a' },
      { id: 'preto-vermelho', label: 'Preto/Vermelho', colorName: 'Vermelho', image: productImage('hub_usb_c_gamer_station', 'hub_usb_c_gamer_station_preto_vermelho.png'), swatch: '#991b1b' },
    ],
    stock: 25,
    rating: 4.4,
    tag: 'Novo',
  },
  {
    id: 'TZ-MIC', name: 'Microfone Condensador Stream Voice', category: 'Acessórios', price: 499.9, promotionalPrice: 429.9, description: 'Captação cardioide, shock mount e controle de ganho integrado.', image: productImage('microfone_condensador_stream_voice', 'microfone_condensador_stream_voice_preto_base.png'), colorVariants: [{ id: 'preto', label: 'Preto', colorName: 'Preto', image: productImage('microfone_condensador_stream_voice', 'microfone_condensador_stream_voice_preto_base.png'), swatch: '#111111' }], stock: 10, rating: 4.8, tag: 'Stream',
  },
  {
    id: 'TZ-ARM',
    name: 'Suporte Articulado para Monitor',
    category: 'Acessórios',
    price: 279.9,
    description: 'Braço articulado VESA com ajuste de altura e organização de cabos.',
    image: productImage('suporte_articulado_para_monitor', 'suporte_articulado_para_monitor_preto_base.png'),
    colorVariants: [
      { id: 'preto', label: 'Preto', colorName: 'Preto', image: productImage('suporte_articulado_para_monitor', 'suporte_articulado_para_monitor_preto_base.png'), swatch: '#111111' },
      { id: 'branco', label: 'Branco', colorName: 'Branco', image: productImage('suporte_articulado_para_monitor', 'suporte_articulado_para_monitor_branco.png'), swatch: '#f8fafc' },
      { id: 'prata', label: 'Prata', colorName: 'Prata', image: productImage('suporte_articulado_para_monitor', 'suporte_articulado_para_monitor_prata_metalico.png'), swatch: '#c0c0c0' },
      { id: 'preto-vermelho', label: 'Preto/Vermelho', colorName: 'Vermelho', image: productImage('suporte_articulado_para_monitor', 'suporte_articulado_para_monitor_preto_vermelho.png'), swatch: '#dc2626' },
    ],
    stock: 17,
    rating: 4.5,
    tag: 'Setup',
  },
  {
    id: 'TZ-CHAIR',
    name: 'Cadeira Gamer Compact Pro',
    category: 'Acessórios',
    price: 899.9,
    promotionalPrice: 749.9,
    description: 'Ergonomia compacta com almofadas lombar e cervical removíveis.',
    image: productImage('cadeira_gamer_compact_pro', 'cadeira_gamer_compact_pro_preta_base.png'),
    colorVariants: [
      { id: 'preta', label: 'Preta', colorName: 'Preto', image: productImage('cadeira_gamer_compact_pro', 'cadeira_gamer_compact_pro_preta_base.png'), swatch: '#111111' },
      { id: 'branca-cinza', label: 'Branco/Cinza', colorName: 'Branco', image: productImage('cadeira_gamer_compact_pro', 'cadeira_gamer_compact_pro_branca_cinza.png'), swatch: '#e5e7eb' },
      { id: 'preta-vermelha', label: 'Vermelha', colorName: 'Vermelho', image: productImage('cadeira_gamer_compact_pro', 'cadeira_gamer_compact_pro_preta_vermelha.png'), swatch: '#dc2626' },
      { id: 'preta-azul', label: 'Azul', colorName: 'Azul', image: productImage('cadeira_gamer_compact_pro', 'cadeira_gamer_compact_pro_preta_azul.png'), swatch: '#2563eb' },
      { id: 'bege-creme', label: 'Bege', colorName: 'Bege', image: productImage('cadeira_gamer_compact_pro', 'cadeira_gamer_compact_pro_bege_creme.png'), swatch: '#d6c3a3' },
    ],
    stock: 6,
    rating: 4.3,
    tag: 'Oferta',
  },
  {
    id: 'TZ-KIT', name: 'Kit Teclado e Mouse Starter RGB', category: 'Teclados', price: 239.9, promotionalPrice: 199.9, description: 'Combo de entrada com iluminação RGB e mouse 7200 DPI.', image: productImage('kit_teclado_mouse_starter_rgb', 'kit_teclado_mouse_starter_rgb_preto_rgb_base.png'), colorVariants: [{ id: 'preto-rgb', label: 'Preto RGB', colorName: 'Preto', image: productImage('kit_teclado_mouse_starter_rgb', 'kit_teclado_mouse_starter_rgb_preto_rgb_base.png'), swatch: '#111111' }], stock: 29, rating: 4.4, tag: 'Starter',
  },
];
