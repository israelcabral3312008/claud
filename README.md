# Israel Cabral · Portfólio

Portfólio pessoal com os meus projetos de desenvolvimento web.

## O que tem aqui

| Pasta / arquivo | O que é |
|---|---|
| `index.html` | O portfólio (página inicial do site) |
| `js/config.js` | **Seus dados**: nome, cidade, WhatsApp, Instagram, e-mail e GitHub |
| `css/portfolio.css`, `js/portfolio.js` | Visual e interações do portfólio |
| `img/` | Prévias dos projetos |
| `landing-pages/` | Projeto “Top 10 comércios de Águas Claras”: catálogo + 10 landing pages |

## Como colocar seus contatos

Abra `js/config.js` e preencha:

```js
whatsapp: "5561999998888",   // DDI + DDD + número, só dígitos
instagram: "seu.usuario",    // sem o @
email: "voce@email.com",
```

Quando um campo fica vazio, o botão dele some da página. A seção do Instagram só aparece quando você preenche o usuário.

## Como publicar (GitHub Pages)

1. No GitHub, abra **Settings → Pages**.
2. Em **Branch**, escolha `main` e a pasta `/ (root)`, depois clique em **Save**.
3. Em um ou dois minutos o site fica no ar em:
   - Portfólio: `https://israelcabral3312008.github.io/claud/`
   - Landing pages: `https://israelcabral3312008.github.io/claud/landing-pages/`

## Recursos do portfólio

- Tema claro e escuro, que segue o sistema e guarda a sua escolha
- Título com texto “digitando”, telas que inclinam com o mouse e contadores animados
- Filtro de projetos (Sites e Estudos) e janela de detalhes
- Formulário que monta a mensagem e envia pelo WhatsApp, pelo e-mail ou copia o texto
- Menu de celular, barra de leitura no topo e animações que respeitam “reduzir movimento”
