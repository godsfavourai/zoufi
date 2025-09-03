// ================= tabs.js =================
// Accessible tabs controller (no dependencies)

export function initTabs() {
  const tabButtons = Array.from(document.querySelectorAll('.tablist [role="tab"]'));
  const tabPanels  = Array.from(document.querySelectorAll('.tabpanel'));
  if (!tabButtons.length) return;

  function setActiveTab(id) {
    tabButtons.forEach(btn => btn.setAttribute('aria-selected', String(btn.id === `tabbtn-${id}`)));
    tabPanels.forEach(p => p.dataset.active = String(p.id === `tab-${id}`));
    // push hash without scrolling
    history.replaceState(null, '', `#${id}`);
  }

  // click
  tabButtons.forEach(btn => btn.addEventListener('click', () => setActiveTab(btn.id.replace('tabbtn-',''))));

  // keyboard (Home/End/ArrowLeft/ArrowRight)
  const roving = (e) => {
    const idx = tabButtons.indexOf(document.activeElement);
    if (idx === -1) return;
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % tabButtons.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabButtons.length) % tabButtons.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabButtons.length - 1;
    else return;
    e.preventDefault();
    tabButtons[next].focus();
    tabButtons[next].click();
  };
  document.querySelector('.tablist')?.addEventListener('keydown', roving);

  // restore from hash
  const hash = location.hash.replace('#','');
  if (hash && document.getElementById(`tab-${hash}`)) setActiveTab(hash);
}
