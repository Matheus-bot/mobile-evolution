# 01 — Estrutura do Projeto

## Árvore de pastas completa

```
ProjetoRevisão/
├── index.html                  ← ponto de entrada único do site
├── docs/                       ← esta documentação
│   ├── 00-overview.md
│   ├── 01-project-structure.md
│   ├── 02-html.md
│   ├── 03-css.md
│   ├── 04-javascript.md
│   ├── 05-components.md
│   ├── 06-animations.md
│   ├── 07-best-practices.md
│   ├── 08-learning-notes.md
│   └── glossary.md
└── assets/
    ├── css/
    │   └── style.css           ← todo o CSS do site (um único arquivo)
    ├── js/
    │   ├── main.js              ← orquestrador: roda em toda seção
    │   ├── timeline.js          ← só a seção 02 (Linha do Tempo)
    │   ├── comparison.js        ← só a seção 06 (Comparação)
    │   ├── debate.js            ← só a seção 07 (Debate)
    │   ├── charts.js            ← só a seção 09 (Mercado)
    │   └── quiz.js              ← só a seção 10 (Qual escolher?)
    └── img/
        ├── logos/                ← reservada para logos (não usada — ver nota abaixo)
        └── mockups/               ← reservada para mockups (não usada — ver nota abaixo)
```

> **Nota sobre `assets/img/`**: as pastas `logos/` e `mockups/` foram criadas no planejamento inicial para guardar imagens reais (logo dos SOs, screenshot do Android Studio). Durante a implementação, optamos por **construir esses elementos em HTML/CSS puro** (o "mockup" da IDE na seção 03 e os "badges" coloridos com ícones Lucide na seção 08), para não depender de arquivos de imagem externos nem de direitos de uso de marca. As pastas continuam no projeto caso você queira substituir por imagens reais no futuro — ver [07-best-practices.md](./07-best-practices.md#por-que-nao-usamos-imagens-reais).

## Por que essa organização?

O projeto segue a convenção mais comum para sites estáticos simples:

- **Um `index.html` na raiz** — é o arquivo que o navegador abre primeiro. Fica na raiz (e não dentro de uma subpasta) porque é o "documento" principal do site.
- **`assets/`** — pasta guarda-chuva para tudo que não é HTML: estilos, scripts e imagens. Separar por tipo (`css/`, `js/`, `img/`) facilita achar as coisas conforme o projeto cresce.
- **Um arquivo CSS só** (`style.css`) — como o site é de porte pequeno/médio (uma página, 12 seções), não compensou dividir o CSS em vários arquivos (isso exigiria várias tags `<link>` ou uma ferramenta de build para juntar tudo). Dentro do arquivo, no entanto, o conteúdo é organizado em blocos comentados por seção (ver [03-css.md](./03-css.md)).
- **Vários arquivos JS, um por seção "especial"** — ao contrário do CSS, o JavaScript **foi** dividido em arquivos pequenos. A razão: cada seção com JS próprio (timeline, comparação, debate, gráficos, quiz) tem uma responsabilidade isolada e não depende das outras. Se você quisesse remover a seção do debate inteira, bastaria apagar a `<section id="debate">` do HTML e a tag `<script src="assets/js/debate.js">` — nada mais quebra.

## Tabela: arquivo por arquivo

| Arquivo | Para que serve | Quem o utiliza (carrega) | Do que ele depende |
|---|---|---|---|
| `index.html` | Estrutura e conteúdo de todas as 12 seções | O navegador (é o arquivo aberto diretamente) | `style.css` e todos os `.js`, via tags `<link>`/`<script>` |
| `assets/css/style.css` | Todo o visual: cores, tipografia, layout, animações CSS | `index.html`, via `<link rel="stylesheet">` no `<head>` | Nada (CSS puro, sem pré-processador) |
| `assets/js/main.js` | Funcionalidades **globais**: barra de progresso, dots de navegação, ícones Lucide, efeito de tilt 3D, botão do Hero | `index.html`, via `<script src="assets/js/main.js" defer>` | Elementos do HTML com os `id`s `progressBar`, `navDots`, `heroCta`; biblioteca **Lucide** (opcional, verificada com `typeof`) |
| `assets/js/timeline.js` | Anima a barra de progresso vertical da Linha do Tempo (seção 02) | `index.html` | Elementos `.timeline__track` e `#timelineProgress` |
| `assets/js/comparison.js` | Anima as barras divergentes da seção de Comparação (seção 06) | `index.html` | Elementos `.comparator__row` e seus atributos `data-android`/`data-rn` |
| `assets/js/debate.js` | Roda a sequência automática de perguntas do "Quem vence?" (seção 07) | `index.html` | Elementos com os `id`s `debate`, `battleQuestion`, `battleDots`, `battleAndroid`, `battleRN`, `battleResult` |
| `assets/js/charts.js` | Cria os dois gráficos Chart.js da seção de Mercado (seção 09) | `index.html` | Biblioteca **Chart.js** (carregada via CDN); elementos `#marketShareChart` e `#frameworksChart` |
| `assets/js/quiz.js` | Liga o clique de flip nos cards da seção "Qual escolher?" (seção 10) | `index.html` | Elementos `.flip-card` |

## Bibliotecas externas (não fazem parte do repositório)

Nenhuma biblioteca é baixada para dentro do projeto — todas são carregadas via **CDN** (Content Delivery Network), direto no `<head>` ou no fim do `<body>` de `index.html`. Isso significa que **é necessário estar conectado à internet** para o site funcionar 100% (sem internet, o conteúdo e a estrutura aparecem, mas ícones, gráficos, animações de scroll e realce de código não funcionam).

| Biblioteca | Usada em | O que faz |
|---|---|---|
| [AOS](https://michalsnik.github.io/aos/) (Animate On Scroll) | Quase todas as seções | Adiciona a classe `aos-animate` a um elemento quando ele entra na viewport, disparando uma transição CSS |
| [Lucide](https://lucide.dev/) | Ícones em várias seções (`<i data-lucide="...">`) | Substitui as tags `<i data-lucide="nome">` por SVGs reais |
| [Prism.js](https://prismjs.com/) | Seções 04 e 05 (blocos de código) | Faz o realce de sintaxe (syntax highlighting) dentro de `<code class="language-java">` etc. |
| [Chart.js](https://www.chartjs.org/) | Seção 09 (Mercado) | Desenha os gráficos doughnut e de barras no `<canvas>` |

Veja como cada uma é inicializada em [04-javascript.md](./04-javascript.md).

## Ordem de carregamento dos scripts (importante!)

No fim do `<body>` de `index.html`, os scripts aparecem nesta ordem:

```html
<script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
<script src="assets/js/timeline.js" defer></script>
<script src="assets/js/comparison.js" defer></script>
<script src="assets/js/debate.js" defer></script>
<script src="assets/js/charts.js" defer></script>
<script src="assets/js/quiz.js" defer></script>
<script src="assets/js/main.js" defer></script>
```

Repare em dois detalhes:

1. **O AOS não tem `defer`** — ele é carregado de forma síncrona (bloqueante), no ponto exato em que aparece no HTML. Como ele já está no final do `<body>`, o DOM inteiro já existe quando o script roda, então não há problema.
2. **Todos os arquivos próprios têm `defer`** — isso diz ao navegador: "baixe esse script em paralelo, mas só execute depois que o HTML terminar de ser interpretado". Como todos usam `defer`, eles executam **na ordem em que aparecem no HTML**, e sempre depois do HTML pronto — por isso, dentro de cada arquivo, é seguro usar `document.getElementById(...)` sem esperar por `DOMContentLoaded`... **mas usamos esse evento mesmo assim**, por clareza e como boa prática defensiva (ver [07-best-practices.md](./07-best-practices.md)).

Lucide e Prism.js e Chart.js são carregados no `<head>` (também com `defer`), então terminam de baixar/executar antes dos scripts do fim do `<body>` — é por isso que `main.js` consegue chamar `lucide.createIcons()` com segurança.
