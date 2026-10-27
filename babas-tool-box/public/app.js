'use strict';

const tabs = [...document.querySelectorAll('[role="tab"]')];
function openGuide(name, focus = false) {
  tabs.forEach(tab => {
    const active = tab.id === `tab-${name}`;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    if (active && focus) tab.focus();
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => openGuide(tab.id.replace('tab-', '')));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = (i + 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); openGuide(tabs[next].id.replace('tab-', ''), true); }
  });
});
document.querySelectorAll('[data-open-guide]').forEach(link => link.addEventListener('click', () => openGuide(link.dataset.openGuide)));
document.querySelectorAll('[data-download]').forEach(link => link.addEventListener('click', () => {
  document.getElementById('download-status').textContent = 'Fichier demandé. Dans VS Code, ouvre Extensions, puis le menu « … » et « Install from VSIX… ».';
}));
