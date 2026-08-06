/* =================================================================
   FEEDBACK.JS
   Seção discreta de avaliação (1 a 5 estrelas) + estatísticas
   (visitas, avaliações, média), persistidas no Firebase Firestore.

   Estrutura no Firestore: coleção "stats", documento único "global"
     { visits: number, ratings: number, totalScore: number }
   A média é derivada em tempo real (totalScore / ratings), então não
   precisa ser armazenada nem sincronizada manualmente.

   Impede múltiplas avaliações do mesmo navegador via localStorage.
   ================================================================= */

const FEEDBACK_STORAGE_KEY = 'mobileEvolutionFeedbackRated';
const FEEDBACK_WRITE_TIMEOUT_MS = 8000;

/* Se o Firestore não confirmar a escrita (rede instável, projeto mal
   configurado), a Promise pode nunca rejeitar. Este timeout garante
   que o botão sempre volte a ficar disponível para o usuário. */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Tempo de resposta esgotado')), ms)),
  ]);
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    console.warn('Firebase não inicializado — preencha as credenciais em assets/js/firebase-config.js');
    return;
  }

  initFeedback();
});

function initFeedback() {
  const db = firebase.firestore();
  const statsRef = db.collection('stats').doc('global');

  const starsEl = document.getElementById('feedbackStars');
  const submitBtn = document.getElementById('feedbackSubmit');
  const thanksEl = document.getElementById('feedbackThanks');
  const avgEl = document.getElementById('feedbackAvg');
  const countEl = document.getElementById('feedbackCount');
  const visitsEl = document.getElementById('feedbackVisits');

  if (!starsEl || !submitBtn || !thanksEl) return;

  const stars = Array.from(starsEl.querySelectorAll('.feedback__star'));
  let selectedValue = 0;

  if (localStorage.getItem(FEEDBACK_STORAGE_KEY) === 'true') {
    showThanks();
  } else {
    setupStars();
  }

  registerVisit(statsRef);
  listenToStats(statsRef, { avgEl, countEl, visitsEl });

  /* -----------------------------------------------------------------
     Interação com as estrelas: hover destaca, clique seleciona
     ----------------------------------------------------------------- */
  function setupStars() {
    stars.forEach((star) => {
      const value = Number(star.dataset.value);

      star.addEventListener('mouseenter', () => paintStars(value, 'is-hover'));
      star.addEventListener('focus', () => paintStars(value, 'is-hover'));

      star.addEventListener('click', () => {
        selectedValue = value;
        paintStars(value, 'is-selected');
        submitBtn.disabled = false;
      });
    });

    starsEl.addEventListener('mouseleave', () => paintStars(selectedValue, 'is-selected'));
    submitBtn.addEventListener('click', () => submitRating(statsRef, selectedValue));
  }

  function paintStars(value, activeClass) {
    stars.forEach((star) => {
      const isActive = Number(star.dataset.value) <= value;
      star.classList.toggle('is-hover', activeClass === 'is-hover' && isActive);
      star.classList.toggle('is-selected', activeClass === 'is-selected' && isActive);
      star.setAttribute('aria-checked', String(activeClass === 'is-selected' && isActive));
    });
  }

  /* -----------------------------------------------------------------
     Envio da avaliação
     ----------------------------------------------------------------- */
  function submitRating(ref, value) {
    if (!value || submitBtn.disabled) return;
    submitBtn.disabled = true;

    withTimeout(
      ref.set(
        {
          ratings: firebase.firestore.FieldValue.increment(1),
          totalScore: firebase.firestore.FieldValue.increment(value),
        },
        { merge: true }
      ),
      FEEDBACK_WRITE_TIMEOUT_MS
    )
      .then(() => {
        localStorage.setItem(FEEDBACK_STORAGE_KEY, 'true');
        showThanks();
      })
      .catch((error) => {
        console.error('Erro ao enviar avaliação:', error);
        submitBtn.disabled = false;
      });
  }

  function showThanks() {
    starsEl.hidden = true;
    submitBtn.hidden = true;
    thanksEl.hidden = false;
  }
}

/* -----------------------------------------------------------------
   Conta uma visita a cada carregamento de página
   ----------------------------------------------------------------- */
function registerVisit(ref) {
  ref
    .set({ visits: firebase.firestore.FieldValue.increment(1) }, { merge: true })
    .catch((error) => console.error('Erro ao registrar visita:', error));
}

/* -----------------------------------------------------------------
   Atualiza a UI em tempo real com base no documento de estatísticas
   ----------------------------------------------------------------- */
function listenToStats(ref, { avgEl, countEl, visitsEl }) {
  ref.onSnapshot(
    (doc) => {
      const data = doc.data() || {};
      const ratings = data.ratings || 0;
      const totalScore = data.totalScore || 0;
      const average = ratings > 0 ? totalScore / ratings : 0;

      if (avgEl) {
        avgEl.textContent = average.toLocaleString('pt-BR', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });
      }
      if (countEl) countEl.textContent = ratings.toLocaleString('pt-BR');
      if (visitsEl) visitsEl.textContent = (data.visits || 0).toLocaleString('pt-BR');
    },
    (error) => console.error('Erro ao carregar estatísticas:', error)
  );
}
