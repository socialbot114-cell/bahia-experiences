# Bahia Experiences

Site de passeios em Porto Seguro e na Costa do Descobrimento (Bahia, Brasil), com textos em **inglês (EUA)** e **espanhol**, tema claro e escuro, e seções em abas: passeios, guias bilíngues, dicas da cidade, traslados e concierge.

É um site estático (HTML, CSS e JavaScript puros), sem etapa de build.

## Estrutura

```
index.html   Estrutura da página: hero, abas, contato e rodapé
styles.css   Cores do tema claro/escuro, layout e responsividade
content.js   Passeios, galeria, serviços e dicas (EN e ES), preços e e-mail de contato
blog.js      Artigos do blog (EN e ES) e as categorias do blog
shop.js      Catálogo de demo: preços, horários, vagas, cupons e extras
booking.js   Agenda, janela de reserva, carrinho, checkout e minhas reservas (demo)
i18n.js      Textos da interface: botões, títulos de seção e e-mails
app.js       Renderização, troca de idioma e tema, abas e janela do passeio
assets/      Favicon e fotos otimizadas (WebP)
```

## Como editar

- **Preços, horários e vagas:** ficam em `shop.js`. Cada passeio tem `prices` (adulto e criança, em USD; `child: null` para só adultos), `durationMinutes`, `capacity`, `days` (dias da semana, 0 = domingo) e `times` (horários de Bahia). Cupons e extras (`coupons` e `addons`) também ficam lá. Os valores são fictícios, para o modo demo.
- **Sistema de reservas (demo):** o carrinho, o calendário, a agenda e as reservas funcionam só dentro do navegador (`localStorage`). Nada é cobrado e nenhum e-mail é enviado. A lógica está em `booking.js`. Para reservas de verdade, seria preciso um backend com banco de dados, pagamento e envio de confirmação.
- **E-mail de contato:** `contactEmail` em `content.js`.
- **Textos:** cada item tem `en` e `es`. Ao mudar um, mude o outro.
- **Categoria do passeio:** o campo `category` em `content.js` (aparece acima do título do card).
- **Categorias e filtros:** `categories` de cada passeio e a lista `filters` em `content.js`. Os nomes das categorias ficam em `i18n.js` (chaves `cat.*`).
- **Janela do passeio:** `highlights` e `bring` (listas em EN e ES). Preencha `duration`, `included` e `meetingPoint` quando confirmar; enquanto estiverem vazios, a janela mostra que esses detalhes são confirmados antes de reservar.
- **Passos e perguntas frequentes:** as chaves `steps.*` e `faq.*` em `i18n.js`.
- **Blog:** cada artigo é um bloco em `blog.js`. Para publicar um novo, copie um bloco existente, troque o `slug` (ele vira o link `#blog/slug`), escolha a `category` e a `image`, e preencha `en` e `es` com título, resumo e o texto (`p` para parágrafo, `h` para subtítulo, `ul` para lista). O tempo de leitura é calculado sozinho. Não mude o `slug` depois de publicar, senão o link antigo quebra.
- **Categorias do blog:** a lista `categories` em `blog.js`. Os nomes aparecem a partir das chaves `blog.cat.*` em `i18n.js`.
- **Galeria:** a lista `gallery` em `content.js`. Cada item tem o caminho da foto (em `assets/photos/`) e a legenda em EN e ES.
- **Fotos:** coloque a imagem em `assets/photos/` em WebP, com cerca de 1000 px no maior lado, e use o caminho no campo `image`.
- **Fotos:** coloque em `assets/photos/` (WebP, cerca de 1100 px no maior lado) e aponte o campo `image` do passeio.
- **Idioma:** o site abre em inglês, ou em espanhol se o navegador estiver em espanhol. A escolha fica salva. Também funciona com `?lang=es` na URL.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.
