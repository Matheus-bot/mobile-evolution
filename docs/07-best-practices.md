# 07 — Boas Práticas Adotadas (e por quê)

Este documento explica **decisões de qualidade de código** tomadas conscientemente no projeto — não apenas "o que" foi feito, mas o raciocínio por trás. Serve tanto para justificar escolhas quanto para você replicar os mesmos padrões em projetos futuros.

## 1. Separação de responsabilidades (HTML / CSS / JS)

**A regra seguida**: HTML descreve *conteúdo e estrutura*; CSS descreve *aparência*; JavaScript descreve *comportamento*. Nenhuma camada tenta fazer o trabalho da outra.

Exemplos concretos no projeto:
- O flip do card (seção 10) é disparado por `card.classList.toggle('is-flipped')` em `quiz.js` — mas a rotação 3D em si (`transform: rotateY(180deg)`, `transition`, `perspective`) é **inteiramente CSS**. O JavaScript nunca escreve `element.style.transform = 'rotateY(180deg)'` diretamente para esse efeito.
- As barras de comparação são uma exceção parcial e justificada: `comparison.js` define `element.style.width` via JavaScript (porque o valor é um dado dinâmico, `data-android`/`data-rn`, que só existe em tempo de execução), mas a **suavização** dessa mudança continua sendo `transition` do CSS — o JS não anima nada manualmente com `setInterval` calculando quadro a quadro.

**Por que isso importa**: se amanhã você quiser mudar a curva de animação do flip card (de "suave" para "com efeito de mola"), você mexe **só** no CSS, sem tocar em `quiz.js`. Se quiser mudar quando o flip acontece (por exemplo, ao passar o mouse em vez de clicar), você mexe **só** no JS, sem tocar no CSS. Misturar as duas coisas (por exemplo, calculando a rotação inteira via JavaScript a cada frame) tornaria qualquer uma dessas mudanças isoladas muito mais arriscada.

## 2. Guard clauses (cláusulas de guarda)

Todo arquivo JavaScript do projeto verifica se os elementos/bibliotecas que precisa existem **antes** de continuar:

```javascript
function initAOS() {
  if (typeof AOS === 'undefined') return;
  // ...
}

function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  // ...
}
```

**Por que**: sem essas verificações, um erro em qualquer parte (por exemplo, a CDN do AOS estar fora do ar, ou alguém remover um elemento do HTML sem avisar) **quebraria a página inteira** — em JavaScript, um erro não tratado interrompe a execução do restante daquele script. Com a guarda, o pior cenário é "essa funcionalidade específica não aparece", e todo o resto do site continua funcionando normalmente. Isso é chamado de **degradação graciosa** (*graceful degradation*).

## 3. Nomenclatura consistente (BEM)

Já detalhado em [05-components.md](./05-components.md#nomenclatura-bem). O ganho prático: qualquer pessoa lendo `.battle__card--android` já sabe, só pelo nome, que existe um bloco `.battle`, um elemento `card` dentro dele, e uma variação `android` desse elemento — sem precisar abrir o HTML para confirmar a hierarquia.

## 4. Quando usar estilo inline

O projeto usa `style="..."` diretamente no HTML em situações bem específicas — **não** é inconsistência, é uma regra aplicada de propósito:

```html
<span class="lang-badge__dot" style="background:#f8981d"></span>
<div class="os-card__badge" style="background: rgba(61,220,132,0.12)">
<div class="future-card__icon" style="--icon-color:#f5f5f7">
```

**Regra usada**: se um valor é **único para aquela instância específica** (a cor de marca do Java é sempre laranja, em nenhum outro lugar do site) e **não vai se repetir** o suficiente para justificar uma classe modificadora CSS nova, o estilo inline é mais direto e fácil de ler/editar do que criar `.lang-badge__dot--java { background: #f8981d; }` em um arquivo CSS separado, só para usar uma vez.

**Quando isso NÃO é usado**: qualquer valor que se repete (cores de fundo, espaçamentos, tipografia) vem de uma variável CSS (`var(--accent-blue)`) ou de uma classe (`.btn--primary`). O critério é: **se o mesmo valor aparece 2+ vezes, ele vira uma variável ou classe; se aparece 1 vez só e é específico de um dado (uma cor de marca, por exemplo), pode ficar inline.**

## 5. Performance: `requestAnimationFrame` no evento de `scroll`

```javascript
window.addEventListener('scroll', () => requestAnimationFrame(updateProgress), { passive: true });
```

O evento `scroll` do navegador pode disparar **dezenas de vezes por segundo** — muito mais rápido do que a tela consegue redesenhar (a maioria dos monitores atualiza a 60 quadros por segundo, ou seja, um redesenho a cada ~16ms). Se `updateProgress()` rodasse diretamente a cada evento de scroll, o navegador estaria fazendo cálculo e escrita no DOM (`style.width = ...`) com muito mais frequência do que o necessário, desperdiçando processamento e podendo causar engasgos visuais (*jank*).

`requestAnimationFrame(fn)` agenda `fn` para rodar **uma vez, no próximo quadro de renderização** — mesmo que o evento de scroll dispare 5 vezes antes desse quadro chegar, o navegador só executa a função uma vez, sincronizada com o ritmo real de desenho da tela. Esse padrão é usado em `main.js` (barra de progresso) e `timeline.js` (progresso da timeline).

`{ passive: true }` no `addEventListener` é outra otimização: avisa o navegador, antecipadamente, que esse listener nunca vai chamar `event.preventDefault()` (não vai tentar bloquear o scroll). Isso permite que o navegador comece a rolar a página **imediatamente**, sem esperar o JavaScript "decidir" se pode ou não — importante especialmente em dispositivos touch.

## 6. Performance: `IntersectionObserver` em vez de checar scroll manualmente

Antes da API `IntersectionObserver` existir, a forma comum de saber "esse elemento está visível?" era ouvir o evento `scroll` e, a cada disparo, chamar `getBoundingClientRect()` em cada elemento de interesse, comparando manualmente com `window.innerHeight`. Isso é caro: `getBoundingClientRect()` força o navegador a recalcular o layout da página (*reflow*), e fazer isso repetidamente para vários elementos a cada evento de scroll é uma das causas mais comuns de sites travando durante a rolagem.

`IntersectionObserver` (usado em `comparison.js`, `debate.js`, `charts.js`, e internamente pelo AOS) delega esse trabalho para o **próprio navegador**, que já sabe, de forma otimizada, quando um elemento entra/sai da tela — o callback só roda quando algo realmente muda, não a cada pixel de scroll.

## 7. Lazy initialization (inicialização atrasada) dos gráficos

```javascript
observer.observe(marketShareCanvas);
observer.observe(frameworksCanvas);
// ... gráfico só é criado dentro do callback, quando entry.isIntersecting é true
```

Os gráficos do Chart.js só são efetivamente criados (`new Chart(...)`) quando o usuário rola até a seção Mercado — não no carregamento inicial da página. Duas razões:

1. **Narrativa**: se o gráfico já existisse pronto desde o início, sua animação de entrada (barras crescendo, doughnut girando) já teria terminado muito antes do usuário chegar visualmente até ele.
2. **Performance**: criar um gráfico (parsear os dados, desenhar no canvas) tem um custo de processamento. Adiar esse custo para "só quando for realmente visto" é um padrão comum em sites com muito conteúdo — evita gastar tempo de carregamento inicial com trabalho que talvez o usuário nem chegue a ver (embora, neste site específico, o usuário provavelmente veja todas as seções).

## 8. Acessibilidade

Algumas decisões pontuais, mas importantes:

- **`aria-hidden="true"`** em elementos puramente decorativos (`.hero__bg`, `.hero__scroll-indicator`) — instrui leitores de tela a **ignorar** esse conteúdo, já que ele não carrega informação (é só efeito visual).
- **`aria-label`** nos dots de navegação, gerados dinamicamente: `dot.setAttribute('aria-label', \`Ir para ${dot.dataset.label}\`)`. Sem isso, um dot (um círculo pequeno, sem texto visível) seria anunciado por um leitor de tela apenas como "botão", sem contexto do que ele faz.
- **`<button>` em vez de `<div>` com `onclick`** nos flip cards (seção 10) e nos dots de navegação. Botões nativos já vêm com foco por teclado (Tab), ativação por Enter/Espaço, e são anunciados corretamente por leitores de tela — tudo "de graça", sem escrever nenhum código extra. Usar `<div onclick="...">` exigiria reimplementar manualmente todo esse comportamento (`tabindex`, listener de teclado, `role="button"`) para alcançar o mesmo nível de acessibilidade.
- **`prefers-reduced-motion`** (ver [03-css.md](./03-css.md#9-pseudo-elementos-e-pseudo-classes) e [06-animations.md](./06-animations.md)) — respeita a preferência de sistema de usuários sensíveis a movimento, desligando praticamente todas as animações quando ativada.
- **Um único `<h1>` por página** (o título do Hero) — os demais títulos de seção usam `<h2>`, mantendo uma hierarquia de cabeçalhos semanticamente correta, que leitores de tela usam para navegação rápida (pular de seção em seção por título).

## 9. Por que não usamos imagens reais (mockup em vez de screenshot)

O mockup da IDE (seção 03) e os badges de sistema operacional (seção 08) foram construídos **inteiramente em HTML/CSS**, em vez de usar screenshots reais do Android Studio ou logos oficiais de cada SO. Motivos:

1. **Direitos de marca**: logos oficiais (Apple, Google, Huawei, Samsung...) têm diretrizes de uso de marca que podem restringir onde e como podem aparecer; recriar com ícones genéricos + cores evita essa questão inteiramente.
2. **Sem dependência de arquivo externo**: uma imagem precisa ser baixada, hospedada, otimizada (tamanho de arquivo) e mantida atualizada (uma screenshot de UI fica desatualizada a cada nova versão do Android Studio). Um mockup em CSS nunca "fica desatualizado" da mesma forma.
3. **Consistência visual**: uma screenshot real trria cores, proporções e estilo tipográfico diferentes do resto do site (tema escuro customizado); o mockup construído à mão já nasce na paleta certa.
4. **Peso da página**: elementos CSS não pesam nada em comparação a uma imagem PNG/JPG de boa resolução.

O trade-off, claramente: um mockup não é "real" — ele simula a forma geral de uma IDE, não o Android Studio pixel a pixel. Para os fins de uma apresentação (dar a sensação de "isso é uma IDE"), esse trade-off foi considerado aceitável. As pastas `assets/img/logos/` e `assets/img/mockups/` continuam no projeto caso, no futuro, alguém prefira substituir por imagens reais.

## 10. Débitos técnicos conhecidos

Nenhum projeto é perfeito — registrar débitos técnicos conscientemente é melhor do que fingir que eles não existem. Aqui estão os identificados:

| Débito | Onde | Impacto | Como resolver, se necessário |
|---|---|---|---|
| Nome de classe "vazado" | `.native-dev__lead` é usada nas seções 04, 05, 10 e 11 | Baixo — funciona perfeitamente, mas o nome sugere (erroneamente) que é exclusiva da seção 04 | Renomear para algo neutro como `.section-lead` e atualizar as 4 seções no HTML |
| `data-reveal` / `data-reveal-title` sem uso | Seção Hero, `index.html` | Nenhum (são só atributos "mortos", não afetam nada) | Remover do HTML, ou implementar a lógica que eles sugerem (hoje a entrada do Hero é só CSS) |
| Um único arquivo CSS grande (~1650 linhas) | `assets/css/style.css` | Baixo neste tamanho de projeto; ficaria mais difícil de navegar se o site crescesse muito mais | Dividir em múltiplos arquivos por seção e uni-los com uma ferramenta de build (Vite, por exemplo) — só compensa se o projeto crescer bastante |
| Valores de gráfico/comparação didáticos, não citados | `charts.js`, seção 06 (Comparação) | Nenhum para fins de apresentação; um leitor mais rigoroso pode questionar a fonte dos números | Se for citar em contexto acadêmico mais formal, trocar pelos números de uma fonte específica (Statcounter, Stack Overflow Developer Survey) e referenciar a fonte no rodapé |

## 11. Por que "Vanilla JS" (JavaScript puro) em vez de um framework

Esse foi um requisito do enunciado do trabalho, mas vale entender os prós e contras reais:

**Vantagens do que foi feito**:
- Zero passo de build (`npm install`, `webpack`, `vite`) — basta abrir `index.html`.
- Qualquer pessoa que saiba HTML/CSS/JS básico consegue ler o código sem aprender um framework antes.
- Nenhuma dependência de versão de framework quebrando no futuro.

**Onde um framework ajudaria, se o projeto crescesse muito**:
- Gerenciar estado (ex.: "qual pergunta do debate está ativa") fica mais verboso em Vanilla JS (variáveis soltas + manipulação manual de classes) do que em um framework com estado reativo.
- Componentes repetidos (como os 12 cabeçalhos de seção) exigem copiar/colar HTML em vez de reutilizar um componente declarado uma vez.

Para o tamanho e o propósito deste projeto (uma apresentação de página única, sem lógica de negócio complexa, sem dados vindos de um servidor), Vanilla JS é uma escolha adequada — não é "pior" que um framework, é a ferramenta certa para o problema certo.
