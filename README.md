# Bahia Experiences

Site de passeios em Porto Seguro e na Costa do Descobrimento (Bahia, Brasil), com textos em **inglês (EUA)** e **espanhol**, tema claro e escuro, e seções em abas: passeios, guias bilíngues, dicas da cidade, traslados e concierge.

É um site estático (HTML, CSS e JavaScript puros), sem etapa de build.

## Estrutura

```
index.html   Estrutura da página: hero, abas, contato e rodapé
styles.css   Cores do tema claro/escuro, layout e responsividade
content.js   Passeios, serviços e dicas (EN e ES), preços e e-mail de contato
i18n.js      Textos da interface: botões, títulos de seção e e-mails
app.js       Renderização, troca de idioma e tema, abas e janela do passeio
assets/      Favicon e fotos otimizadas (WebP)
```

## Como editar

- **Preços:** em `content.js`, troque `price: null` por um número em USD (por exemplo, `price: 95`). Enquanto estiver `null`, o site mostra "Price on request" (EN) ou "Precio a consultar" (ES).
- **E-mail de contato:** `contactEmail` em `content.js`.
- **Textos:** cada item tem `en` e `es`. Ao mudar um, mude o outro.
- **Categoria do passeio:** o campo `category` em `content.js` (aparece acima do título do card).
- **Passos e perguntas frequentes:** as chaves `steps.*` e `faq.*` em `i18n.js`.
- **Fotos:** coloque em `assets/photos/` (WebP, cerca de 1100 px no maior lado) e aponte o campo `image` do passeio.
- **Idioma:** o site abre em inglês, ou em espanhol se o navegador estiver em espanhol. A escolha fica salva. Também funciona com `?lang=es` na URL.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.
