/* =================================================================
   DEBATE.JS
   Controla a sequência automática de perguntas da seção "Quem vence?".
   Ao entrar na tela, alterna perguntas destacando o card vencedor de
   cada uma; ao final, revela o resultado (empate).
   ================================================================= */

const DEBATE_QUESTIONS = [
  { text: 'Maior desempenho?', winner: 'android' },
  { text: 'Desenvolvimento mais rápido?', winner: 'rn' },
  { text: 'Acesso total ao hardware?', winner: 'android' },
  { text: 'Um código para as duas plataformas?', winner: 'rn' },
];

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('debate');
  const questionEl = document.getElementById('battleQuestion');
  const dotsWrap = document.getElementById('battleDots');
  const androidCard = document.getElementById('battleAndroid');
  const rnCard = document.getElementById('battleRN');
  const resultEl = document.getElementById('battleResult');

  if (!section || !questionEl || !dotsWrap || !androidCard || !rnCard || !resultEl) return;

  DEBATE_QUESTIONS.forEach(() => {
    const dot = document.createElement('span');
    dot.className = 'battle__dot';
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.battle__dot');

  const setWinner = (winner) => {
    const androidWins = winner === 'android';
    androidCard.classList.toggle('is-winner', androidWins);
    androidCard.classList.toggle('is-loser', !androidWins);
    rnCard.classList.toggle('is-winner', !androidWins);
    rnCard.classList.toggle('is-loser', androidWins);
  };

  const showQuestion = (index) => {
    questionEl.classList.add('is-fading');
    setTimeout(() => {
      questionEl.textContent = DEBATE_QUESTIONS[index].text;
      setWinner(DEBATE_QUESTIONS[index].winner);
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      questionEl.classList.remove('is-fading');
    }, 300);
  };

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
