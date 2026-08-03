# 08 — Notas de Aprendizado

Este documento é diferente dos anteriores: em vez de explicar "o que este arquivo faz", ele explica **os conceitos de JavaScript e CSS moderno** usados no projeto, um por um, como se fosse uma aula. Se você é iniciante e algum trecho de código em [04-javascript.md](./04-javascript.md) ou [03-css.md](./03-css.md) não fez sentido, volte aqui para entender o conceito isoladamente, com exemplos simples, antes de reler o código real do projeto.

---

## JavaScript

### Arrow functions (`=>`)

```javascript
// Forma antiga (function tradicional)
function somar(a, b) {
  return a + b;
}

// Arrow function equivalente
const somar = (a, b) => {
  return a + b;
};

// Arrow function "curta" (return implícito, sem chaves)
const somar = (a, b) => a + b;
```

No projeto, quase toda função é uma arrow function: `() => { ... }`. Duas diferenças importantes em relação a `function`:
1. São mais curtas de escrever, especialmente como argumento de outra função (`addEventListener('click', () => { ... })`).
2. Não têm seu próprio `this` — elas "herdam" o `this` de onde foram escritas. Isso raramente importa neste projeto (que usa pouco `this`), mas é a razão técnica pela qual arrow functions viraram o padrão em JavaScript moderno para callbacks.

### Template strings (crases + `${}`)

```javascript
const nome = 'Timeline';
const progresso = 42;

// Forma antiga
const texto = 'Progresso de ' + nome + ': ' + progresso + '%';

// Template string
const texto = `Progresso de ${nome}: ${progresso}%`;
```

Usadas em todo o projeto para montar strings com valores dinâmicos: `bar.style.width = \`${progress}%\`;`, `\`Ir para ${dot.dataset.label}\``. Qualquer coisa dentro de `${...}` é avaliada como código JavaScript e o resultado é inserido na string.

### `const` vs `let`

```javascript
const PI = 3.14;   // não pode ser reatribuído depois
let contador = 0;  // pode ser reatribuído
contador = 1;      // OK
PI = 3;            // ERRO — const não permite reatribuição
```

O projeto usa `const` como padrão para tudo (a maioria absoluta das variáveis) e só usa `let` quando o valor **precisa** mudar depois — por exemplo, `let index = 0;` em `debate.js`, que é incrementado dentro do `setInterval`. Preferir `const` sempre que possível é uma prática comum: torna mais fácil ler o código sabendo que aquele valor nunca vai mudar depois de criado, o que reduz a chance de bugs.

> `var` (ainda mais antigo que `let`/`const`) não é usado em nenhum lugar do projeto — é considerado obsoleto no JavaScript moderno por causa de um comportamento de escopo confuso.

### Optional chaining (`?.`)

```javascript
const hero = document.getElementById('hero');
const next = hero?.nextElementSibling;
```

Se `hero` for `null` ou `undefined`, `hero?.nextElementSibling` não gera erro — o resultado inteiro vira `undefined`. Sem o `?.`, tentar ler `.nextElementSibling` de um valor `null` lançaria `TypeError: Cannot read properties of null`, interrompendo o script. É uma forma curta de escrever "só continue se isso existir".

### Spread operator (`...`)

```javascript
const tooltipStyle = { backgroundColor: '#16161c', padding: 10 };

const tooltipConfig = {
  ...tooltipStyle,              // copia backgroundColor e padding para cá
  callbacks: { label: () => '...' }, // e adiciona mais uma propriedade
};
// resultado: { backgroundColor: '#16161c', padding: 10, callbacks: {...} }
```

Usado em `charts.js` para reaproveitar um objeto de estilo base (`tooltipStyle`) em dois gráficos diferentes, adicionando uma configuração extra (`callbacks`) específica de cada um, sem precisar copiar/colar todas as propriedades manualmente.

### Ternário (`condição ? seVerdadeiro : seFalso`)

```javascript
const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
```

É uma forma curta de `if/else` quando o único objetivo é **escolher um valor**. Equivalente a:
```javascript
let progress;
if (docHeight > 0) {
  progress = (scrollTop / docHeight) * 100;
} else {
  progress = 0;
}
```

### `||` (OR) como "valor padrão"

```javascript
dot.dataset.label = section.dataset.label || section.id;
```

Em JavaScript, `||` retorna o **primeiro valor "verdadeiro" (truthy)** entre os dois lados. Se `section.dataset.label` existir (uma string não vazia é "truthy"), esse valor é usado; se for `undefined` (o atributo `data-label` não existe no HTML), o `||` "cai" para o segundo valor, `section.id`. É um padrão comum para definir valores padrão de forma curta.

### `Array.prototype.forEach`

```javascript
sections.forEach((section) => {
  // roda uma vez para cada item de "sections"
});
```

Percorre uma lista (aqui, o resultado de `querySelectorAll`, que é uma `NodeList`, muito parecida com um array) executando a função para cada item. É a forma mais usada no projeto para "fazer algo com cada elemento de uma lista", em vez de um `for` tradicional (`for (let i = 0; i < sections.length; i++) { ... }`) — mais curto e mais difícil de errar (não há risco de errar o índice do loop).

### `document.querySelector` vs `querySelectorAll` vs `getElementById`

```javascript
document.getElementById('progressBar');      // 1 elemento específico, por id (mais rápido)
document.querySelector('.timeline__track');   // o PRIMEIRO elemento que casa com o seletor CSS
document.querySelectorAll('.feature-card');   // TODOS os elementos que casam (NodeList)
```

`querySelector`/`querySelectorAll` aceitam **qualquer seletor CSS válido** (classe, atributo, combinações), o que os torna mais flexíveis que `getElementById` (que só busca por `id`, mas é ligeiramente mais rápido/direto para esse caso específico). O projeto usa os três, escolhendo conforme a necessidade: `getElementById` quando busca um elemento único e conhecido (`#progressBar`), `querySelectorAll` quando precisa de todos os elementos de um tipo (`.comparator__row`).

### `element.dataset`

```html
<li class="comparator__row" data-android="100" data-rn="80">
```
```javascript
row.dataset.android // "100" (sempre uma string, mesmo que pareça um número)
row.dataset.rn       // "80"
```

Qualquer atributo `data-nome-com-tracos="valor"` no HTML vira `elemento.dataset.nomeComTracos` (note a conversão de `kebab-case` para `camelCase`) em JavaScript. É a forma padrão de "guardar dados" em um elemento HTML sem inventar atributos não-padrão.

### Eventos e `addEventListener`

```javascript
elemento.addEventListener('click', funcaoQueRodaAoClicar);
elemento.addEventListener('mousemove', funcaoQueRodaAoMoverMouse);
window.addEventListener('scroll', funcaoQueRodaAoRolar);
window.addEventListener('resize', funcaoQueRodaAoRedimensionar);
document.addEventListener('DOMContentLoaded', funcaoQueRodaQuandoHTMLPronto);
```

O padrão é sempre o mesmo: `alvo.addEventListener('nome-do-evento', callback)`. O "alvo" pode ser qualquer elemento (`document`, `window`, ou um elemento específico como um `<button>`). Uma mesma função pode escutar quantos eventos diferentes forem necessários, e um mesmo evento pode ter vários listeners diferentes.

### `setTimeout` vs `setInterval`

```javascript
setTimeout(() => { console.log('rodou uma vez, depois de 1 segundo'); }, 1000);

const id = setInterval(() => { console.log('roda a cada 1 segundo, para sempre'); }, 1000);
clearInterval(id); // para de repetir
```

`setTimeout` agenda algo para rodar **uma vez**, depois de X milissegundos. `setInterval` repete **para sempre**, a cada X milissegundos, até que `clearInterval` seja chamado passando o identificador retornado por `setInterval`. **Esquecer de chamar `clearInterval`** é um erro comum de iniciante que faz o código continuar rodando em segundo plano desnecessariamente (em `debate.js`, isso é tratado explicitamente quando a última pergunta é alcançada).

### `IntersectionObserver`

Já explicado em detalhe em [04-javascript.md](./04-javascript.md#intersectionobserver). Resumo mental: é como dizer ao navegador "me avise quando ESTE elemento entrar ou sair da tela" — sem precisar ficar checando manualmente a posição de scroll o tempo todo.

### Guard clause (cláusula de guarda)

```javascript
function fazAlgo() {
  if (!condicaoNecessaria) return; // sai cedo se a condição não for atendida
  // resto do código, sabendo que a condição é verdadeira
}
```

Um padrão de estilo de código: em vez de aninhar todo o resto da função dentro de um `if (condicao) { ... tudo aqui ... }`, você "sai cedo" quando a condição **não** é atendida. O código resultante tem menos níveis de indentação e é mais fácil de ler. Usado em praticamente toda função deste projeto (ver [07-best-practices.md](./07-best-practices.md#2-guard-clauses-cláusulas-de-guarda)).

---

## CSS

### Variáveis CSS (custom properties)

```css
:root { --minha-cor: #5b8cff; }
.elemento { color: var(--minha-cor); }
```

Diferente de variáveis em uma linguagem de programação, variáveis CSS **podem ser redefinidas em qualquer seletor**, não só no `:root`, e o valor "vence" segue as mesmas regras de especificidade do CSS normal. É por isso que o truque de `.os-card__status--active { --dot-color: #4ade80; }` funciona: está redefinindo a variável **apenas dentro daquele elemento específico com essa classe**, sem afetar o valor global em `:root`.

### Flexbox: os 2 eixos

Flexbox organiza itens em **uma linha** (`row`, padrão) ou **uma coluna** (`column`). As duas propriedades mais usadas:
- `justify-content` — alinha no eixo **principal** (horizontal, se `row`).
- `align-items` — alinha no eixo **transversal** (vertical, se `row`).

```css
.container {
  display: flex;
  justify-content: center; /* centraliza horizontalmente, se row */
  align-items: center;     /* centraliza verticalmente, se row */
}
```

Truque mental: se `flex-direction: column`, os dois eixos **trocam de papel** — `justify-content` passa a controlar o vertical, `align-items` o horizontal.

### Grid: linhas e colunas ao mesmo tempo

```css
.container {
  display: grid;
  grid-template-columns: 1fr 190px 1fr; /* 3 colunas: flexível, fixa, flexível */
  gap: 1rem; /* espaço entre linhas E colunas */
}
```

`fr` significa "fração do espaço disponível" — é uma unidade exclusiva do Grid. `1fr 190px 1fr` cria duas colunas que dividem igualmente o espaço **restante** depois de reservar exatamente `190px` para a coluna do meio (usado no comparador da seção 06).

### `clamp(mínimo, preferido, máximo)`

```css
font-size: clamp(2.4rem, 7vw, 5.5rem);
```

Uma função CSS com 3 argumentos: nunca vai abaixo do primeiro valor, nunca acima do terceiro, e no meio-termo tenta usar o segundo. É como escrever `Math.min(Math.max(valor, minimo), maximo)`, mas dentro do CSS, recalculado automaticamente pelo navegador sempre que a tela muda de tamanho — sem precisar de nenhuma media query.

### Pseudo-elementos `::before` e `::after`

```css
.elemento::before {
  content: ''; /* obrigatório, mesmo vazio, senão o pseudo-elemento não aparece */
  /* ...resto do estilo, como se fosse um elemento HTML de verdade */
}
```

Cria um elemento "fantasma" antes (`::before`) ou depois (`::after`) do conteúdo real do elemento, sem precisar de HTML extra. A propriedade `content` é **obrigatória** — mesmo vazia (`content: '';`), sem ela o pseudo-elemento simplesmente não é renderizado.

### Pseudo-classes: `:hover`, `:nth-child()`

```css
.card:hover { /* só quando o mouse está sobre o elemento */ }
.card:nth-child(2) { /* só o 2º filho do seu elemento pai */ }
```

Diferente de pseudo-elementos (que criam algo novo), pseudo-classes selecionam um elemento **que já existe**, mas em um estado ou posição específica.

### Media queries

```css
@media (max-width: 900px) {
  .elemento { flex-direction: column; }
}
```

"Se a largura da tela for no máximo 900px, aplique este bloco de CSS." É a ferramenta clássica de responsividade para mudanças **estruturais** (como visto em [03-css.md](./03-css.md#7-responsividade)) — para ajustes simples de tamanho, `clamp()`/`vw` costumam resolver sem precisar de media query.

### `transform` vs. mudar `top`/`left`/`width`/`height`

O projeto quase sempre anima usando `transform` (`translateY`, `rotateY`, `scale`) em vez de propriedades como `top`, `margin` ou `width` diretamente. Motivo: `transform` (e `opacity`) podem ser animadas pelo navegador usando aceleração de hardware (GPU), sem forçar um recálculo de layout de toda a página a cada quadro — isso resulta em animações mais suaves, especialmente em dispositivos mais fracos. Mudar `top`/`width` repetidamente força o navegador a recalcular a posição de outros elementos na página a cada mudança, o que é mais custoso.

> Exceção no projeto: as barras de comparação (`comparator__fill`) animam `width`, não `transform`. Foi uma escolha deliberada porque o efeito desejado (a barra "crescendo" de um dos lados) é mais natural de expressar com `width` do que simulando com `scaleX` + ajuste de `transform-origin` — e como são poucos elementos animando uma única vez (não continuamente), o custo de performance é irrelevante na prática.

---

## Pequenos exercícios (para fixar)

Se quiser testar seu entendimento, tente responder antes de olhar a resposta:

1. **Por que `document.querySelectorAll('.feature-card')` retorna uma lista mesmo que só exista 1 elemento com essa classe na página?**
   <details><summary>Resposta</summary>`querySelectorAll` sempre retorna uma <code>NodeList</code>, mesmo com 0 ou 1 resultado — é `querySelector` (sem "All") que retorna um único elemento (ou `null`). Isso é consistente mesmo que o número de resultados mude no futuro.</details>

2. **O que aconteceria se `comparison.js` não chamasse `observer.unobserve(row)` depois de animar uma linha?**
   <details><summary>Resposta</summary>O observer continuaria "vigiando" aquela linha para sempre, chamando o callback toda vez que ela entrasse/saísse da tela — desperdiçando processamento sem nenhum ganho visual, já que a barra já tem seu valor final definido (repetir `element.style.width = mesmoValor` não muda nada visualmente).</details>

3. **Por que o `<h1>` do Hero é dividido em dois `<span>` em vez de duas linhas de `<h1>` separadas?**
   <details><summary>Resposta</summary>Semanticamente, só deve existir um `<h1>` por página (é o título principal). Os dois `<span>` com `display: block` quebram a linha visualmente sem criar dois títulos "de verdade" no HTML.</details>

4. **Por que `.comparator__fill` tem `width: 0%` no CSS, mesmo sabendo que o JavaScript vai mudar esse valor?**
   <details><summary>Resposta</summary>É o "estado inicial" da transição — para o CSS conseguir animar de `0%` até o valor final, ele precisa começar de algum lugar. Se o CSS não definisse `0%`, o navegador não saberia qual era o valor "de onde" animar quando o JavaScript setasse a largura final.</details>
