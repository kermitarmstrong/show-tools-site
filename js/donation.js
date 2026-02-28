/* ============================================
   SHOW TOOLS — Downloads Page Logic
   ============================================ */

const DOWNLOAD_URL = 'https://github.com/kermitarmstrong/resolume-hud/releases/latest/download/ResolumeHud.exe';

document.addEventListener('DOMContentLoaded', () => {

  /* --- Check for Return from Stripe --- */
  const params = new URLSearchParams(window.location.search);
  if (params.get('thanks') === 'true') {
    const banner = document.getElementById('thankYouBanner');
    if (banner) {
      banner.style.display = 'flex';
    }
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

  /* --- Star Rating --- */
  const starRating = document.getElementById('starRating');
  let selectedRating = 0;

  if (starRating) {
    const stars = starRating.querySelectorAll('.star');

    stars.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.getAttribute('data-value'));
        stars.forEach(s => {
          s.classList.toggle('star-hover', parseInt(s.getAttribute('data-value')) <= val);
        });
      });

      star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('star-hover'));
      });

      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-value'));
        stars.forEach(s => {
          s.classList.toggle('star-active', parseInt(s.getAttribute('data-value')) <= selectedRating);
        });
      });
    });
  }

  /* --- Submit Review via Email --- */
  const submitBtn = document.getElementById('submitReview');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = document.getElementById('reviewName').value.trim() || 'Anonymous';
      const text = document.getElementById('reviewText').value.trim();
      const note = document.getElementById('reviewNote');

      if (selectedRating === 0) {
        note.style.display = 'block';
        note.style.color = '#ff6b6b';
        note.textContent = 'Please select a star rating.';
        return;
      }

      if (!text) {
        note.style.display = 'block';
        note.style.color = '#ff6b6b';
        note.textContent = 'Please write a short review.';
        return;
      }

      const stars = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);
      const subject = encodeURIComponent('Resolume HUD Review — ' + stars);
      const body = encodeURIComponent(
        'Rating: ' + stars + ' (' + selectedRating + '/5)\n' +
        'Name: ' + name + '\n\n' +
        'Review:\n' + text + '\n\n' +
        '---\nSent from show-tools.app'
      );

      window.location.href = 'mailto:showtoolsofficial@gmail.com?subject=' + subject + '&body=' + body;

      note.style.display = 'block';
      note.style.color = 'var(--accent)';
      note.textContent = 'Thanks! Your default email app should open — just hit send.';

      // Reset form
      document.getElementById('reviewName').value = '';
      document.getElementById('reviewText').value = '';
      selectedRating = 0;
      document.querySelectorAll('.star').forEach(s => s.classList.remove('star-active'));
    });
  }
});
