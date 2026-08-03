# 04 — JavaScript explicado (quase) linha a linha

Este é o documento mais denso da documentação. Ele percorre os 6 arquivos `.js` do projeto, um por um, explicando cada variável, função, evento e decisão de lógica. Antes de começar, alguns conceitos que **todos** os arquivos compartilham:

## Conceitos que se repetem em todos os arquivos

### `document.addEventListener('DOMContentLoaded', () => { ... })`

Todo arquivo `.js` do projeto começa envolvendo seu código nisso:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // código do arquivo
});
```

- `document` é o objeto que representa a página HTML inteira.
- `addEventListener(nomeDoEvento, funçãoCallback)` diz: "quando `nomeDoEvento` acontecer, rode essa função".
- `'DOMContentLoaded'` é um evento disparado pelo navegador **assim que o HTML terminou de ser lido e transformado em DOM** (a árvore de elementos que o JavaScript consegue manipular) — mas **antes** de imagens e outros recursos pesados terminarem de carregar.
- `() => { ... }` é uma **arrow function** (função anônima moderna) passada como argumento — é o "o que fazer quando o evento disparar".

**Por que isso é necessário**: se um script tentasse rodar `document.getElementById('hero')` **antes** do HTML da seção `<section id="hero">` ter sido processado pelo navegador, o resultado seria `null` (elemento não encontrado), porque o elemento ainda não existiria na árvore DOM. Envolver o código em `DOMContentLoaded` garante que todo o HTML já esteja disponível quando o código roda.

> Como visto em [01-project-structure.md](./01-project-structure.md#ordem-de-carregamento-dos-scripts-importante), todos os scripts do projeto já usam o atributo `defer`, o que **também** garante execução após o HTML pronto. Usar os dois (`defer` + `DOMContentLoaded`) é redundante na prática, mas é uma prática defensiva comum: mesmo que alguém remova o `defer` no futuro, o código continua seguro.

### `IntersectionObserver`

Usado em `timeline.js` (indiretamente, via scroll), `comparison.js`, `debate.js` e `charts.js`. É a API nativa do navegador para responder a "este elemento entrou/saiu da área visível da tela" **sem** precisar calcular manualmente a posição de scroll a cada frame (o que seria caro em performance).

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // o elemento está visível agora
      }
    });
  },
  { threshold: 0.4 }
);

observer.observe(algumElemento);
```

- `new IntersectionObserver(callback, opções)` cria um "observador".
- O `callback` roda toda vez que a visibilidade de **qualquer** elemento observado muda. Ele recebe uma lista (`entries`) porque, teoricamente, vários elementos podem mudar de estado ao mesmo tempo.
- `entry.isIntersecting` é `true` quando o elemento está (pelo menos parcialmente) visível.
- `threshold: 0.4` configura "considere visível quando 40% do elemento estiver dentro da tela" (0 seria "1 pixel já conta", 1 seria "o elemento inteiro precisa estar visível").
- `observer.observe(elemento)` começa a vigiar aquele elemento específico.

### `element.dataset`

Usado para ler atributos `data-*` do HTML como um objeto JavaScript comum:

```javascript
row.dataset.android // lê o valor de data-android="100" como "100" (string)
```

### `element.classList`

A forma moderna de adicionar/remover/alternar classes CSS via JavaScript:

```javascript
el.classList.add('is-active');       // adiciona a classe
el.classList.remove('is-active');    // remove a classe
el.classList.toggle('is-flipped');   // adiciona se não tem, remove se tem
el.classList.toggle('is-winner', condicao); // adiciona se condicao for true, remove se for false
```

Esse último formato (`toggle` com segundo argumento booleano) aparece bastante no projeto — é mais direto do que escrever um `if/else` com `add`/`remove`.

---

## `assets/js/main.js` — o orquestrador geral

**Responsabilidade**: tudo que é **transversal** a várias/todas as seções — coisas que não fazem sentido isoladas em um arquivo por seção.

**Funções que ele define**: `initAOS`, `initProgressBar`, `initNavDots`, `initHero`, `initIcons`, `initTilt`.

**Elementos do DOM que manipula**: `#progressBar`, `#navDots`, `#heroCta`, `#hero`, todos os `.section`, todos os elementos com `[data-tilt]`.

**Eventos que escuta**: `DOMContentLoaded`, `scroll` (na janela), `click` (nos dots e no CTA do Hero), `mousemove`/`mouseleave` (nos elementos com tilt).

### Bloco de inicialização

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initProgressBar();
  initNavDots();
  initHero();
  initIcons();
  initTilt();
});
```
Assim que o HTML está pronto, `main.js` chama, em sequência, 6 funções — cada uma "liga" um pedaço de funcionalidade independente. Elas são chamadas em ordem, mas **não dependem umas das outras** (poderiam estar em qualquer ordem sem quebrar nada).

### `initAOS()`

```javascript
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });
}
```
- `if (typeof AOS === 'undefined') return;` — uma **guarda de segurança**: `AOS` é o objeto global criado pela biblioteca externa (carregada via CDN). Se, por qualquer motivo, a biblioteca não carregar (ex.: sem internet), `AOS` não vai existir e tentar chamar `AOS.init(...)` causaria um erro que **pararia a execução do resto do script**. Esse `if` evita isso: se a biblioteca não existe, a função simplesmente não faz nada (o resto do site continua funcionando, só sem as animações de scroll do AOS).
- `AOS.init({ ... })` configura a biblioteca globalmente:
  - `duration: 800` — toda animação AOS dura 800ms, salvo se um elemento tiver sua própria duração via atributo HTML (não usado neste projeto).
  - `easing: 'ease-out-cubic'` — a curva de suavização (começa rápido, desacelera no final).
  - `once: true` — cada elemento anima **uma única vez**; se o usuário rolar para cima e para baixo de novo, a animação não repete (evita "piscar" o conteúdo repetidamente).
  - `offset: 80` — a animação dispara quando o elemento está a 80px de entrar na tela (uma pequena antecipação).

### `initProgressBar()`

```javascript
function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', () => requestAnimationFrame(updateProgress), { passive: true });
  updateProgress();
}
```

- `const bar = document.getElementById('progressBar');` — busca a `<div id="progressBar">` do HTML.
- `if (!bar) return;` — outra guarda de segurança: se o elemento não existe (ex.: alguém removeu do HTML por engano), a função para aqui, sem erro.
- **A função `updateProgress`** calcula a porcentagem de scroll:
  - `window.scrollY` — quantos pixels a página já rolou verticalmente, a partir do topo.
  - `document.documentElement.scrollHeight` — a altura **total** do documento (incluindo o que está fora da tela).
  - `window.innerHeight` — a altura da janela visível (viewport).
  - `docHeight` é, portanto, "quantos pixels ainda dá para rolar no total" (altura total menos uma tela).
  - `progress = (scrollTop / docHeight) * 100` transforma isso em porcentagem: 0% no topo da página, 100% quando chegou ao fim.
  - O operador ternário `docHeight > 0 ? ... : 0` evita uma divisão por zero (aconteceria se a página inteira coubesse em uma tela, sem nada para rolar).
  - `bar.style.width = \`${progress}%\`;` — usa uma **template string** (crases + `${}`) para montar a string `"37.5%"`, por exemplo, e aplica diretamente como largura via CSS inline.
- `window.addEventListener('scroll', () => requestAnimationFrame(updateProgress), { passive: true });`
  - Toda vez que a página rola, chama `updateProgress` — mas **envolto em `requestAnimationFrame`**. Isso é uma otimização de performance: o evento `scroll` pode disparar dezenas de vezes por segundo, mais rápido do que a tela consegue redesenhar; `requestAnimationFrame` agenda a atualização para o próximo quadro de renderização do navegador, evitando trabalho duplicado/desperdiçado.
  - `{ passive: true }` avisa o navegador que esse listener **nunca vai chamar `preventDefault()`**, permitindo que ele otimize o scroll (não precisa esperar o JavaScript "decidir" se pode rolar ou não).
- `updateProgress();` no final — chama a função uma vez **imediatamente**, para a barra já nascer com o valor correto (caso a página seja recarregada no meio do scroll, por exemplo), sem esperar o primeiro evento de `scroll`.

### `initNavDots()`

```javascript
function initNavDots() {
  const nav = document.getElementById('navDots');
  const sections = document.querySelectorAll('.section');
  if (!nav || !sections.length) return;

  sections.forEach((section) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dots__dot';
    dot.dataset.label = section.dataset.label || section.id;
    dot.setAttribute('aria-label', `Ir para ${dot.dataset.label}`);
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    dot.dataset.target = section.id;
    nav.appendChild(dot);
  });

  const dots = nav.querySelectorAll('.nav-dots__dot');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          dots.forEach((d) => d.classList.remove('is-active'));
          const activeDot = nav.querySelector(`[data-target="${entry.target.id}"]`);
          if (activeDot) activeDot.classList.add('is-active');
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}
```

Esta é a função mais elaborada de `main.js`. Ela faz duas coisas: **criar** os dots dinamicamente e **mantê-los sincronizados** com o scroll.

**Parte 1 — criação dos dots**:
- `document.querySelectorAll('.section')` retorna **todos** os elementos com a classe `.section` (as 12 `<section>`), em uma `NodeList` (parecida com um array).
- `sections.forEach((section) => { ... })` percorre cada uma:
  - `document.createElement('button')` cria um `<button>` **novo, em memória** (ainda não está na página).
  - `dot.className = 'nav-dots__dot'` aplica a classe CSS.
  - `dot.dataset.label = section.dataset.label || section.id;` — lê o `data-label` da seção (ex.: `data-label="Início"` do Hero); se não existir, usa o `id` da seção como texto alternativo (o operador `||` retorna o primeiro valor "verdadeiro"; strings vazias/`undefined` são "falsos", então cai no `id`).
  - `dot.setAttribute('aria-label', ...)` — melhora a acessibilidade: leitores de tela vão anunciar "Ir para Início", "Ir para Android Studio", etc., em vez de nada (o dot não tem texto visível).
  - `dot.addEventListener('click', () => { section.scrollIntoView({ behavior: 'smooth' }); });` — ao clicar no dot, rola suavemente até a seção correspondente. `scrollIntoView` é um método nativo que rola a página até que o elemento chamado fique visível; `{ behavior: 'smooth' }` anima essa rolagem em vez de "pular".
  - `dot.dataset.target = section.id;` — grava, no próprio dot, **qual** seção ele representa (usado depois para achar o dot certo).
  - `nav.appendChild(dot);` — finalmente insere o botão criado dentro do `<nav id="navDots">`, tornando-o visível na página.

**Parte 2 — sincronizar o dot ativo com o scroll**:
- `nav.querySelectorAll('.nav-dots__dot')` — agora que os dots existem, pega todos eles de uma vez.
- Um novo `IntersectionObserver` observa **as seções** (não os dots). Quando uma seção fica visível (`entry.isIntersecting`):
  1. `dots.forEach((d) => d.classList.remove('is-active'));` — remove o destaque de **todos** os dots (limpa o estado anterior).
  2. `nav.querySelector(\`[data-target="${entry.target.id}"]\`)` — usa um **seletor de atributo CSS** para achar, entre os dots, aquele cujo `data-target` bate com o `id` da seção que acabou de aparecer.
  3. `activeDot.classList.add('is-active');` — destaca esse dot.
- `sections.forEach((section) => observer.observe(section));` — registra as 12 seções para serem vigiadas.

### `initHero()`

```javascript
function initHero() {
  const cta = document.getElementById('heroCta');
  if (!cta) return;

  cta.addEventListener('click', () => {
    const hero = document.getElementById('hero');
    const next = hero?.nextElementSibling;
    if (next) {
      next.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
```
- Busca o botão "Iniciar Jornada" (`#heroCta`).
- Ao clicar, busca a seção Hero (`#hero`) e usa `nextElementSibling` — uma propriedade nativa que retorna **o elemento irmão seguinte** no HTML (ou seja, "a seção logo depois do Hero", que hoje é a Linha do Tempo).
- `hero?.nextElementSibling` — o `?.` é o **optional chaining**: se `hero` fosse `null` (não deveria acontecer, mas é uma proteção), a expressão inteira vira `undefined` em vez de lançar um erro.
- **Por que isso é interessante**: o botão não está "programado" para ir especificamente à Linha do Tempo — ele vai para "o que vier depois do Hero no HTML". Se, no futuro, alguém reordenar as seções e colocar outra logo após o Hero, o botão continua funcionando corretamente sem precisar editar `main.js`.

### `initIcons()`

```javascript
function initIcons() {
  if (typeof lucide === 'undefined') return;
  lucide.createIcons();
}
```
Mesma lógica de guarda de segurança do `initAOS`. `lucide.createIcons()` é a função da biblioteca Lucide que varre o documento inteiro procurando `<i data-lucide="nome-do-icone">` e substitui cada uma por um `<svg>` real correspondente.

### `initTilt()`

```javascript
function initTilt() {
  const tiltEls = document.querySelectorAll('[data-tilt]');
  const maxTilt = 6; // graus

  tiltEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  });
}
```
Este é o efeito "o card inclina seguindo o mouse", explicado com mais detalhe em [06-animations.md](./06-animations.md#tilt-3d). Resumo da matemática:
- `document.querySelectorAll('[data-tilt]')` — **seletor de atributo**: pega **qualquer** elemento que tenha o atributo `data-tilt`, não importa a classe ou o valor do atributo. É assim que o mesmo efeito funciona em elementos completamente diferentes (mockup da IDE, cards de feature, cards de SO...) sem precisar de uma função separada para cada um.
- `el.getBoundingClientRect()` — retorna a posição e o tamanho atual do elemento na tela (`top`, `left`, `width`, `height`).
- `x` e `y` são calculados como "a posição do mouse dentro do elemento, normalizada entre -0.5 e +0.5" (0 = centro do elemento).
- O `transform` combina `perspective` (dá profundidade 3D à cena) com `rotateY` (gira no eixo vertical, baseado no `x`) e `rotateX` (gira no eixo horizontal, baseado no `y`, com sinal invertido para o movimento parecer natural — mover o mouse para cima inclina o topo do card "para longe" de você).
- No `mouseleave` (quando o mouse sai do elemento), o `transform` volta a zero, e a `transition` definida no CSS (`.feature-card`, `.ide-mock`, etc.) faz esse retorno ser suave.

---

## `assets/js/timeline.js`

**Responsabilidade única**: calcular e aplicar a altura da barra de progresso vertical da Linha do Tempo (seção 02), conforme o scroll.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.timeline__track');
  const progress = document.getElementById('timelineProgress');
  if (!track || !progress) return;

  const updateTimelineProgress = () => {
    const rect = track.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;

    const raw = (viewportCenter - rect.top) / rect.height;
    const clamped = Math.min(Math.max(raw, 0), 1);

    progress.style.height = `${clamped * 100}%`;
  };

  window.addEventListener('scroll', () => requestAnimationFrame(updateTimelineProgress), { passive: true });
  window.addEventListener('resize', updateTimelineProgress);
  updateTimelineProgress();
});
```

- `track` é o contêiner `.timeline__track` (a trilha inteira). `progress` é a `<div>` que vai crescer.
- **A matemática de `updateTimelineProgress`**:
  - `rect.top` é a distância entre o topo da trilha e o topo da tela **agora** (muda a cada scroll — fica negativo quando a trilha já passou do topo da tela).
  - `viewportCenter` é o meio vertical da tela.
  - `raw = (viewportCenter - rect.top) / rect.height` — a ideia: quando o **topo da trilha** está exatamente no centro da tela, `viewportCenter - rect.top` é 0, então `raw` é 0 (0% preenchido). Conforme a página rola e a trilha "sobe" (rect.top fica cada vez mais negativo), esse número cresce. Quando o **final da trilha** (`rect.top + rect.height`) passa do centro da tela, a conta resulta em `raw >= 1` (100% preenchido).
  - `Math.min(Math.max(raw, 0), 1)` é o padrão **clamp manual** (limitar um valor entre um mínimo e um máximo) — `Math.max(raw, 0)` garante que não fique negativo, e `Math.min(..., 1)` garante que não passe de 1. Sem isso, a altura da barra poderia tentar ser "-15%" ou "140%", valores sem sentido.
  - `progress.style.height = \`${clamped * 100}%\`;` — transforma a fração (0 a 1) em porcentagem (0% a 100%) e aplica.
- Três formas de disparar o recálculo: ao rolar (`scroll`, via `requestAnimationFrame`, mesma otimização do `progressBar`), ao redimensionar a janela (`resize` — importante porque `rect.height` muda se a página reflow por causa da largura da tela mudando) e uma chamada imediata no final, para o estado inicial já estar correto ao carregar a página.

---

## `assets/js/comparison.js`

**Responsabilidade única**: animar as barras "divergentes" da seção de Comparação (seção 06), fazendo-as crescer de 0% até o valor real **apenas quando cada linha entra na tela**.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.comparator__row');
  if (!rows.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const row = entry.target;
        const left = row.querySelector('.comparator__fill--left');
        const right = row.querySelector('.comparator__fill--right');

        if (left) left.style.width = `${row.dataset.android}%`;
        if (right) right.style.width = `${row.dataset.rn}%`;

        observer.unobserve(row);
      });
    },
    { threshold: 0.4 }
  );

  rows.forEach((row) => observer.observe(row));
});
```

- `document.querySelectorAll('.comparator__row')` — pega as 7 linhas de critérios.
- O `IntersectionObserver` observa cada linha individualmente (não a seção inteira) — isso permite que **cada linha anime no seu próprio momento**, conforme o usuário rola e ela vai entrando na tela, uma de cada vez, em vez de todas ao mesmo tempo.
- Para cada linha que entra na tela (`entry.isIntersecting`):
  - `entry.target` é o elemento observado que mudou de estado — nesse caso, a própria `<li class="comparator__row">`.
  - `row.querySelector('.comparator__fill--left')` busca, **dentro** daquela linha específica, o preenchimento esquerdo.
  - `row.dataset.android` lê o atributo `data-android="100"` do HTML como a string `"100"`.
  - `left.style.width = \`${row.dataset.android}%\`;` — aplica a largura final. Como o CSS já define `transition: width 1.1s ...` na classe `.comparator__fill`, essa mudança de `0%` (valor inicial do CSS) para, por exemplo, `100%`, **anima suavemente** — o JavaScript só precisa definir o valor final; a suavização é 100% responsabilidade do CSS.
  - `observer.unobserve(row);` — depois de animar, para de observar aquela linha. Isso é importante: sem essa linha, se o usuário rolasse para cima e para baixo repetidamente, a barra ficaria sendo "resetada" (não, na verdade não seria resetada, pois o `style.width` já foi setado uma vez e permanece — mas observar para sempre seria desperdício de processamento sem nenhum benefício, já que a animação só deve acontecer uma vez).

---

## `assets/js/debate.js`

**Responsabilidade única**: rodar a sequência automática de perguntas da seção "Quem vence?" (seção 07) e revelar o resultado final.

Este é o arquivo com a lógica mais "temporal" do projeto (usa `setTimeout` e `setInterval`).

```javascript
const DEBATE_QUESTIONS = [
  { text: 'Maior desempenho?', winner: 'android' },
  { text: 'Desenvolvimento mais rápido?', winner: 'rn' },
  { text: 'Acesso total ao hardware?', winner: 'android' },
  { text: 'Um código para as duas plataformas?', winner: 'rn' },
];
```
Um **array de objetos** guarda os "dados" do debate: cada pergunta tem um `text` (o que aparece na tela) e um `winner` (`'android'` ou `'rn'`, usado para decidir qual card destacar). Definir isso como dados, fora da função, separa "o conteúdo" (fácil de editar — quer mudar as perguntas? Só mexer nesse array) da "lógica" (como exibir).

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('debate');
  const questionEl = document.getElementById('battleQuestion');
  const dotsWrap = document.getElementById('battleDots');
  const androidCard = document.getElementById('battleAndroid');
  const rnCard = document.getElementById('battleRN');
  const resultEl = document.getElementById('battleResult');

  if (!section || !questionEl || !dotsWrap || !androidCard || !rnCard || !resultEl) return;
```
Busca os 6 elementos necessários. A guarda `if (!a || !b || !c...) return;` só continua se **todos** existirem — basta um faltar para a função inteira ser abortada (evita erros de "não consigo ler propriedade de null" mais adiante).

```javascript
  DEBATE_QUESTIONS.forEach(() => {
    const dot = document.createElement('span');
    dot.className = 'battle__dot';
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.battle__dot');
```
Cria dinamicamente um `<span class="battle__dot">` para **cada pergunta** do array (4 dots), do mesmo jeito que `initNavDots()` cria os dots de navegação — o número de dots de progresso está sempre sincronizado com o número de perguntas, mesmo que alguém adicione uma 5ª pergunta no array no futuro.

```javascript
  const setWinner = (winner) => {
    const androidWins = winner === 'android';
    androidCard.classList.toggle('is-winner', androidWins);
    androidCard.classList.toggle('is-loser', !androidWins);
    rnCard.classList.toggle('is-winner', !androidWins);
    rnCard.classList.toggle('is-loser', androidWins);
  };
```
Função auxiliar: recebe `'android'` ou `'rn'` e aplica as classes corretas nos dois cards de uma vez. Usar `toggle(classe, condicaoBooleana)` nas 4 linhas evita um bloco `if/else` maior — cada linha "decide sozinha" se aquela classe específica deve estar presente.

```javascript
  const showQuestion = (index) => {
    questionEl.classList.add('is-fading');
    setTimeout(() => {
      questionEl.textContent = DEBATE_QUESTIONS[index].text;
      setWinner(DEBATE_QUESTIONS[index].winner);
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      questionEl.classList.remove('is-fading');
    }, 300);
  };
```
Esta função troca a pergunta exibida, com uma transição de **crossfade** (desaparece, troca o texto, reaparece):
1. `questionEl.classList.add('is-fading')` — o CSS de `.battle__question.is-fading` define `opacity: 0`, então o texto começa a sumir (a transição de opacidade do CSS cuida do "suave").
2. `setTimeout(() => { ... }, 300)` — **espera 300 milissegundos** (tempo aproximado da transição de saída) antes de rodar o código de dentro. `setTimeout` agenda uma função para rodar **uma única vez**, depois de um atraso.
3. Dentro do timeout: troca o `textContent` (o texto real do parágrafo) para a nova pergunta, chama `setWinner` para destacar o card certo, e atualiza qual dot está ativo — `dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index))` percorre todos os dots, comparando o **índice de cada um** (`i`) com o índice da pergunta atual (`index`); só o dot cujo índice bate recebe `is-active`.
4. `questionEl.classList.remove('is-fading')` — remove a classe, fazendo o texto (já trocado) reaparecer suavemente.

```javascript
  const revealResult = () => {
    questionEl.classList.add('is-fading');
    setTimeout(() => {
      questionEl.textContent = 'E aí, quem venceu?';
      androidCard.classList.remove('is-winner', 'is-loser');
      rnCard.classList.remove('is-winner', 'is-loser');
      questionEl.classList.remove('is-fading');
      resultEl.classList.add('is-visible');
    }, 300);
  };
```
Mesma técnica de crossfade, mas para o "encerramento": troca o texto para uma pergunta retórica, **remove** todas as classes de vencedor/perdedor dos dois cards (voltam ao estado neutro, simbolizando o empate) e adiciona `is-visible` ao painel de resultado (que o CSS anima de `opacity: 0` para `opacity: 1`).

```javascript
  let started = false;
  const QUESTION_INTERVAL_MS = 2200;

  const runSequence = () => {
    if (started) return;
    started = true;

    showQuestion(0);
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      if (index >= DEBATE_QUESTIONS.length) {
        clearInterval(interval);
        setTimeout(revealResult, 1200);
        return;
      }
      showQuestion(index);
    }, QUESTION_INTERVAL_MS);
  };
```
Esta é a função que **encadeia** tudo:
- `let started = false;` — uma variável de controle (uma "trava") para garantir que a sequência **só rode uma vez**, mesmo que o gatilho de visibilidade dispare múltiplas vezes.
- `if (started) return; started = true;` — na primeira chamada, `started` é `false`, então passa pela guarda e imediatamente vira `true`. Em qualquer chamada seguinte, a função para logo no início.
- `showQuestion(0)` — mostra a primeira pergunta imediatamente.
- `setInterval(() => { ... }, QUESTION_INTERVAL_MS)` — diferente de `setTimeout` (que roda uma vez), `setInterval` **repete** a função a cada 2200ms, indefinidamente, até ser explicitamente parado.
- Dentro do intervalo: incrementa `index`, e se já passou da última pergunta (`index >= DEBATE_QUESTIONS.length`), **para o intervalo** (`clearInterval(interval)` — essencial, senão ele continuaria rodando para sempre em segundo plano) e agenda `revealResult` para rodar 1200ms depois (um respiro antes de mostrar o resultado). Caso contrário, mostra a próxima pergunta (`showQuestion(index)`).

```javascript
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) runSequence();
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(section);
});
```
O gatilho de tudo: quando a `<section id="debate">` fica 50% visível, chama `runSequence()`. Como `runSequence` já se protege com a variável `started`, não tem problema esse observer continuar "vivo" (ele nunca é explicitamente desligado) — ele só vai chamar a função de novo se o usuário sair e voltar para a seção, mas a trava impede qualquer efeito colateral.

---

## `assets/js/charts.js`

**Responsabilidade única**: criar os dois gráficos Chart.js da seção Mercado (seção 09), no momento em que cada `<canvas>` entra na tela.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#a1a1aa';
```
Guarda de segurança de novo (biblioteca `Chart` pode não existir). Depois, configura **globalmente** a fonte e a cor padrão de texto de todos os gráficos que forem criados — em vez de repetir essas duas propriedades em cada gráfico individualmente.

```javascript
  const marketShareCanvas = document.getElementById('marketShareChart');
  const frameworksCanvas = document.getElementById('frameworksChart');
  if (!marketShareCanvas || !frameworksCanvas) return;

  const tooltipStyle = {
    backgroundColor: '#16161c',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 10,
    titleFont: { family: "'Space Grotesk', sans-serif" },
  };
```
Busca os dois elementos `<canvas>`. `tooltipStyle` é um **objeto reutilizável** com a aparência da caixinha que aparece ao passar o mouse sobre uma fatia/barra do gráfico — definido uma vez para não repetir essas 5 propriedades em cada um dos dois gráficos.

```javascript
  const createMarketShareChart = () => {
    new Chart(marketShareCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Android', 'iOS', 'Outros'],
        datasets: [
          {
            data: [71, 27, 2],
            backgroundColor: ['#3ddc84', '#e5e5e7', '#71717a'],
            borderColor: '#101015',
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', boxWidth: 8 },
          },
          tooltip: {
            ...tooltipStyle,
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` },
          },
        },
        animation: { animateRotate: true, animateScale: true, duration: 1200 },
      },
    });
  };
```
`new Chart(canvas, configuração)` é a chamada da biblioteca Chart.js que efetivamente desenha o gráfico. A `configuração` é um objeto grande com três partes:
- `type: 'doughnut'` — tipo de gráfico (rosquinha, uma variação da pizza com um buraco no meio).
- `data` — os dados reais: `labels` (nomes das fatias) e `datasets` (os valores e cores de cada fatia, na mesma ordem dos `labels`).
- `options` — configurações visuais/comportamentais:
  - `responsive: true` + `maintainAspectRatio: false` — o gráfico se redimensiona com o contêiner, mas **sem manter uma proporção fixa** de largura/altura (permite que ele preencha a altura de `260px` definida no CSS, em vez de calcular sozinho).
  - `cutout: '68%'` — o tamanho do "buraco" central (o que diferencia doughnut de pizza).
  - `plugins.legend` — configura a legenda (embaixo, com bolinhas em vez de quadrados).
  - `plugins.tooltip: { ...tooltipStyle, callbacks: {...} }` — o `...tooltipStyle` é o **spread operator**: copia todas as propriedades do objeto `tooltipStyle` para dentro deste objeto, e em seguida adiciona uma propriedade extra (`callbacks`) específica deste gráfico. É uma forma de "herdar" um estilo base e customizar só o que muda.
  - `callbacks: { label: (ctx) => \` ${ctx.label}: ${ctx.parsed}%\` }` — customiza o texto do tooltip: em vez do padrão do Chart.js, formata como `"Android: 71%"`. `ctx` é o contexto fornecido pela biblioteca com os dados daquele ponto específico.
  - `animation: { animateRotate: true, animateScale: true, duration: 1200 }` — a animação de entrada nativa do Chart.js (o gráfico "gira e cresce" ao aparecer), com duração de 1200ms.

```javascript
  const createFrameworksChart = () => {
    new Chart(frameworksCanvas, {
      type: 'bar',
      data: {
        labels: ['Flutter', 'React Native', 'Nativo'],
        datasets: [{ data: [45, 35, 20], backgroundColor: [...], borderRadius: 8, maxBarThickness: 56 }],
      },
      options: {
        ...
        scales: {
          y: { beginAtZero: true, max: 50, grid: {...}, ticks: { callback: (v) => `${v}%` } },
          x: { grid: { display: false } },
        },
        ...
      },
    });
  };
```
O segundo gráfico é de barras (`type: 'bar'`). A diferença principal em relação ao doughnut é o objeto `scales`, que só faz sentido em gráficos com eixos: define o eixo Y começando em zero (`beginAtZero: true`), com um teto de 50 (`max: 50`, já que o maior valor é 45%, dando uma folga visual no topo), e formatando cada marcação do eixo com um `%` no final via `ticks.callback`. O eixo X (`x: { grid: { display: false } }`) esconde as linhas de grade verticais, deixando o gráfico visualmente mais limpo.

```javascript
  let marketChartCreated = false;
  let frameworksChartCreated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target === marketShareCanvas && !marketChartCreated) {
          createMarketShareChart();
          marketChartCreated = true;
        }

        if (entry.target === frameworksCanvas && !frameworksChartCreated) {
          createFrameworksChart();
          frameworksChartCreated = true;
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(marketShareCanvas);
  observer.observe(frameworksCanvas);
});
```
Mesmo padrão de "trava booleana" visto em `debate.js`, mas aqui há **duas travas** (uma por gráfico), porque os dois `<canvas>` são observados pelo **mesmo** `IntersectionObserver` (é possível observar vários elementos diferentes com um único observador — o callback recebe `entries` e cada `entry.target` diz qual elemento específico mudou). O `if (entry.target === marketShareCanvas ...)` verifica **qual dos dois** canvases entrou na tela, para criar o gráfico certo, sem recriar um gráfico já existente (o que causaria bugs visuais/duplicação).

> **Por que criar os gráficos "atrasado" (lazy) em vez de já no carregamento da página?** Se os gráficos fossem criados imediatamente no `DOMContentLoaded`, a animação de entrada do Chart.js (`animateRotate`, o crescimento das barras) já teria terminado **antes** do usuário rolar até a seção Mercado — ele nunca veria a animação, só o gráfico já pronto e parado. Criar o gráfico só quando o `<canvas>` fica visível garante que a animação aconteça no momento certo da narrativa.

---

## `assets/js/quiz.js`

**Responsabilidade única**: alternar a classe `is-flipped` nos cards da seção "Qual tecnologia escolher?" (seção 10) ao clicar.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });
  });
});
```
O arquivo mais curto e simples do projeto — de propósito. Busca os 4 `<button class="flip-card">` e, para cada um, registra um listener de clique que apenas alterna a classe `is-flipped`. Toda a "mágica" visual do flip (a rotação 3D) é responsabilidade do CSS (`.flip-card.is-flipped .flip-card__inner { transform: rotateY(180deg); }`) — o JavaScript aqui só decide **quando** aplicar a classe, sem saber nada sobre como a rotação é desenhada. Essa separação (JS decide "o quê", CSS decide "como") é uma boa prática explicada em [07-best-practices.md](./07-best-practices.md).
