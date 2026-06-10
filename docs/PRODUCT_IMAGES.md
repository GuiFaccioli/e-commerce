# Imagens de produtos — TechZone Periféricos

As imagens usadas pela UI ficam em:

```txt
public/products/
```

A pasta foi copiada de:

```txt
techzone_product_images_renamed/
```

A pasta original foi mantida no projeto para preservar o manifesto e o índice visual gerados manualmente.

## Padrão de nomes

Os arquivos seguem o padrão:

```txt
produto_nome_cor_variacao.png
```

Exemplo:

```txt
public/products/teclado_mecanico_rgb_phantom_k87/teclado_mecanico_rgb_phantom_k87_branco_rgb.png
```

## Como as imagens são mapeadas

O mapeamento fica em:

```txt
src/data/products.ts
```

Cada produto tem:

- `image`: imagem padrão.
- `colorVariants`: lista de variações com `id`, `label`, `colorName`, `image` e `swatch`.

## Como adicionar nova cor

1. Adicione o arquivo PNG na pasta correta em `public/products/nome_do_produto/`.
2. Atualize `colorVariants` do produto em `src/data/products.ts`.
3. Use nome de cor em português no `colorName`.
4. Defina um `swatch` hexadecimal próximo da cor real.
5. Rode `npm run build`.

## Cuidados para build/deploy

- Use caminhos públicos iniciando com `/products/`.
- Não use imagens externas.
- Não referencie arquivos fora de `public/` diretamente por URL.
- Evite renomear arquivos sem atualizar `src/data/products.ts`.

## Validação no site

1. Abra a loja.
2. Confirme se todos os cards têm imagem.
3. Troque cores em produtos com variações.
4. Abra o modal de detalhes e confira a mesma cor selecionada.
5. Adicione ao carrinho e confira imagem/cor.
6. Finalize compra fake e valide `item_variant` no `window.dataLayer`.
