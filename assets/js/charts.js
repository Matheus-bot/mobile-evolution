/* =================================================================
   CHARTS.JS
   Gráficos da seção "Mercado" (Chart.js), estilizados para o tema
   escuro do site. Os gráficos só são criados quando o canvas entra
   na tela, para que a animação de entrada do Chart.js seja vista.
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#a1a1aa';

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

  const createFrameworksChart = () => {
    new Chart(frameworksCanvas, {
      type: 'bar',
      data: {
        labels: ['Flutter', 'React Native', 'Nativo'],
        datasets: [
          {
            data: [45, 35, 20],
            backgroundColor: ['#54c5f8', '#61dafb', '#a1a1aa'],
            borderRadius: 8,
            maxBarThickness: 56,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle,
            callbacks: { label: (ctx) => ` ${ctx.parsed.y}%` },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { callback: (v) => `${v}%` },
          },
          x: {
            grid: { display: false },
          },
        },
        animation: { duration: 1200, easing: 'easeOutCubic' },
      },
    });
  };

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
