/* =================================================================
   QUIZ.JS
   Controla o flip dos cards da seção "Qual tecnologia escolher?".
   Cada card alterna entre pergunta (frente) e resposta (verso) ao
   ser clicado/tocado.
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });
  });
});
