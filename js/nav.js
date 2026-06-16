document.addEventListener('DOMContentLoaded', () => {
  const slides = [...document.querySelectorAll('.slide')];
  let idx = 0;

  const update = () => {
    const el = document.getElementById('slide-counter');
    if (el) el.textContent = `${idx + 1} / ${slides.length}`;
  };

  const go = (n) => {
    idx = Math.max(0, Math.min(slides.length - 1, n));
    slides[idx].scrollIntoView({ behavior: 'smooth' });
    update();
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      go(idx + 1);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      go(idx - 1);
    }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(slides.length - 1);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          idx = slides.indexOf(entry.target);
          update();
        }
      });
    },
    { threshold: 0.55 }
  );

  slides.forEach((s) => observer.observe(s));
  update();

  document.getElementById('print-btn')?.addEventListener('click', () => window.print());
});
