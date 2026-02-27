/* ============================================
   SHOW TOOLS — Donation Modal Logic
   ============================================ */

/*  ⚠️  IMPORTANT: Replace this with your actual Stripe Payment Link  */
const STRIPE_LINK = 'https://donate.stripe.com/3cI6oz7o7ekJaTb59V8g001';

/* Direct download URL */
const DOWNLOAD_URL = 'https://github.com/kermitarmstrong/resolume-hud/releases/latest/download/ResolumeHud.exe';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('donationModal');
  const modalClose = document.getElementById('modalClose');
  const beerBtn = document.getElementById('beerBtn');
  const skipBtn = document.getElementById('skipBtn');
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');
  const triggers = document.querySelectorAll('.donation-trigger');

  let selectedAmount = 0; // in cents

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

  /* --- Quick Amount Selection --- */
  amountBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Deselect all
      amountBtns.forEach((b) => b.classList.remove('selected'));
      customInput.value = '';
      customInput.parentElement.classList.remove('selected');

      // Select this one
      btn.classList.add('selected');
      selectedAmount = parseInt(btn.dataset.amount);
      updateBeerButton();
    });
  });

  /* --- Custom Amount Input --- */
  customInput.addEventListener('focus', () => {
    amountBtns.forEach((b) => b.classList.remove('selected'));
    customInput.parentElement.classList.add('selected');
  });

  customInput.addEventListener('input', () => {
    const val = parseFloat(customInput.value);
    if (val && val >= 2.50) {
      selectedAmount = Math.round(val * 100); // convert to cents
    } else {
      selectedAmount = 0;
    }
    updateBeerButton();
  });

  /* --- Update Beer Button State --- */
  function updateBeerButton() {
    if (selectedAmount >= 250) {
      beerBtn.disabled = false;
      const dollars = (selectedAmount / 100).toFixed(2);
      beerBtn.innerHTML = `<span class="btn-icon">🍺</span> Buy Me A Beer — $${dollars}`;
    } else {
      beerBtn.disabled = true;
      beerBtn.innerHTML = `<span class="btn-icon">🍺</span> Buy Me A Beer`;
    }
  }

  /* --- Beer Button → Stripe --- */
  beerBtn.addEventListener('click', () => {
    if (selectedAmount < 250) return;

    // Store the download URL so we can trigger it on return
    sessionStorage.setItem('pendingDownload', DOWNLOAD_URL);

    // Redirect to Stripe with prefilled amount
    const stripeUrl = `${STRIPE_LINK}?prefilled_amount=${selectedAmount}`;
    window.location.href = stripeUrl;
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
    // Reset state
    selectedAmount = 0;
    amountBtns.forEach((b) => b.classList.remove('selected'));
    customInput.value = '';
    customInput.parentElement.classList.remove('selected');
    updateBeerButton();
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
    // Show thank you banner
    const banner = document.getElementById('thankYouBanner');
    if (banner) {
      banner.style.display = 'flex';
    }

    // Auto-trigger the download
    setTimeout(triggerDownload, 1000);

    // Clean up URL
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
