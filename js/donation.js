/* ============================================
   SHOW TOOLS — Donation Modal Logic
   ============================================ */

/* Stripe Payment Link */
const STRIPE_LINK = 'https://buy.stripe.com/dRm7sD9wfdgF6CV59V8g002';

/* Direct download URL */
const DOWNLOAD_URL = 'https://github.com/kermitarmstrong/resolume-hud/releases/latest/download/ResolumeHud.exe';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('donationModal');
  const modalClose = document.getElementById('modalClose');
  const beerBtn = document.getElementById('beerBtn');
  const skipBtn = document.getElementById('skipBtn');
  const triggers = document.querySelectorAll('.donation-trigger');

  if (!modal) return;

  /* --- Open Modal on Download Click --- */
  triggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  /* --- Close Modal --- */
  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* --- Beer Button → Stripe --- */
  beerBtn.addEventListener('click', () => {
    window.location.href = STRIPE_LINK;
  });

  /* --- Skip → Free Download --- */
  skipBtn.addEventListener('click', () => {
    closeModal();
    triggerDownload();
  });

  /* --- Modal Open/Close --- */
  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* --- Trigger File Download --- */
  function triggerDownload() {
    const link = document.createElement('a');
    link.href = DOWNLOAD_URL;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* --- Check for Return from Stripe --- */
  const params = new URLSearchParams(window.location.search);
  if (params.get('thanks') === 'true') {
    const banner = document.getElementById('thankYouBanner');
    if (banner) {
      banner.style.display = 'flex';
    }

    setTimeout(triggerDownload, 1000);

    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  /* --- Close Thank You Banner --- */
  const thankYouClose = document.getElementById('thankYouClose');
  if (thankYouClose) {
    thankYouClose.addEventListener('click', () => {
      document.getElementById('thankYouBanner').style.display = 'none';
    });
  }
});
