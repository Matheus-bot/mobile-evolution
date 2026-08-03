# 03 — CSS explicado em detalhe

Todo o visual do site está em um único arquivo: `assets/css/style.css` (~1650 linhas). Ele é organizado em blocos, sempre na mesma ordem em que as seções aparecem no HTML, precedidos por um cabeçalho de comentário como:

```css
/* =================================================================
   04. DESENVOLVIMENTO NATIVO
   ================================================================= */
```

Isso permite usar `Ctrl+F` por "04. DESENVOLVIMENTO" e pular direto para o bloco relevante. Este documento explica os conceitos usados, na ordem em que aparecem no arquivo.

## 1. Variáveis (Design Tokens)

```css
:root {
  --bg-primary: #08080c;
  --bg-secondary: #101014;
  --bg-elevated: #16161c;
  --bg-glass: rgba(255, 255, 255, 0.04);
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glass-strong: rgba(255, 255, 255, 0.14);

  --text-primary: #f5f5f7;
  --text-secondary: #a1a1aa;
  --text-muted: #6b6b74;

  --accent-blue: #5b8cff;
  --accent-violet: #a855f7;
  --gradient-accent: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-violet) 100%);
  --color-android: #3ddc84;
  --color-rn: #61dafb;

  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --section-padding-x: clamp(1.5rem, 6vw, 6rem);
  --transition-base: 0.5s cubic-bezier(0.16, 0.84, 0.44, 1);
  --transition-fast: 0.25s cubic-bezier(0.16, 0.84, 0.44, 1);
}
```

**O que é**: `--nome-qualquer: valor;` dentro de `:root` cria uma **variável CSS** (também chamada de *custom property*) acessível em qualquer lugar da folha de estilo via `var(--nome-qualquer)`. `:root` é o elemento raiz do documento (na prática, equivale a `html`, mas com especificidade um pouco maior).

**Por que foi escrito assim**: sem variáveis, cada uma das ~50 ocorrências da cor de fundo escura no arquivo teria o valor `#08080c` copiado e colado. Se, na revisão final, alguém decidisse escurecer um pouco o fundo, seria necessário caçar e trocar manualmente dezenas de linhas — com alto risco de esquecer alguma. Com uma variável, **muda-se em um único lugar** (`--bg-primary: #050507;`, por exemplo) e o site inteiro reflete a mudança.

**Qual problema resolve**: consistência visual e manutenibilidade. Também documenta a **intenção** de cada valor — `var(--accent-blue)` é muito mais legível no meio do código do que `#5b8cff` sozinho, porque o nome já diz "isso é a cor de destaque azul da marca", não "isso é um azul qualquer".

**Categorias de variáveis usadas neste projeto**:

| Categoria | Exemplos | Uso |
|---|---|---|
| Cores de fundo | `--bg-primary`, `--bg-elevated`, `--bg-glass` | Diferentes "camadas" de profundidade visual (fundo da página vs. fundo de um card) |
| Cores de borda | `--border-glass`, `--border-glass-strong` | Bordas sutis, típicas do estilo *glassmorphism* |
| Cores de texto | `--text-primary`, `--text-secondary`, `--text-muted` | Hierarquia tipográfica (o texto mais importante é mais claro/contrastante) |
| Cores de destaque | `--accent-blue`, `--accent-violet`, `--gradient-accent` | Usadas com moderação, para chamar atenção (títulos, botões, ícones ativos) |
| Cores "de marca" | `--color-android`, `--color-rn` | Usadas especificamente nas seções que comparam Android vs. React Native, para reforçar a identidade de cada tecnologia |
| Tipografia | `--font-heading`, `--font-body`, `--font-mono` | Cada fonte tem um papel: títulos, texto corrido, código |
| Timing | `--transition-base`, `--transition-fast` | Padroniza a "sensação" de todas as transições do site — se todo botão, card e hover usa a mesma curva de animação, a experiência parece mais coesa |

`clamp(1.5rem, 6vw, 6rem)` em `--section-padding-x` merece destaque: é uma função CSS que recebe **(mínimo, valor preferido, máximo)**. Aqui, o espaçamento lateral das seções nunca fica menor que `1.5rem` (telas muito pequenas) nem maior que `6rem` (telas muito grandes), mas na maioria das telas ele varia suavemente como `6vw` (6% da largura da viewport). É uma forma de fazer responsividade **sem** precisar escrever uma media query só para isso.

## 2. Reset

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-weight: 300;
  line-height: 1.5;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
```

**O que é um "reset"**: cada navegador aplica, por padrão, estilos diferentes para tags como `<h1>`, `<p>`, `<ul>` (margens, tamanhos de fonte, etc.). Um reset zera essas diferenças no início da folha de estilo, para que o site pareça igual em qualquer navegador — e para que o desenvolvedor tenha controle total, definindo cada espaçamento de propósito em vez de herdar valores "aleatórios" do navegador.

**Linha por linha**:
- `box-sizing: border-box` — muda a forma como `width`/`height` são calculados: com `border-box`, o `padding` e a `border` de um elemento **entram** na largura total declarada, em vez de somar a ela. Isso evita o clássico bug de "coloquei `width: 100%` e `padding: 20px` e o elemento ficou maior que o pai".
- `margin: 0; padding: 0;` — remove os espaçamentos padrão de todos os elementos, para o layout ser 100% intencional (feito por classes específicas, não por acidente do navegador).
- `scroll-behavior: smooth` no `<html>` — faz qualquer navegação por âncora (`#id`) ou `scrollIntoView()` do JavaScript rolar suavemente, em vez de "pular" instantaneamente. Isso é usado o tempo todo neste site (clique nos dots de navegação, botão "Iniciar Jornada").
- `overflow-x: hidden` no `<body>` — impede rolagem horizontal acidental (comum quando algum elemento decorativo, como os blobs do Hero, "vaza" um pouco para fora da tela).
- `-webkit-font-smoothing: antialiased` — deixa a renderização de fonte mais suave/fina em navegadores baseados em WebKit (Chrome, Safari), aproximando o visual do "look" de sites como Apple/Stripe.

```css
h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
```
Todos os títulos usam a fonte `Space Grotesk` (mais geométrica/tech) em vez da fonte de texto corrido (`Inter`). `letter-spacing: -0.02em` (negativo) aproxima levemente as letras — uma técnica comum em títulos grandes para evitar que pareçam "esparramados".

```css
::selection {
  background: var(--accent-violet);
  color: var(--text-primary);
}
```
Customiza a cor de fundo quando o usuário seleciona texto com o mouse — um detalhe pequeno, mas que evita a seleção azul padrão do navegador brigar com a paleta escura do site.

## 3. Layout: o "molde" compartilhado de seção

```css
.section {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem var(--section-padding-x);
}
```

**Por que existe**: em vez de repetir essas 8 propriedades em cada uma das 12 seções, definimos uma vez a classe `.section`, que todas as `<section>` do HTML recebem (`class="section hero"`, `class="section timeline"`, etc.). Cada seção então só precisa de uma classe **adicional** para seus ajustes específicos.

**O que cada propriedade resolve**:
- `min-height: 100vh` — garante que a seção ocupe **no mínimo** a altura inteira da tela (`100vh` = 100% da altura da viewport), criando o efeito de "uma tela por seção" pedido no briefing. É `min-height`, não `height`, porque algumas seções (como a de Sistemas Operacionais, com 8 cards) podem precisar de mais espaço que uma tela em telas estreitas — `min-height` permite que a seção cresça sem cortar conteúdo.
- `display: flex` + `flex-direction: column` + `align-items: center` + `justify-content: center` — centraliza todo o conteúdo da seção tanto na vertical quanto na horizontal, usando Flexbox (ver seção 5 abaixo).
- `position: relative` — necessário para que elementos-filhos posicionados com `position: absolute` (como os blobs do Hero, ou o rodapé da Conclusão) se posicionem **relativos a essa seção**, e não à página inteira.
- `padding: 6rem var(--section-padding-x)` — respiro interno vertical fixo (`6rem`) e horizontal responsivo (a variável `clamp(...)` explicada acima).

## 4. Barra de progresso e navegação por dots

```css
.progress-bar {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  width: 0%;
  background: var(--gradient-accent);
  z-index: 1000;
  transition: width 0.1s linear;
}
```
`position: fixed` faz o elemento ficar grudado na tela **independente do scroll** (diferente de `absolute`, que é relativo ao elemento pai). `z-index: 1000` garante que fique acima de tudo. A `width` começa em `0%` e é atualizada via JavaScript (`main.js`) conforme o usuário rola.

```css
.nav-dots__dot.is-active {
  background: var(--gradient-accent);
  height: 24px;
  border-radius: 3px;
}
```
Quando um dot recebe a classe `.is-active` (via JavaScript), ele deixa de ser um círculo pequeno e vira uma "pílula" alongada — a mudança de `height` de `8px` para `24px` acontece suavemente por causa da `transition` definida em `.nav-dots__dot`.

## 5. Flexbox — onde e por quê

Flexbox é usado sempre que o objetivo é **alinhar itens em uma única linha ou coluna** (um eixo). Exemplos no projeto:

```css
.lang-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}
```
As 3 badges de linguagem (Java/Kotlin/Swift) precisam ficar lado a lado, centralizadas, com possibilidade de quebrar linha em telas pequenas (`flex-wrap: wrap`). `gap` cria o espaçamento entre elas sem precisar de `margin` manual em cada uma.

```css
.battle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1.5rem, 5vw, 4rem);
}
```
Os dois cards de "batalha" + a área central de perguntas ficam em uma linha horizontal, centralizados vertical e horizontalmente.

**Regra prática usada neste projeto**: Flexbox para **listas em uma direção só** (badges, botão + ícone, cards de batalha, coluna de vantagens/desvantagens). Grid para **layouts em duas dimensões** (linhas E colunas ao mesmo tempo) — ver próxima seção.

## 6. Grid — onde e por quê

```css
.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 480px;
}
```
Os 4 cards de recursos do Android Studio (seção 03) precisam formar uma grade 2×2. `grid-template-columns: 1fr 1fr` cria duas colunas de largura igual (`1fr` = "uma fração do espaço disponível"); como há 4 itens e 2 colunas, o Grid quebra automaticamente em 2 linhas — não é preciso declarar `grid-template-rows`.

```css
.comparator__row {
  display: grid;
  grid-template-columns: 1fr 190px 1fr;
  align-items: center;
  gap: 1rem;
}
```
Cada linha do comparador (seção 06) tem 3 colunas: barra esquerda (flexível), critério central (largura fixa de `190px`, para o texto não empurrar as barras), barra direita (flexível). Isso seria muito mais difícil de conseguir com Flexbox puro — é exatamente o caso de uso onde Grid brilha: **colunas com tamanhos diferentes e bem definidos**.

```css
.os-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.1rem;
}
```
`repeat(4, 1fr)` é um atalho para `1fr 1fr 1fr 1fr` — 4 colunas iguais para os 8 cards de sistemas operacionais (formando 2 linhas de 4).

### Grid + `grid-column` para "pular" colunas

Um uso mais avançado é o zigue-zague da Linha do Tempo:

```css
.timeline__item {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
}

.timeline__item.is-right .timeline__content { grid-column: 1; text-align: right; }
.timeline__item.is-left  .timeline__content { grid-column: 3; text-align: left; }
```
A linha tem 3 colunas: esquerda (`1fr`), o "dot" central (`auto`, do tamanho do conteúdo), direita (`1fr`). Dependendo da classe (`is-right` ou `is-left`), o **mesmo bloco de conteúdo** (`.timeline__content`) é posicionado explicitamente na coluna 1 ou na coluna 3 via `grid-column`, criando o efeito de alternância sem duplicar HTML.

## 7. Responsividade

O projeto usa duas estratégias combinadas:

### a) Unidades fluidas (sem media query)

`clamp()`, `vw`, e `%` fazem boa parte do trabalho de responsividade **antes mesmo** de qualquer media query. Exemplo, o título do Hero:

```css
.hero__title {
  font-size: clamp(2.4rem, 7vw, 5.5rem);
}
```
Em uma tela de celular pequena, `7vw` calcula um valor menor que `2.4rem`, então o CSS usa o mínimo (`2.4rem`) para o texto não ficar ilegível. Em uma tela de desktop muito larga, `7vw` ultrapassaria `5.5rem`, então o CSS trava no máximo. Entre esses extremos, o tamanho flui suavemente — **sem nenhum salto brusco** entre breakpoints, diferente do método tradicional de só media queries.

### b) Media Queries (para mudanças estruturais)

Quando o ajuste não é "só um número menor", mas sim uma **mudança de estrutura** (colunas viram linhas, por exemplo), usamos `@media`:

```css
@media (max-width: 900px) {
  .android-studio {
    flex-direction: column;
    text-align: center;
  }
}
```
Em telas até `900px` de largura, a seção do Android Studio (que normalmente é texto + mockup lado a lado) empilha verticalmente. O projeto usa vários breakpoints, escolhidos **conforme o conteúdo quebra** (não um sistema de grade fixo tipo Bootstrap):

| Breakpoint | Onde é usado | O que muda |
|---|---|---|
| `1000px` | `.os-grid` | 4 colunas → 2 colunas |
| `900px` | `.android-studio`, `.native-dev__grid`, `.rn__grid`, `.future__grid` | Layout de 2 colunas → empilhado |
| `800px` | `.market__grid` | 2 gráficos lado a lado → empilhados |
| `720px` | `.timeline__item`, `.comparator__row` | Zigue-zague/barras divergentes → layout linear simplificado |
| `640px` | `.battle` | Cards de batalha lado a lado → empilhados |
| `560px` | `.chooser__grid` | Grid 2×2 de flip cards → 1 coluna |
| `520px` | `.os-grid` | 2 colunas → 1 coluna |
| `480px` | `.future__grid` | 2 colunas → 1 coluna |

### c) `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Isso **não é sobre tamanho de tela** — é sobre uma preferência de sistema operacional que usuários com sensibilidade a movimento (enjoo, questões vestibulares, etc.) podem ativar. Quando ativa, o CSS praticamente "desliga" todas as animações (reduzindo a duração para quase zero), sem precisar reescrever nenhuma regra — é uma camada de acessibilidade que sobrepõe todo o resto graças ao `!important`.

## 8. Animações (`@keyframes` e `transition`)

Ver o catálogo completo em [06-animations.md](./06-animations.md). Resumo dos dois mecanismos usados:

- **`transition`**: anima a mudança **entre dois estados** de uma propriedade (ex.: de `opacity: 0` para `opacity: 1` quando uma classe é adicionada). Precisa de um "gatilho" (hover, ou uma classe adicionada via JS).
- **`@keyframes` + `animation`**: define uma sequência de estados **que roda sozinha**, em loop ou não, sem precisar de gatilho externo (ex.: os blobs do Hero flutuando para sempre).

Exemplo de `@keyframes`:
```css
@keyframes blobFloat {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(6%, 8%) scale(1.15); }
}

.hero__blob--1 {
  animation: blobFloat 16s ease-in-out infinite alternate;
}
```
`infinite alternate` faz a animação rodar para sempre, invertendo a direção a cada repetição (vai de `from` para `to`, depois de `to` de volta para `from`), criando um movimento orgânico de "respiração" em vez de um "reset" abrupto no final de cada ciclo.

## 9. Pseudo-elementos e pseudo-classes

**Pseudo-elemento** (`::antes-de-quê`) cria um "elemento fantasma" que não existe no HTML, mas pode ser estilizado como se existisse:

```css
.timeline__track::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 2px;
  background: var(--border-glass-strong);
  transform: translateX(-50%);
}
```
A linha vertical estática da timeline **não existe como uma `<div>` no HTML** — ela é inteiramente desenhada por este `::before`. Isso economiza um elemento HTML "vazio" que só serviria para decoração.

```css
.os-card__status::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--dot-color);
}
```
A bolinha colorida antes do texto de status (seção 08) é outro `::before` — sua cor vem da variável `--dot-color`, que é redefinida por classes modificadoras (`--active`, `--niche`, `--inactive`), técnica detalhada em [05-components.md](./05-components.md).

**Pseudo-classes** (`:algo`) selecionam um elemento **em um determinado estado**:

```css
.feature-card:hover {
  border-color: var(--border-glass-strong);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
```
`:hover` aplica o estilo só enquanto o mouse está sobre o elemento.

```css
.future-card:nth-child(2) { animation-delay: 0.3s; }
.future-card:nth-child(3) { animation-delay: 0.6s; }
.future-card:nth-child(4) { animation-delay: 0.9s; }
```
`:nth-child(N)` seleciona o N-ésimo filho de um pai — usado aqui para escalonar o atraso da animação de flutuação dos 4 cards da seção Futuro, sem precisar adicionar uma classe ou atributo `style` diferente em cada `<div>` do HTML.

## 10. Tokens do Prism.js

```css
.code-window .token.keyword { color: var(--accent-violet); }
.code-window .token.string { color: #4ade80; }
.code-window .token.comment { color: var(--text-muted); font-style: italic; }
.code-window .token.function { color: var(--accent-blue); }
```
Quando o Prism.js processa um bloco de código, ele envolve cada "pedaço" reconhecido (palavra-chave, string, comentário...) em um `<span class="token nome-do-tipo">`. Esse bloco de CSS **não faz parte do tema padrão do Prism** — foi escrito à mão para que as cores do realce de sintaxe usem a mesma paleta do resto do site (em vez do tema genérico que o Prism aplicaria sozinho), mantendo a identidade visual consistente mesmo dentro do bloco de código.

## 11. `!important` e `color-mix()` — dois casos pontuais

```css
.code-window__pre {
  background: transparent !important;
}
```
O Prism.js, ao processar o código, injeta seu próprio `background` inline/via classe no elemento `<pre>`. Para garantir que o fundo do nosso `.code-window` (a "janela" com as bolinhas) apareça por trás do código, e não uma cor própria do Prism, usamos `!important` para vencer essa disputa de especificidade. É um dos únicos usos de `!important` no projeto — reservado para quando uma biblioteca externa injeta estilos que não controlamos de outra forma.

```css
.future-card__icon {
  box-shadow: 0 0 26px color-mix(in srgb, var(--icon-color) 35%, transparent);
}
```
`color-mix()` é uma função CSS moderna que mistura duas cores em uma proporção — aqui, pega a cor do ícone (definida por elemento via `--icon-color`) e a mistura com `transparent` na proporção 35%/65%, gerando uma versão "fantasma" da mesma cor para usar como brilho (`box-shadow`), sem precisar calcular manualmente um valor `rgba()` equivalente para cada uma das 4 cores diferentes dos ícones da seção Futuro.
