/* =================================================================
   TIMELINE.JS
   Controla o preenchimento progressivo da linha vertical da seção
   "Linha do Tempo" conforme o usuário rola a página. O reveal dos
   nós (dots) e conteúdos é feito via atributos data-aos no HTML.
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.timeline__track');
  const progress = document.getElementById('timelineProgress');
  if (!track || !progress) return;

  const updateTimelineProgress = () => {
    const rect = track.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;

    // 0% quando o topo do trilho chega ao centro da tela,
    // 100% quando o final do trilho passa do centro da tela.
    const raw = (viewportCenter - rect.top) / rect.height;
    const clamped = Math.min(Math.max(raw, 0), 1);

    progress.style.height = `${clamped * 100}%`;
  };

  window.addEventListener('scroll', () => requestAnimationFrame(updateTimelineProgress), { passive: true });
  window.addEventListener('resize', updateTimelineProgress);
  updateTimelineProgress();
});
