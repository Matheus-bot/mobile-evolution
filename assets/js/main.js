/* =================================================================
   MAIN.JS
   Inicialização geral: AOS, barra de progresso, navegação por dots
   e ações da seção Hero. Módulos específicos de cada seção (timeline,
   comparação, debate, gráficos, quiz) vivem em seus próprios arquivos.
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initProgressBar();
  initNavDots();
  initHero();
  initIcons();
  initTilt();
});

/* -----------------------------------------------------------------
   AOS (Animate On Scroll) — usado pelas seções seguintes
   ----------------------------------------------------------------- */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });
}

/* -----------------------------------------------------------------
   Barra de progresso de scroll no topo da página
   ----------------------------------------------------------------- */
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

/* -----------------------------------------------------------------
   Navegação por dots: um dot por <section>, gerado dinamicamente.
   Destaca a seção ativa via IntersectionObserver.
   ----------------------------------------------------------------- */
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

/* -----------------------------------------------------------------
   Seção Hero: botão "Iniciar Jornada" leva à próxima seção
   ----------------------------------------------------------------- */
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

/* -----------------------------------------------------------------
   Ícones Lucide
   ----------------------------------------------------------------- */
function initIcons() {
  if (typeof lucide === 'undefined') return;
  lucide.createIcons();
}

/* -----------------------------------------------------------------
   Efeito de tilt 3D leve em elementos com [data-tilt]
   (usado no mockup do Android Studio, cards de feature, SOs etc.)
   ----------------------------------------------------------------- */
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
