# 02 — HTML explicado seção por seção

Este arquivo percorre `index.html` de cima a baixo. Para cada `<section>`, seguimos sempre o mesmo roteiro:

1. **Por que existe** (o que ela conta na história da apresentação)
2. **Qual sua responsabilidade** (o que ela precisa mostrar)
3. **Quais classes utiliza** (o gancho para o CSS)
4. **Quem manipula essa seção** (qual JS, se houver, mexe nela)
5. **Elementos importantes**, explicados um a um

---

## `<head>`: metadados e bibliotecas

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>A Evolução do Desenvolvimento Mobile</title>
<meta name="description" content="Da programação nativa ao desenvolvimento multiplataforma." />
```

- `charset="UTF-8"` garante que acentos e caracteres especiais (ã, ç, —) sejam exibidos corretamente.
- `viewport` é o que faz o site respeitar a largura real da tela em celulares — sem essa linha, navegadores mobile renderizam como se a tela fosse larga (~980px) e depois "encolhem" tudo, deixando o texto minúsculo.
- `title` é o texto da aba do navegador.
- `description` é usada por buscadores/preview de links (não afeta a aparência do site).

Depois vêm, em ordem, os `<link>`/`<script>` de fontes (Google Fonts) e bibliotecas (AOS, Lucide, Prism.js, Chart.js), documentados em [01-project-structure.md](./01-project-structure.md#bibliotecas-externas-não-fazem-parte-do-repositório). Por último, o CSS do projeto:

```html
<link rel="stylesheet" href="assets/css/style.css" />
```

## `<body>`: os três elementos "fora" das seções

Logo no início do `<body>`, antes de `<main>`, existem dois elementos que **ficam fixos na tela o tempo todo**, sobrepostos ao conteúdo:

```html
<div class="progress-bar" id="progressBar"></div>
<nav class="nav-dots" id="navDots" aria-label="Navegação entre seções"></nav>
```

- **`#progressBar`**: uma barra fina no topo da página. Começa com `width: 0%` (definido no CSS) e o arquivo `main.js` atualiza essa largura conforme o usuário rola — funciona como um indicador de "quanto falta" da apresentação.
- **`#navDots`**: um `<nav>` **vazio** no HTML! Ele é populado inteiramente via JavaScript (`main.js`, função `initNavDots`), que cria um `<button>` para cada `<section class="section">` encontrada na página. Isso significa que, se você adicionar uma seção 13 no futuro, um dot novo aparece automaticamente — não é preciso editar `navDots` manualmente.

Depois vem `<main>`, que envolve as 12 `<section>`. `<main>` é uma tag semântica do HTML5 que diz "aqui está o conteúdo principal da página" (bom para acessibilidade e SEO).

---

## Seção 01 — Hero (`#hero`)

```html
<section class="section hero" id="hero" data-label="Início">
```

- **Por que existe**: é a primeira tela que a plateia vê. Tem que comunicar o tema em segundos e convidar a rolar.
- **Responsabilidade**: mostrar título, subtítulo e um botão que leva à próxima seção.
- **Classes**: `section` (layout base, compartilhado com todas as seções) + `hero` (estilo específico desta seção).
- **Quem manipula**: `main.js`, função `initHero()` (o clique do botão) e `initNavDots()` (trata o Hero como a primeira entrada da navegação, via `data-label="Início"`).

### Elementos importantes

```html
<div class="hero__bg" aria-hidden="true">
  <span class="hero__blob hero__blob--1"></span>
  <span class="hero__blob hero__blob--2"></span>
</div>
```
Dois `<span>` vazios, só usados como "telas" para gradientes desfocados (os blobs azul/violeta que flutuam ao fundo). `aria-hidden="true"` diz a leitores de tela para ignorar esse bloco — ele é puramente decorativo, não tem informação.

```html
<h1 class="hero__title" data-reveal-title>
  <span class="hero__title-line">A Evolução do</span>
  <span class="hero__title-line hero__title-line--gradient">Desenvolvimento Mobile</span>
</h1>
```
O título é **um único `<h1>`** (bom para SEO/acessibilidade — só deve haver um `<h1>` por página), mas visualmente quebrado em duas linhas usando dois `<span>` com `display: block` (ver CSS). A segunda linha tem a classe extra `--gradient`, que pinta o texto com o gradiente azul→violeta da marca.

> Nota sobre `data-reveal` e `data-reveal-title`: esses atributos aparecem no Hero mas **não são lidos por nenhum JavaScript nem CSS no projeto atual** — são "ganchos" deixados de propósito, sinalizando quais elementos fazem parte da sequência de entrada do Hero (que hoje é feita só com `@keyframes` no CSS, sem JS). Eles não quebram nada por estarem ali, mas também não têm efeito funcional.

```html
<button class="btn btn--primary hero__cta" id="heroCta" data-reveal>
  <span>Iniciar Jornada</span>
  <svg ...>...</svg>
</button>
```
O botão principal. `btn` e `btn--primary` são classes **genéricas** (poderiam estilizar qualquer botão do site), enquanto `hero__cta` ajusta detalhes específicos deste botão (posição, animação de entrada). O `id="heroCta"` é o gancho que `main.js` usa para ouvir o clique.

```html
<div class="hero__scroll-indicator" aria-hidden="true">
  <span></span>
</div>
```
O "indicador de scroll" (a cápsula com uma bolinha pulsando) no rodapé da tela — também decorativo.

---

## Seção 02 — Linha do Tempo (`#timeline`)

```html
<section class="section timeline" id="timeline" data-label="Linha do Tempo">
```

- **Por que existe**: contextualiza historicamente o tema antes de entrar em detalhes técnicos — mostra que o "desenvolvimento mobile" é um assunto com 15+ anos de evolução.
- **Responsabilidade**: listar os marcos (2008 → hoje) em ordem cronológica correta.
- **Classes**: `section timeline`.
- **Quem manipula**: `timeline.js` (anima a barra de progresso vertical) + AOS via `data-aos` (revela cada nó ao entrar na tela).

### Elementos importantes

```html
<div class="timeline__track">
  <div class="timeline__progress" id="timelineProgress"></div>
  <ul class="timeline__list">
    <li class="timeline__item is-right" data-aos="fade-up">
      <span class="timeline__dot"></span>
      <div class="timeline__content">
        <span class="timeline__year">2008</span>
        <h3>Android nasce</h3>
        <p>O SDK é lançado e o Android chega ao mercado.</p>
      </div>
    </li>
    <!-- ... mais 6 <li> ... -->
  </ul>
</div>
```

- **`.timeline__track`**: o contêiner com a "trilha" vertical (uma linha desenhada via CSS `::before`, ver [03-css.md](./03-css.md)).
- **`#timelineProgress`**: uma `<div>` vazia, sobreposta à trilha estática, cuja `height` é controlada em tempo real por `timeline.js` — ela é o traço "aceso" (gradiente com glow) que cresce conforme o usuário rola.
- **`<ul class="timeline__list">`**: cada marco histórico é um `<li class="timeline__item">`. A lista é semântica (é uma lista de eventos), mesmo com `list-style: none` no CSS (removendo as bolinhas padrão).
- **`is-right` / `is-left`**: classes que alternam de qual lado da trilha o conteúdo aparece (efeito clássico de timeline em zigue-zague). São aplicadas manualmente no HTML, alternando item a item.
- **`data-aos="fade-up"` + `data-aos-delay="80"`**: cada item entra com uma pequena animação de baixo para cima; o `delay` cria uma pequena cascata dentro da mesma seção.
- **`timeline__item--now`** (só no último item, "Hoje"): classe extra que ativa um efeito de pulso contínuo no dot (`@keyframes pulseDot`), sinalizando "isso está acontecendo agora, é um marco em aberto".

> **Ordem cronológica**: os 7 marcos são 2008 (Android nasce) → 2008–2016 (Java domina) → 2013 (Android Studio) → 2015 (React Native) → 2017 (Kotlin) → 2017 (Flutter) → Hoje (IA). Preste atenção especial à ordem React Native (2015) antes de Kotlin (2017) — foi um ajuste feito depois da primeira versão, quando a ordem estava trocada.

---

## Seção 03 — Android Studio (`#android-studio`)

```html
<section class="section android-studio" id="android-studio" data-label="Android Studio">
```

- **Por que existe**: apresenta a ferramenta que qualquer desenvolvedor Android precisa conhecer antes de falar de linguagens.
- **Responsabilidade**: explicar o que é a IDE e destacar 4 recursos-chave (Emulador, Gradle, SDK, Debug).
- **Classes**: `section android-studio`.
- **Quem manipula**: `main.js` (`initTilt()` dá o efeito 3D ao passar o mouse nos elementos com `data-tilt`; `initIcons()` transforma os `<i data-lucide="...">` em SVGs).

### Elementos importantes

```html
<div class="android-studio__text" data-aos="fade-right">
  <p class="section-eyebrow">Ambiente Oficial de Desenvolvimento</p>
  <h2 class="section-heading section-heading--left">Android Studio</h2>
  <p class="android-studio__lead">...</p>
  <div class="feature-grid">
    <div class="feature-card" data-aos="zoom-in" data-aos-delay="0" data-tilt>
      <i data-lucide="smartphone"></i>
      <h3>Emulador</h3>
      <p>Simula dispositivos reais sem precisar de hardware físico.</p>
    </div>
    <!-- + Gradle, SDK, Debug -->
  </div>
</div>
```

- **`.section-eyebrow`**: um pequeno rótulo em letras maiúsculas acima do título (padrão usado em quase todas as seções, ver [05-components.md](./05-components.md)).
- **`.feature-grid` + `.feature-card`**: um componente reutilizável — 4 cartões de vidro em grid 2×2, cada um com ícone, título e descrição curta. O mesmo componente `.feature-card` reaparece na seção 05 (React Native).
- **`data-tilt`**: qualquer elemento com esse atributo ganha, via `main.js`, um efeito de rotação 3D que segue o mouse (ver [06-animations.md](./06-animations.md#tilt-3d)).

```html
<div class="ide-mock" data-aos="fade-left" data-aos-delay="150" data-tilt>
  <div class="ide-mock__titlebar"> ... </div>
  <div class="ide-mock__body">
    <div class="ide-mock__sidebar"> ... </div>
    <div class="ide-mock__code"> ... </div>
  </div>
  <div class="ide-mock__statusbar"> ... </div>
</div>
```

Este é o **mockup falso da IDE** — não é um screenshot, é HTML/CSS puro simulando a janela do Android Studio:

- `.ide-mock__titlebar`: barra de título com 3 bolinhas coloridas (estilo macOS: vermelho/amarelo/verde) e o nome do arquivo fictício.
- `.ide-mock__sidebar`: 5 `<span class="ide-mock__file">` vazios, cada um é uma "barra" cinza que representa um nome de arquivo na árvore de arquivos (sem texto real, só a forma).
- `.ide-mock__code`: várias `<div class="ide-mock__line">`, cada uma contendo `<span class="tok tok--kw">` (token) com um `width` inline diferente — simula linhas de código coloridas (syntax highlighting) sem ser código de verdade.
- `.ide-mock__statusbar`: rodapé com um ponto verde e o texto "Build successful", reforçando a sensação de ferramenta real.

> Essa técnica (recriar a interface de uma ferramenta usando divs/spans com larguras variadas) é chamada de **"skeleton/mockup UI"** e é comum em sites de produto para mostrar telas sem precisar de screenshots reais (que ficam desatualizados ou dependem de licenciamento de marca).

---

## Seção 04 — Desenvolvimento Nativo (`#native-dev`)

```html
<section class="section native-dev" id="native-dev" data-label="Nativo">
```

- **Por que existe**: define o que é "nativo" antes de comparar com multiplataforma.
- **Responsabilidade**: mostrar as 3 linguagens nativas (Java, Kotlin, Swift), um exemplo real de código Java e uma lista de vantagens/desvantagens.
- **Classes**: `section native-dev`.
- **Quem manipula**: Prism.js (realce do bloco de código, automático ao carregar a página); `main.js` (`initTilt`, `initIcons`).

### Elementos importantes

```html
<div class="lang-badges" data-aos="fade-up" data-aos-delay="140">
  <span class="lang-badge"><span class="lang-badge__dot" style="background:#f8981d"></span>Java</span>
  <span class="lang-badge"><span class="lang-badge__dot" style="background:#7f52ff"></span>Kotlin</span>
  <span class="lang-badge"><span class="lang-badge__dot" style="background:#f05138"></span>Swift</span>
</div>
```
Três "pílulas" (badges), cada uma com uma bolinha colorida — a cor de cada bolinha é definida **inline** (`style="background:..."`) porque é um valor único por item, não faria sentido criar uma classe CSS separada só para isso (ver [07-best-practices.md](./07-best-practices.md#quando-usar-estilo-inline)).

```html
<div class="code-window" data-aos="fade-right" data-aos-delay="100" data-tilt>
  <div class="code-window__titlebar"> ... </div>
  <pre class="code-window__pre"><code class="language-java">public class MainActivity extends AppCompatActivity {
    ...
}</code></pre>
</div>
```
- **`.code-window`**: componente reutilizável (também usado na seção 05) que simula uma janela de editor de código, com as mesmas 3 bolinhas de título do mockup da IDE, mas aqui contendo um `<pre><code>` real.
- **`<code class="language-java">`**: a classe `language-java` é o "gatilho" que o **Prism.js** procura. Quando a página carrega, o Prism varre o documento, encontra qualquer `<code class="language-XXX">` e insere `<span class="token ...">` ao redor de cada palavra-chave, string, comentário etc., permitindo que o CSS pinte cada tipo de token com uma cor (ver [03-css.md](./03-css.md#tokens-do-prismjs)).
- O código em si é um trecho **real e válido** de Java/Android: uma `Activity` que registra um clique de botão e mostra um `Toast`.

```html
<div class="pros-cons">
  <div class="pros-cons__col pros-cons__col--pros" data-aos="fade-left" data-aos-delay="140">
    <h3><i data-lucide="check-circle"></i> Vantagens</h3>
    <ul> <li>...</li> ... </ul>
  </div>
  <div class="pros-cons__col pros-cons__col--cons" data-aos="fade-left" data-aos-delay="220">
    <h3><i data-lucide="x-circle"></i> Desvantagens</h3>
    <ul> <li>...</li> ... </ul>
  </div>
</div>
```
Duas colunas de lista simples, diferenciadas pelos modificadores `--pros` (ícone/cor verde) e `--cons` (ícone/cor vermelha) — ver classes BEM em [05-components.md](./05-components.md#nomenclatura-bem).

---

## Seção 05 — React Native (`#react-native`)

```html
<section class="section react-native" id="react-native" data-label="React Native">
```

- **Por que existe**: espelha a seção 04, mas para o mundo multiplataforma — mantém o paralelismo pedagógico (nativo vs. RN lado a lado na "narrativa").
- **Responsabilidade**: explicar a arquitetura (JS ↔ Bridge ↔ Nativo), destacar 3 características-chave e mostrar um código JSX real.
- **Classes**: `section react-native`.
- **Quem manipula**: Prism.js (realce do bloco `language-jsx`); `main.js` (`initTilt`, `initIcons`).

### Elementos importantes

```html
<div class="rn-architecture" data-tilt>
  <div class="rn-arch__node">
    <i data-lucide="code-2"></i>
    <span>JavaScript</span>
  </div>
  <div class="rn-arch__connector"><span class="rn-arch__pulse"></span></div>
  <div class="rn-arch__node rn-arch__node--bridge">
    <i data-lucide="git-compare-arrows"></i>
    <span>Bridge</span>
  </div>
  <div class="rn-arch__connector"><span class="rn-arch__pulse" style="animation-delay: 0.9s"></span></div>
  <div class="rn-arch__node">
    <i data-lucide="smartphone"></i>
    <span>Nativo</span>
  </div>
</div>
```
Um **diagrama construído em HTML/CSS**, sem nenhuma biblioteca de diagramas: 3 "nós" (JavaScript, Bridge, Nativo) conectados por 2 "conectores" (`.rn-arch__connector`), cada um com um pontinho (`.rn-arch__pulse`) que se move da esquerda para a direita continuamente via `@keyframes`, simulando "dados trafegando pela ponte". O segundo pulso tem `animation-delay: 0.9s` inline para não ficar sincronizado com o primeiro (ver [06-animations.md](./06-animations.md)).

```html
<div class="feature-row">
  <div class="feature-card" data-aos="zoom-in" data-aos-delay="0">
    <i data-lucide="layout-grid"></i>
    <h3>Componentes</h3>
    <p>Blocos de UI reutilizáveis e declarativos.</p>
  </div>
  <!-- + Hot Reload, Código Compartilhado -->
</div>
```
Reaproveita o mesmo componente `.feature-card` da seção 03, mas dentro de um contêiner `.feature-row` (3 colunas em vez do grid 2×2). Isso é reuso de CSS: a classe `.feature-card` já existe, só muda o contêiner pai.

```html
<div class="code-window" data-aos="fade-left" data-aos-delay="160" data-tilt>
  ...
  <pre class="code-window__pre"><code class="language-jsx">export default function App() {
  const [count, setCount] = useState(0);
  return (
    &lt;View style={styles.container}&gt;
      ...
    &lt;/View&gt;
  );
}</code></pre>
</div>
```
Mesmo componente `.code-window` da seção 04. Repare que os sinais `<` e `>` da JSX aparecem como **entidades HTML** `&lt;` e `&gt;` — isso é obrigatório: se você escrever `<View>` literalmente dentro de `<code>`, o navegador tentaria interpretar como uma tag HTML real (chamada `<view>`), quebrando o código exibido. `&lt;` e `&gt;` são a forma segura de mostrar `<` e `>` como texto.

---

## Seção 06 — Comparação (`#comparison`)

```html
<section class="section comparison" id="comparison" data-label="Comparação">
```

- **Por que existe**: depois de explicar as duas abordagens separadamente, é hora de colocá-las lado a lado objetivamente.
- **Responsabilidade**: comparar 7 critérios técnicos (Performance, Tempo de Desenvolvimento, Reutilização de Código, Manutenção, Acesso ao Hardware, Curva de Aprendizado, Mercado) entre Android Nativo e React Native.
- **Classes**: `section comparison`.
- **Quem manipula**: `comparison.js` — anima a largura das barras quando cada linha entra na tela.

### Elementos importantes

```html
<div class="comparator" data-aos="fade-up" data-aos-delay="120">
  <div class="comparator__header">
    <span class="comparator__side-label comparator__side-label--left">
      <span class="comparator__side-dot comparator__side-dot--android"></span>Android Nativo
    </span>
    <span class="comparator__side-label comparator__side-label--right">
      React Native<span class="comparator__side-dot comparator__side-dot--rn"></span>
    </span>
  </div>

  <ul class="comparator__list">
    <li class="comparator__row" data-android="100" data-rn="80">
      <div class="comparator__bar comparator__bar--left"><span class="comparator__fill comparator__fill--left"></span></div>
      <div class="comparator__criterion"><i data-lucide="zap"></i><span>Performance</span></div>
      <div class="comparator__bar comparator__bar--right"><span class="comparator__fill comparator__fill--right"></span></div>
    </li>
    <!-- + 6 linhas iguais, com outros critérios e valores -->
  </ul>
</div>
```

Este é o elemento mais "orientado a dados" do site. Cada `<li class="comparator__row">` carrega dois **atributos `data-*` customizados**:

- `data-android="100"` — nota (0 a 100) do Android Nativo para aquele critério.
- `data-rn="80"` — nota do React Native para o mesmo critério.

Esses dois números **não aparecem em lugar nenhum do texto visível** — eles só existem para o JavaScript ler (`row.dataset.android`, `row.dataset.rn`) e transformar em largura de barra (`comparison.js`). É um padrão muito comum: usar `data-*` para guardar "configuração"/"dados" que o JS precisa, sem precisar de um arquivo `.json` separado.

Dentro de cada linha:
- `.comparator__bar--left` / `.comparator__bar--right`: as "trilhas" (fundo cinza, fixo) de cada lado.
- `.comparator__fill--left` / `.comparator__fill--right`: os preenchimentos coloridos, que começam com `width: 0%` no CSS e são animados pelo JS até o valor de `data-android`/`data-rn`.
- `.comparator__criterion`: o texto central (ex.: "Performance"), com um ícone Lucide.

---

## Seção 07 — Debate "Quem vence?" (`#debate`)

```html
<section class="section debate" id="debate" data-label="Debate">
```

- **Por que existe**: quebra o ritmo "sério" das seções técnicas com um momento leve/lúdico, reforçando de forma memorável que a resposta é "depende".
- **Responsabilidade**: rodar automaticamente 4 perguntas, destacando o "vencedor" de cada uma, terminando em "Empate".
- **Classes**: `section debate`.
- **Quem manipula**: `debate.js` — controla 100% da lógica (texto, destaque, resultado final).

### Elementos importantes

```html
<div class="battle" data-aos="fade-up" data-aos-delay="120">
  <div class="battle__card battle__card--android" id="battleAndroid">
    <div class="battle__icon"><i data-lucide="bot"></i></div>
    <h3>Android Nativo</h3>
  </div>

  <div class="battle__center">
    <p class="battle__question" id="battleQuestion">Maior desempenho?</p>
    <div class="battle__dots" id="battleDots"></div>
  </div>

  <div class="battle__card battle__card--rn" id="battleRN">
    <div class="battle__icon"><i data-lucide="atom"></i></div>
    <h3>React Native</h3>
  </div>
</div>

<div class="battle__result" id="battleResult">
  <span class="battle__result-label">Resultado</span>
  <span class="battle__result-value">Empate</span>
  <span class="battle__result-msg">A melhor tecnologia depende do projeto.</span>
</div>
```

Cinco `id`s são o "controle remoto" que `debate.js` usa:

| `id` | O que é | Como o JS usa |
|---|---|---|
| `debate` | A `<section>` inteira | Observado por um `IntersectionObserver` — dispara a sequência quando a seção fica visível |
| `battleQuestion` | O `<p>` com a pergunta atual | Tem seu `textContent` trocado a cada pergunta |
| `battleDots` | Um `<div>` vazio | Populado dinamicamente com um `<span class="battle__dot">` por pergunta (progresso) |
| `battleAndroid` / `battleRN` | Os dois cards | Recebem as classes `is-winner`/`is-loser` conforme a pergunta atual |
| `battleResult` | O bloco de resultado final | Começa invisível (`opacity: 0` no CSS) e ganha a classe `is-visible` no final da sequência |

O texto inicial do `<p id="battleQuestion">` ("Maior desempenho?") já vem escrito no HTML — é a primeira pergunta da lista em `debate.js`. Isso evita uma "tela vazia" caso o JavaScript demore um instante para rodar.

---

## Seção 08 — Sistemas Operacionais (`#os`)

```html
<section class="section os-section" id="os" data-label="Sistemas Operacionais">
```

- **Por que existe**: amplia o repertório além de Android/iOS, mostrando que o universo de SOs mobile é mais diverso (inclusive com sistemas praticamente extintos).
- **Responsabilidade**: apresentar 8 sistemas operacionais (Android, iOS, HarmonyOS, KaiOS, Fire OS, Ubuntu Touch, Tizen, Sailfish OS), cada um com ícone, descrição e status atual.
- **Classes**: `section os-section`.
- **Quem manipula**: `main.js` (`initTilt`, `initIcons`).

### Elementos importantes

```html
<div class="os-card" data-aos="zoom-in" data-aos-delay="0" data-tilt>
  <div class="os-card__badge" style="background: rgba(61,220,132,0.12)">
    <i data-lucide="bot" style="color:#3ddc84"></i>
  </div>
  <h3>Android</h3>
  <p class="os-card__desc">Sistema aberto do Google, baseado em Linux.</p>
  <span class="os-card__status os-card__status--active">Líder de mercado</span>
</div>
```

Cada um dos 8 cards segue exatamente essa estrutura:

- **`.os-card__badge`**: um quadrado colorido com um ícone dentro. A cor de fundo (`rgba(...)`) e a cor do ícone são definidas **inline**, porque cada sistema operacional tem sua própria cor de marca (verde do Android, laranja do Fire OS...) — criar uma classe CSS para cada uma das 8 cores seria repetitivo sem necessidade (ver [07-best-practices.md](./07-best-practices.md)).
- **`.os-card__desc`**: uma frase curta (o que é).
- **`.os-card__status`**: um "badge" de status com 3 variações possíveis — `--active` (verde, ex.: "Líder de mercado"), `--niche` (amarelo, ex.: "Nicho emergente") e `--inactive` (cinza, ex.: "Praticamente descontinuado", caso do Sailfish OS). A cor da bolinha antes do texto vem do CSS (`::before` + variável `--dot-color`), não precisa de HTML extra.

---

## Seção 09 — Mercado (`#market`)

```html
<section class="section market" id="market" data-label="Mercado">
```

- **Por que existe**: sai do campo qualitativo (comparações, opiniões) para o quantitativo — números de mercado reforçam os argumentos anteriores.
- **Responsabilidade**: mostrar 2 gráficos — participação de mercado (Android/iOS/Outros) e frameworks populares (Flutter/React Native/Nativo).
- **Classes**: `section market`.
- **Quem manipula**: `charts.js` — cria os gráficos Chart.js dentro dos `<canvas>`.

### Elementos importantes

```html
<div class="market__grid">
  <div class="chart-card" data-aos="fade-up" data-aos-delay="120">
    <h3>Participação de Mercado</h3>
    <div class="chart-card__canvas-wrap">
      <canvas id="marketShareChart"></canvas>
    </div>
  </div>

  <div class="chart-card" data-aos="fade-up" data-aos-delay="200">
    <h3>Frameworks Populares</h3>
    <div class="chart-card__canvas-wrap">
      <canvas id="frameworksChart"></canvas>
    </div>
  </div>
</div>
```

Repare que o HTML **não contém nenhum dado dos gráficos** — só duas tags `<canvas>` vazias, cada uma com um `id`. Toda a informação (rótulos, valores, cores) mora em `charts.js`. Isso é típico de qualquer biblioteca de gráficos: o `<canvas>` é apenas a "superfície de desenho" onde o JavaScript (via Chart.js) pinta pixels.

- `.chart-card__canvas-wrap` precisa ter uma altura fixa definida no CSS (`height: 260px`), porque o Chart.js, ao usar `maintainAspectRatio: false`, precisa de um contêiner com tamanho explícito para saber quão grande desenhar o gráfico.

---

## Seção 10 — Qual tecnologia escolher? (`#chooser`)

```html
<section class="section chooser" id="chooser" data-label="Qual Escolher?">
```

- **Por que existe**: transforma a teoria em prática — "dado este cenário real, o que você escolheria?".
- **Responsabilidade**: apresentar 4 cenários clicáveis que revelam a resposta recomendada.
- **Classes**: `section chooser`.
- **Quem manipula**: `quiz.js` — alterna a classe `is-flipped` no clique.

### Elementos importantes

```html
<button class="flip-card" type="button" data-aos="zoom-in" data-aos-delay="0">
  <div class="flip-card__inner">
    <div class="flip-card__face flip-card__face--front">
      <i data-lucide="landmark"></i>
      <p>Aplicativo bancário</p>
      <span class="flip-card__hint">Toque para revelar</span>
    </div>
    <div class="flip-card__face flip-card__face--back flip-card__face--native">
      <span class="flip-card__answer">Nativo</span>
      <p>Segurança máxima e acesso total ao hardware.</p>
    </div>
  </div>
</button>
```

Cada cenário é um `<button>` (não uma `<div>`!) — a escolha é intencional: botões são focáveis pelo teclado (Tab) e ativáveis com Enter/Espaço "de graça", sem precisar escrever nenhum código extra de acessibilidade.

A estrutura interna tem 3 camadas, necessárias para o efeito de flip 3D em CSS:

1. `.flip-card` (o `<button>`) — define a **perspectiva** 3D.
2. `.flip-card__inner` — o elemento que **realmente gira** (`transform: rotateY(180deg)` quando a classe `is-flipped` está presente).
3. `.flip-card__face--front` / `.flip-card__face--back` — as duas "faces" da carta, sobrepostas uma sobre a outra (`position: absolute`), cada uma escondida quando está de costas (`backface-visibility: hidden`).

A face de trás tem uma classe extra — `--native` ou `--rn` — que define a cor de destaque da resposta (verde Android ou ciano React Native), conforme o cenário.

---

## Seção 11 — Futuro / IA (`#future`)

```html
<section class="section future" id="future" data-label="Futuro">
```

- **Por que existe**: fecha o conteúdo técnico olhando para onde a área está indo.
- **Responsabilidade**: citar 4 ferramentas de IA (GitHub Copilot, ChatGPT, Gemini, Cursor) que já fazem parte do dia a dia de quem programa.
- **Classes**: `section future`.
- **Quem manipula**: `main.js` (`initIcons`); o restante é CSS puro (flutuação contínua dos cards).

### Elementos importantes

```html
<div class="future-card" data-aos="fade-up" data-aos-delay="0">
  <div class="future-card__icon" style="--icon-color:#f5f5f7"><i data-lucide="github"></i></div>
  <h3>GitHub Copilot</h3>
  <p>Sugestões de código em tempo real, direto no editor.</p>
</div>
```

Repare no `style="--icon-color:#f5f5f7"` — isso **não** é uma propriedade CSS comum, é uma **variável CSS custom property** sendo definida inline, item por item. O CSS de `.future-card__icon` então usa `var(--icon-color)` para colorir tanto o ícone quanto o brilho (`box-shadow`) ao redor dele. Essa técnica permite que os 4 cards compartilhem exatamente o mesmo CSS, mudando só uma "variável local" por elemento — sem precisar de 4 classes CSS diferentes (ver [07-best-practices.md](./07-best-practices.md)).

---

## Seção 12 — Conclusão (`#conclusion`)

```html
<section class="section conclusion" id="conclusion" data-label="Conclusão">
```

- **Por que existe**: é o "mic drop" da apresentação — a mensagem que a plateia deve levar para casa.
- **Responsabilidade**: revelar 3 frases em sequência, terminando com a mais impactante em destaque.
- **Classes**: `section conclusion`.
- **Quem manipula**: só AOS (via `data-aos-delay` crescente) — não há JavaScript customizado nesta seção.

### Elementos importantes

```html
<div class="conclusion__stack">
  <p class="conclusion__line" data-aos="fade-up" data-aos-delay="0">O futuro não é escolher um lado.</p>
  <p class="conclusion__line" data-aos="fade-up" data-aos-delay="350">O futuro é saber escolher a tecnologia certa.</p>
  <p class="conclusion__line conclusion__line--final" data-aos="fade-up" data-aos-delay="700">Todo bom desenvolvedor conhece ambas.</p>
</div>

<footer class="conclusion__footer" data-aos="fade-up" data-aos-delay="1000">
  Desenvolvimento de Software Multiplataforma · 2026
</footer>
```

As três frases usam `data-aos-delay` crescente (0ms, 350ms, 700ms) para simular uma leitura pausada, como se cada frase fosse "falada" antes da próxima aparecer. A última tem a classe extra `--final`, que a torna maior e com o texto em gradiente (mesmo efeito visual do título do Hero, fechando o ciclo visual da apresentação).

O `<footer>` é semântico (rodapé da seção) e mostra um crédito discreto, com baixa opacidade e letras pequenas — não deve competir visualmente com a mensagem principal.

---

## Fechamento do documento (scripts)

```html
</main>

<script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
<script src="assets/js/timeline.js" defer></script>
<script src="assets/js/comparison.js" defer></script>
<script src="assets/js/debate.js" defer></script>
<script src="assets/js/charts.js" defer></script>
<script src="assets/js/quiz.js" defer></script>
<script src="assets/js/main.js" defer></script>
```

Ver a explicação completa da ordem de carregamento em [01-project-structure.md](./01-project-structure.md#ordem-de-carregamento-dos-scripts-importante).
