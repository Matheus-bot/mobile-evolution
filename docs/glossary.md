# Glossário

Dicionário de todos os termos técnicos usados na documentação (`docs/`), em ordem alfabética. Quando um termo tem uma explicação mais longa em outro arquivo, há um link para lá.

---

**AOS (Animate On Scroll)** — Biblioteca JavaScript externa usada no projeto para animar elementos (fade, zoom, slide) conforme entram na área visível da tela durante o scroll. Ver [06-animations.md](./06-animations.md#3-aos-animate-on-scroll--o-fade-padrão-do-site).

**Arrow function** — Sintaxe moderna de função em JavaScript, escrita como `(parametros) => { ... }`. Ver [08-learning-notes.md](./08-learning-notes.md#arrow-functions--).

**Aceleração de hardware (GPU)** — Quando o navegador usa a placa de vídeo para desenhar uma animação, em vez do processador principal, resultando em animações mais suaves. Propriedades como `transform` e `opacity` se beneficiam disso.

**BEM (Block, Element, Modifier)** — Convenção de nomenclatura de classes CSS usada no projeto: `.bloco`, `.bloco__elemento`, `.bloco--modificador`. Ver [05-components.md](./05-components.md#nomenclatura-bem).

**Breakpoint** — O valor de largura de tela (ex.: `900px`) a partir do qual uma media query CSS entra em ação, mudando o layout.

**Callback** — Uma função passada como argumento para outra função, para ser executada mais tarde (ex.: a função passada para `addEventListener` ou `setTimeout`).

**Cascata (CSS)** — O mecanismo pelo qual o navegador decide qual regra CSS "vence" quando várias regras diferentes tentam estilizar o mesmo elemento (baseado em especificidade, ordem, e `!important`).

**CDN (Content Delivery Network)** — Uma rede de servidores usada para hospedar e distribuir arquivos (como bibliotecas JavaScript) de forma rápida ao redor do mundo. O projeto carrega AOS, Lucide, Prism.js e Chart.js via CDN, em vez de baixar os arquivos para dentro do repositório.

**Chart.js** — Biblioteca JavaScript externa usada para desenhar os gráficos (doughnut e barras) da seção Mercado. Ver [01-project-structure.md](./01-project-structure.md#bibliotecas-externas-não-fazem-parte-do-repositório).

**`clamp()`** — Função CSS que recebe um valor mínimo, um preferido e um máximo, usada para tamanhos que se adaptam fluidamente ao tamanho da tela sem precisar de media queries. Ver [08-learning-notes.md](./08-learning-notes.md#clampmínimo-preferido-máximo).

**`classList`** — Propriedade de um elemento HTML em JavaScript que permite adicionar (`.add()`), remover (`.remove()`) ou alternar (`.toggle()`) classes CSS.

**`color-mix()`** — Função CSS moderna que mistura duas cores em uma proporção definida, usada no projeto para gerar o brilho (`box-shadow`) dos ícones da seção Futuro. Ver [03-css.md](./03-css.md#11-important-e-color-mix--dois-casos-pontuais).

**`const`** — Palavra-chave do JavaScript para declarar uma variável que não pode ser reatribuída depois de criada. Ver [08-learning-notes.md](./08-learning-notes.md#const-vs-let).

**Crossfade** — Técnica de transição onde um elemento desaparece (fade out) e, na sequência, um novo conteúdo aparece (fade in) no mesmo lugar. Usada na troca de perguntas da seção Debate.

**Custom property (propriedade customizada)** — O nome técnico oficial para o que geralmente é chamado de "variável CSS" (`--nome: valor;`). Ver [03-css.md](./03-css.md#1-variáveis-design-tokens).

**Data attribute (`data-*`)** — Qualquer atributo HTML que começa com `data-`, usado para guardar informação customizada em um elemento, lida depois via JavaScript (`elemento.dataset`). Ver [02-html.md](./02-html.md) (seção 06 — Comparação) e [08-learning-notes.md](./08-learning-notes.md#elementdataset).

**Degradação graciosa (graceful degradation)** — Prática de projetar um sistema para que, se uma parte falhar (ex.: uma biblioteca externa não carregar), o restante continue funcionando, em vez de quebrar tudo. Ver [07-best-practices.md](./07-best-practices.md#2-guard-clauses-cláusulas-de-guarda).

**`defer`** — Atributo de uma tag `<script>` que diz ao navegador para baixar o arquivo em paralelo com o HTML, mas só executá-lo depois que o HTML terminar de ser interpretado, respeitando a ordem em que os scripts aparecem no documento. Ver [01-project-structure.md](./01-project-structure.md#ordem-de-carregamento-dos-scripts-importante).

**DOM (Document Object Model)** — A representação da página HTML como uma árvore de objetos que o JavaScript consegue ler e modificar. "Manipular o DOM" significa mudar elementos, atributos ou texto da página via JavaScript.

**`DOMContentLoaded`** — Evento disparado pelo navegador quando o HTML terminou de ser processado (mas antes de imagens/recursos externos terminarem de carregar). Ver [04-javascript.md](./04-javascript.md#documentaddeventlistenerdomcontentloaded---).

**Flexbox** — Sistema de layout CSS para organizar elementos em uma única linha ou coluna. Ver [03-css.md](./03-css.md#5-flexbox--onde-e-por-quê) e [08-learning-notes.md](./08-learning-notes.md#flexbox-os-2-eixos).

**Glassmorphism** — Estilo visual que simula "vidro fosco": fundos semitransparentes, com leve desfoque (`backdrop-filter: blur()`) e bordas sutis. Usado em praticamente todos os cards do site (`--bg-glass`, `--border-glass`).

**Grid (CSS Grid)** — Sistema de layout CSS para organizar elementos em linhas E colunas simultaneamente. Ver [03-css.md](./03-css.md#6-grid--onde-e-por-quê) e [08-learning-notes.md](./08-learning-notes.md#grid-linhas-e-colunas-ao-mesmo-tempo).

**Guard clause (cláusula de guarda)** — Padrão de código onde uma função verifica uma condição logo no início e "sai cedo" (`return`) se ela não for atendida, evitando aninhar o resto do código em um `if`. Ver [07-best-practices.md](./07-best-practices.md#2-guard-clauses-cláusulas-de-guarda).

**IntersectionObserver** — API nativa do navegador para detectar quando um elemento entra ou sai da área visível da tela, sem precisar calcular manualmente a posição de scroll. Ver [04-javascript.md](./04-javascript.md#intersectionobserver).

**JSX** — Uma extensão de sintaxe do JavaScript usada em React/React Native que permite escrever elementos parecidos com HTML (`<View>`, `<Text>`) dentro do código JavaScript. Exemplificado no bloco de código da seção 05.

**Keyframes (`@keyframes`)** — Regra CSS que define uma sequência de estados visuais ao longo de uma animação, usada junto com a propriedade `animation`. Ver [03-css.md](./03-css.md#8-animações-keyframes-e-transition) e [06-animations.md](./06-animations.md#1-css-keyframes--animações-contínuas-e-autônomas).

**`let`** — Palavra-chave do JavaScript para declarar uma variável que **pode** ser reatribuída depois. Ver [08-learning-notes.md](./08-learning-notes.md#const-vs-let).

**Lucide** — Biblioteca de ícones SVG usada no projeto, ativada via `<i data-lucide="nome">` + `lucide.createIcons()`. Ver [01-project-structure.md](./01-project-structure.md#bibliotecas-externas-não-fazem-parte-do-repositório).

**Media query** — Regra CSS (`@media (condição) { ... }`) que aplica estilos apenas quando uma condição sobre a tela (geralmente largura) é verdadeira. Ver [03-css.md](./03-css.md#7-responsividade).

**Mermaid** — Linguagem de diagramas em texto, usada nesta documentação (arquivos `00-overview.md`) para desenhar fluxogramas que descrevem a arquitetura do projeto.

**Mockup** — Uma representação visual aproximada de uma interface, sem ser a interface real. No projeto, o "mockup da IDE" (seção 03) simula o Android Studio usando apenas HTML/CSS. Ver [07-best-practices.md](./07-best-practices.md#9-por-que-não-usamos-imagens-reais-mockup-em-vez-de-screenshot).

**One-page (site de página única)** — Um site onde todo o conteúdo vive em um único arquivo HTML, navegado por scroll ou âncoras, em vez de múltiplas páginas separadas.

**Optional chaining (`?.`)** — Sintaxe do JavaScript que evita erros ao tentar acessar uma propriedade de um valor que pode ser `null`/`undefined`. Ver [08-learning-notes.md](./08-learning-notes.md#optional-chaining-).

**Pseudo-classe** — Seletor CSS que representa um elemento em um estado específico, como `:hover` (mouse sobre o elemento) ou `:nth-child()` (posição entre os irmãos). Ver [03-css.md](./03-css.md#9-pseudo-elementos-e-pseudo-classes).

**Pseudo-elemento** — Seletor CSS (`::before`, `::after`) que cria um elemento "fantasma" antes ou depois do conteúdo de um elemento real, sem precisar de HTML adicional. Ver [03-css.md](./03-css.md#9-pseudo-elementos-e-pseudo-classes).

**Prism.js** — Biblioteca JavaScript externa usada para realce de sintaxe (syntax highlighting) dos blocos de código nas seções 04 e 05. Ver [01-project-structure.md](./01-project-structure.md#bibliotecas-externas-não-fazem-parte-do-repositório).

**`requestAnimationFrame`** — Função nativa do navegador para agendar código para rodar no próximo quadro de renderização, usada para otimizar animações e cálculos disparados por eventos de alta frequência como `scroll`. Ver [07-best-practices.md](./07-best-practices.md#5-performance-requestanimationframe-no-evento-de-scroll).

**Responsividade** — A capacidade de um site se adaptar visualmente a diferentes tamanhos de tela (celular, tablet, desktop). Ver [03-css.md](./03-css.md#7-responsividade).

**Reset CSS** — Um conjunto de regras CSS no início de uma folha de estilo que zera os estilos padrão do navegador (margens, tamanhos), dando controle total ao desenvolvedor. Ver [03-css.md](./03-css.md#2-reset).

**Separação de responsabilidades (separation of concerns)** — Princípio de organização de código onde cada parte do sistema (HTML, CSS, JS) cuida de uma única preocupação, sem se misturar. Ver [00-overview.md](./00-overview.md#5-arquitetura-geral-camadas) e [07-best-practices.md](./07-best-practices.md#1-separação-de-responsabilidades-html--css--js).

**`setInterval` / `setTimeout`** — Funções nativas do JavaScript para agendar código: `setTimeout` roda uma vez após um atraso; `setInterval` repete indefinidamente até ser parado com `clearInterval`. Ver [08-learning-notes.md](./08-learning-notes.md#settimeout-vs-setinterval).

**Spread operator (`...`)** — Sintaxe do JavaScript que "espalha" os itens de um array ou as propriedades de um objeto dentro de outro. Ver [08-learning-notes.md](./08-learning-notes.md#spread-operator-).

**Tema escuro (dark theme)** — Paleta de cores do site, com fundo escuro e texto claro, definida pelas variáveis `--bg-*` e `--text-*` em `style.css`.

**Template string** — Sintaxe do JavaScript para criar strings com valores interpolados, usando crases e `${}` (ex.: `` `${variavel}%` ``). Ver [08-learning-notes.md](./08-learning-notes.md#template-strings-crases--).

**Ternário (operador condicional)** — Expressão JavaScript no formato `condição ? valorSeVerdadeiro : valorSeFalso`, usada para escolher um valor de forma curta. Ver [08-learning-notes.md](./08-learning-notes.md#ternário-condição--severdadeiro--sefalso).

**Tilt 3D** — Efeito visual onde um elemento inclina em 3D acompanhando a posição do cursor do mouse, implementado em `main.js` via `[data-tilt]`. Ver [06-animations.md](./06-animations.md#tilt-3d-detalhe-técnico-completo) (nota: a seção completa está descrita dentro do mecanismo 4, "JavaScript customizado").

**Token (Prism.js)** — Um "pedaço" de código reconhecido pelo Prism.js (palavra-chave, string, comentário, etc.), envolvido em `<span class="token tipo">` para poder ser colorido via CSS. Ver [03-css.md](./03-css.md#10-tokens-do-prismjs).

**`transition` (CSS)** — Propriedade CSS que suaviza a mudança de um valor para outro, disparada por hover, foco, ou mudança de classe via JavaScript. Diferente de `@keyframes`, não roda sozinha — precisa de um gatilho. Ver [03-css.md](./03-css.md#8-animações-keyframes-e-transition).

**Vanilla JS** — Apelido comum para "JavaScript puro", sem nenhum framework (React, Vue, Angular) ou biblioteca pesada. Ver [00-overview.md](./00-overview.md#6-por-que-não-usamos-reactvueangular) e [07-best-practices.md](./07-best-practices.md#11-por-que-vanilla-js-javascript-puro-em-vez-de-um-framework).

**Viewport** — A área visível da tela do navegador (o que você vê sem rolar). Unidades como `vh` (altura da viewport) e `vw` (largura da viewport) são relativas a esse tamanho.

**`z-index`** — Propriedade CSS que controla a ordem de empilhamento (qual elemento aparece "na frente" de outro) quando elementos se sobrepõem.
