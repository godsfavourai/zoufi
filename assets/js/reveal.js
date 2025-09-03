// ================= reveal.js =================
// IntersectionObserver-based reveal-on-scroll

export function initReveal() {
  const els = Array.from(document.querySelectorAll('.fade-in'));
  if (!('IntersectionObserver' in window) || !els.length) {
    // Fallback: show all
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  els.forEach(el => io.observe(el));
}
