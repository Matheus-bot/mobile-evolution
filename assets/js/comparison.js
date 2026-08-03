/* =================================================================
   COMPARISON.JS
   Anima as barras divergentes da seção "Comparação" quando cada
   linha entra na tela — cresce a partir do centro para os dois lados.
   ================================================================= */

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
