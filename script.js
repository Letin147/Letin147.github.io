'use strict';

// Enhance the page only after JS is available: the content remains readable without it.
document.documentElement.classList.add('has-js');

const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu() {
  if (!toggle || !mobileNav) return;
  mobileNav.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '打开导航菜单');
}

if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.setAttribute('aria-label', willOpen ? '关闭导航菜单' : '打开导航菜单');
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!mobileNav.hidden && !mobileNav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const toast = document.querySelector('#toast');
let toastTimeout;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 3600);
}

const copyButton = document.querySelector('#copy-email');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast('邮箱已复制！期待收到你的来信 💌');
    } catch {
      // Clipboard may be unavailable on a non-HTTPS preview; mailto still works.
      showToast('暂时无法复制，可以点击下方邮箱直接发送邮件哦。');
    }
  });
}

const smiles = [
  '今天的你，也在一点点变厉害。🌼',
  '祝你遇见一个有趣的问题和一个漂亮的解法！✨',
  '慢一点没关系，每一步都算数。☀️',
  '希望今天有阳光，也有让你开心的小事。🌷',
  '写累了就抬头看看天空，灵感还在路上。🍃'
];
let smileIndex = -1;
const smileButton = document.querySelector('#sunshine-button');
if (smileButton) smileButton.addEventListener('click', () => {
  smileIndex = (smileIndex + 1) % smiles.length;
  showToast(smiles[smileIndex]);
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(node => observer.observe(node));
} else {
  document.querySelectorAll('[data-reveal]').forEach(node => node.classList.add('is-visible'));
}
