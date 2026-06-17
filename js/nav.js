document.addEventListener('DOMContentLoaded', () => {
  const slides = [...document.querySelectorAll('.slide')];
  let idx = 0;
  let touchStartY = 0;
  let touchStartX = 0;

  const update = () => {
    const el = document.getElementById('slide-counter');
    if (el) el.textContent = `${idx + 1} / ${slides.length}`;
  };

  const go = (n) => {
    idx = Math.max(0, Math.min(slides.length - 1, n));
    slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    update();
  };

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;

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

  document.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  document.addEventListener(
    'touchend',
    (e) => {
      if (e.changedTouches.length !== 1) return;

      const dy = e.changedTouches[0].clientY - touchStartY;
      const dx = e.changedTouches[0].clientX - touchStartX;

      if (Math.abs(dy) < 60 || Math.abs(dy) < Math.abs(dx)) return;

      const scrollable = e.target.closest('.slide-inner--dense, .table-wrap, .wbs-scroll');
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 0;
        const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 2;
        if (dy < 0 && !atBottom) return;
        if (dy > 0 && !atTop) return;
      }

      if (dy < 0) go(idx + 1);
      else go(idx - 1);
    },
    { passive: true }
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          idx = slides.indexOf(entry.target);
          update();
        }
      });
    },
    { threshold: 0.5 }
  );

  slides.forEach((s) => observer.observe(s));
  update();

  document.getElementById('print-btn')?.addEventListener('click', () => window.print());
});
