# Top 10 comércios de Águas Claras (Brasília - DF)

Landing pages-modelo feitas para a disciplina de **Desenho Técnico para Web**.
Abra o [`index.html`](index.html) no navegador para ver o catálogo com as 10 páginas.

| # | Comércio | Segmento | Endereço | Telefone | Nota Google (avaliações) |
|---|----------|----------|----------|----------|--------------------------|
| 1 | [Bonnapan](bonnapan/index.html) | Padaria e Confeitaria | R. 22 Norte, 05 - Águas Claras, Brasília - DF | (61) 3253-6638 | 4,4 (3.579) |
| 2 | [Potiguar Padaria e Confeitaria](potiguar/index.html) | Padaria e Confeitaria | Av. das Castanheiras, 1310/1370, Lojas 5/6/7 (Real Esplendor) - Águas Claras, Brasília - DF | (61) 3876-0026 | 4,2 (2.806) |
| 3 | [Pet Happy DF](pet-happy/index.html) | Pet Shop · Banho e Tosa | Rua Le Club - R. 33 Sul, 5 - Lojas 19 e 20, Águas Claras, Brasília - DF, 71930-250 | (61) 3554-9013 | — |
| 4 | [Max Petshop](max-petshop/index.html) | Pet Shop | R. 24 Norte, 9/11 - Loja 37, Águas Claras, Brasília - DF, 71916-750 | (61) 98205-5520 | — |
| 5 | [Ultra Academia](ultra-academia/index.html) | Academia | R. das Paineiras, 06 - One Park Mall, Águas Claras, Brasília - DF | — | — |
| 6 | [Fred Restaurante](fred-restaurante/index.html) | Restaurante | Águas Claras Norte, Brasília - DF | — | 4,9 (86) |
| 7 | [Pizza e Companhia Sul](pizza-e-companhia/index.html) | Pizzaria | Águas Claras Sul, Brasília - DF | — | 4,6 (237) |
| 8 | [Arts Depilação](arts-depilacao/index.html) | Estética · Depilação | Ed. Onix Center, Av. das Castanheiras, Loja 15 - Águas Claras, Brasília - DF | (61) 3435-2648 | 4,8 |
| 9 | [Omega Pneus e Supertroca](omega-pneus/index.html) | Pneus e Troca de Óleo | Av. Jacarandá, 27 - Águas Claras, Brasília - DF | (61) 99616-2886 | 4,3 (35) |
| 10 | [Garagem Duas Rodas](garagem-duas-rodas/index.html) | Oficina de Motos | QS 05, Praça Águas Claras - Águas Claras, Brasília - DF | (61) 99835-7599 | — |

## Estrutura

```
landing-pages/
├── index.html          # catálogo: busca, filtros, ordenação e modo grade/lista
├── assets/style.css    # visual compartilhado (cada página define só --a e --ink)
├── assets/app.js       # todas as interações (comentadas por seção)
└── <comercio>/index.html
```

## O que cada página tem

- **Topo com foto** em tela cheia, efeito parallax, nota com estrelas e botões de ação.
- **Faixa de confiança** com contadores animados (nota e número de avaliações).
- **Montador de pedido ou agendamento** que gera a mensagem em tempo real, com prévia
  no estilo de conversa:
  - padarias, pizzaria e pet shop de produtos: itens com botões de + e −;
  - pet shop de banho e tosa, academia, restaurante, estética e oficinas: serviço, data e período.
  - A mensagem pode ser enviada pelo WhatsApp (quando o comércio tem celular), copiada ou
    usada numa ligação.
- **Galeria** com tela cheia: setas do teclado, Esc e arrastar para os lados no celular.
- **Diferenciais**, **perguntas frequentes** (abre uma de cada vez) e **contato com mapa**.
- **Tema claro e escuro**: segue o sistema, e a escolha fica salva no navegador.
- **No celular**: menu próprio, barra fixa com Rota, Ligar e Pedir/Agendar, e botão flutuante.
- Barra de leitura no topo, menu que destaca a seção atual e animações que respeitam
  `prefers-reduced-motion`.

Fotos: imagens ilustrativas do Unsplash. Se alguma não carregar, aparece um fundo
na cor do comércio com o ícone dele.

## Fontes e aviso

Os dados foram levantados em novembro de 2026 em diretórios públicos (Bendito Guia, Guia Telefone,
Wellhub e Foursquare) e podem estar desatualizados. Confira no Google Maps antes de usar.
Estas páginas **não são os sites oficiais** dos estabelecimentos. Os serviços listados são uma sugestão de conteúdo,
e os horários não foram incluídos porque não foram confirmados.
