# 05 — Componentes Reutilizáveis

Mesmo sem um framework de componentes (React, Vue), o projeto foi construído com uma mentalidade de **"blocos de Lego"**: alguns padrões visuais (CSS + estrutura HTML) foram criados uma vez e reaproveitados em várias seções, em vez de reescritos do zero a cada vez. Este documento cataloga esses blocos.

## Nomenclatura BEM

Quase todas as classes CSS do projeto seguem a convenção **BEM** (Block, Element, Modifier):

```
.bloco { }
.bloco__elemento { }
.bloco--modificador { }
.bloco__elemento--modificador { }
```

- **Block** (`bloco`): o componente em si (ex.: `feature-card`, `flip-card`, `os-card`).
- **Element** (`bloco__elemento`): uma parte interna do bloco, que só faz sentido dentro dele (ex.: `flip-card__inner`, `flip-card__face`).
- **Modifier** (`bloco--modificador`): uma variação do bloco ou elemento (ex.: `flip-card__face--native` vs. `flip-card__face--rn`).

**Por que usar BEM**: em CSS puro (sem escopo automático, como existe em frameworks de componentes), duas classes com nomes parecidos em seções diferentes podem colidir sem querer. BEM reduz esse risco porque o nome da classe já "carrega" o contexto — ao ler `.os-card__badge`, fica claro que aquele `__badge` só existe dentro de `.os-card`, sem precisar caçar no HTML para confirmar. Além disso, facilita muito buscar (`Ctrl+F` por `os-card`) todas as regras relacionadas a um componente.

---

## Componente: `.feature-card`

**Onde aparece**: seção 03 (Android Studio, 4 cards em grid 2×2) e seção 05 (React Native, 3 cards em linha).

**HTML**:
```html
<div class="feature-card" data-aos="zoom-in" data-aos-delay="0" data-tilt>
  <i data-lucide="smartphone"></i>
  <h3>Emulador</h3>
  <p>Simula dispositivos reais sem precisar de hardware físico.</p>
</div>
```

**CSS** (`assets/css/style.css`, bloco "03. ANDROID STUDIO"):
```css
.feature-card {
  padding: 1.25rem;
  border-radius: 16px;
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(12px);
  transition: var(--transition-fast);
}
.feature-card:hover { ... }
.feature-card i { ... }
.feature-card h3 { ... }
.feature-card p { ... }
```

**Por que é reutilizável**: a classe `.feature-card` não depende de nenhuma classe "pai" específica (não é `.android-studio .feature-card`, é só `.feature-card`). Isso significa que ela funciona **em qualquer contêiner** — na seção 03 está dentro de `.feature-grid` (grid 2×2), na seção 05 está dentro de `.feature-row` (3 colunas em linha). O **contêiner** decide o layout (quantas colunas, largura); o **card em si** sempre parece igual. Quer adicionar um 5º "feature card" em uma seção nova? Basta copiar a estrutura HTML acima.

---

## Componente: `.code-window`

**Onde aparece**: seção 04 (código Java) e seção 05 (código JSX).

**HTML**:
```html
<div class="code-window" data-tilt>
  <div class="code-window__titlebar">
    <span class="win-dot win-dot--a"></span>
    <span class="win-dot win-dot--b"></span>
    <span class="win-dot win-dot--c"></span>
    <span class="code-window__title">MainActivity.java</span>
  </div>
  <pre class="code-window__pre"><code class="language-java">/* código aqui */</code></pre>
</div>
```

**Anatomia**:
- `.code-window` — a "moldura" (fundo, borda, sombra, cantos arredondados).
- `.code-window__titlebar` — a barra superior, com os 3 pontos (`.win-dot`) simulando os botões de fechar/minimizar/maximizar do macOS, e o nome do arquivo.
- `.code-window__pre` — o `<pre>` que recebe o `<code>`; define a fonte monoespaçada (`--font-mono`) e o espaçamento interno.

**Detalhe importante — `!important` no fundo**:
```css
.code-window__pre {
  background: transparent !important;
}
```
O Prism.js aplica seu próprio fundo ao processar o código. Para que a cor de fundo visível seja a do `.code-window` (e não uma cor genérica do Prism), forçamos transparência aqui — ver [03-css.md](./03-css.md#11-important-e-color-mix--dois-casos-pontuais).

**Como reutilizar em uma seção nova**: copie a estrutura, troque o `code-window__title` pelo nome do arquivo desejado e a classe `language-XXX` do `<code>` pela linguagem correta (o Prism, via plugin autoloader, baixa a gramática daquela linguagem automaticamente — ver [01-project-structure.md](./01-project-structure.md)).

---

## Componente: `.os-card`

**Onde aparece**: apenas na seção 08 (Sistemas Operacionais), mas vale a pena estudar por causa da técnica de **cor customizada por instância**.

**HTML**:
```html
<div class="os-card" data-tilt>
  <div class="os-card__badge" style="background: rgba(61,220,132,0.12)">
    <i data-lucide="bot" style="color:#3ddc84"></i>
  </div>
  <h3>Android</h3>
  <p class="os-card__desc">Sistema aberto do Google, baseado em Linux.</p>
  <span class="os-card__status os-card__status--active">Líder de mercado</span>
</div>
```

**Por que a cor do badge é inline, e não uma classe modificadora (`--android`, `--ios`, etc.)?** Com 8 sistemas operacionais, criar 8 classes modificadoras (uma por cor de marca) no CSS geraria 8 blocos de 3-4 linhas cada, só para mudar uma cor — muita repetição para pouco ganho. Usar `style="color:..."` diretamente no elemento é mais direto quando o valor **é realmente único por instância** e não se repete em nenhum outro lugar do site. Veja a discussão completa em [07-best-practices.md](./07-best-practices.md#quando-usar-estilo-inline).

**O sistema de status com 3 variações** é o ponto mais reaproveitável:
```css
.os-card__status {
  --dot-color: var(--text-muted); /* valor padrão */
  /* ...resto do estilo visual, igual para todos... */
}
.os-card__status::before {
  background: var(--dot-color); /* lê a variável */
}
.os-card__status--active { --dot-color: #4ade80; }
.os-card__status--niche { --dot-color: #facc15; }
.os-card__status--inactive { --dot-color: #71717a; }
```
Esse padrão — uma variável CSS **local** ao componente, redefinida por classes modificadoras — é mais enxuto que duplicar todo o bloco de estilo 3 vezes. Só a variável muda; toda a geometria (tamanho, padding, border-radius) do badge é escrita uma única vez. Esse mesmo padrão poderia ser reaproveitado para criar, por exemplo, um sistema de "badge de dificuldade" (fácil/médio/difícil) em outro projeto.

---

## Componente: `.flip-card`

**Onde aparece**: apenas na seção 10 (Qual tecnologia escolher?), documentado em detalhe técnico em [06-animations.md](./06-animations.md#flip-3d).

**Anatomia resumida**:
```
.flip-card (o <button>, define a perspectiva 3D)
└── .flip-card__inner (gira 180° quando .is-flipped está presente)
    ├── .flip-card__face.flip-card__face--front (pergunta)
    └── .flip-card__face.flip-card__face--back.flip-card__face--native|rn (resposta)
```

Os modificadores `--native` e `--rn` na face de trás mudam apenas a cor de destaque (borda e texto da resposta), reaproveitando as mesmas variáveis `--color-android` e `--color-rn` usadas em outras seções (comparador, debate) — reforçando a mesma "linguagem de cor" em todo o site: **verde sempre significa Android/Nativo, ciano sempre significa React Native**, em qualquer seção onde essa distinção aparece.

---

## Padrão repetido: cabeçalho de seção

Praticamente toda seção (exceto Hero e Conclusão, que têm identidade visual própria) usa a mesma dupla de elementos no topo:

```html
<p class="section-eyebrow" data-aos="fade-up">Texto pequeno de contexto</p>
<h2 class="section-heading" data-aos="fade-up" data-aos-delay="80">Título da Seção</h2>
```

```css
.section-eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--text-muted);
}

.section-heading {
  font-size: clamp(1.8rem, 4.5vw, 3rem);
  margin-bottom: 3rem;
}
```

Esse padrão (rótulo pequeno em maiúsculas + título grande) é comum em sites de produto (Stripe, Linear, Vercel) porque cria uma **hierarquia de leitura clara**: o olho lê o rótulo pequeno primeiro (contexto), depois o título grande (o assunto da seção). Repetir esse padrão em todas as seções cria consistência visual ao longo de toda a "keynote", mesmo quando o conteúdo de cada seção é completamente diferente.

---

## Padrão repetido: texto introdutório centralizado

```css
.native-dev__lead {
  max-width: 60ch;
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3.5rem;
}
```

Apesar do nome ter o prefixo `native-dev` (foi criado originalmente para a seção 04), essa classe é **reaproveitada literalmente** nas seções 05, 10 e 11 (React Native, Qual Escolher, Futuro) — um exemplo de como, em CSS puro sem sistema de componentes, às vezes um nome "nasce" em um contexto e depois vira, na prática, um utilitário geral. Isso é sinalizado como uma oportunidade de melhoria em [07-best-practices.md](./07-best-practices.md#débitos-técnicos-conhecidos).

`max-width: 60ch` merece nota: `ch` é uma unidade CSS baseada na largura do caractere "0" na fonte atual. Limitar um parágrafo a `60ch` é uma prática tipográfica clássica — linhas de texto muito longas (que ocupam a largura inteira de uma tela grande) são mais difíceis de ler; `60-75ch` é a faixa geralmente recomendada para legibilidade confortável.

## Resumo: tabela de todos os componentes

| Componente | Classe raiz | Usado em (seções) | Particularidade técnica |
|---|---|---|---|
| Card de recurso | `.feature-card` | 03, 05 | Reutilizável em qualquer contêiner de grid/flex |
| Janela de código | `.code-window` | 04, 05 | `!important` para vencer o CSS injetado pelo Prism.js |
| Card de sistema operacional | `.os-card` | 08 | Cor inline por instância + variável CSS local para status |
| Card giratório | `.flip-card` | 10 | 3 camadas de HTML para o efeito 3D funcionar |
| Cabeçalho de seção | `.section-eyebrow` + `.section-heading` | quase todas | Consistência de hierarquia visual |
| Texto introdutório | `.native-dev__lead` | 04, 05, 10, 11 | Nome "vazou" de uma seção específica para uso geral |
| Ícone com tilt 3D | `[data-tilt]` (atributo, não classe) | 03, 04, 05, 08 | Selecionado por atributo no JS, não por classe — funciona em qualquer elemento |
