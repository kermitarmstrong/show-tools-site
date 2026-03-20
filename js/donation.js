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

  /* --- Submit Review via Web3Forms --- */
  // ⚠️ REPLACE THIS with your Web3Forms access key from https://web3forms.com
  const WEB3FORMS_KEY = 'aeee49f2-f2e5-4018-8bf0-526173b48130';

  const submitBtn = document.getElementById('submitReview');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
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

      // Disable button while submitting
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const stars = '\u2605'.repeat(selectedRating) + '\u2606'.repeat(5 - selectedRating);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: 'Resolume HUD Review \u2014 ' + stars + ' (' + selectedRating + '/5)',
            from_name: 'Show Tools Review',
            name: name,
            rating: selectedRating + '/5',
            stars: stars,
            review: text,
            source: 'show-tools.app'
          })
        });

        const result = await response.json();

        if (result.success) {
          note.style.display = 'block';
          note.style.color = 'var(--accent)';
          note.textContent = 'Thanks for your review! We appreciate the feedback.';

          // Reset form
          document.getElementById('reviewName').value = '';
          document.getElementById('reviewText').value = '';
          selectedRating = 0;
          document.querySelectorAll('.star').forEach(s => s.classList.remove('star-active'));
        } else {
          note.style.display = 'block';
          note.style.color = '#ff6b6b';
          note.textContent = 'Something went wrong. Please try again.';
        }
      } catch (err) {
        note.style.display = 'block';
        note.style.color = '#ff6b6b';
        note.textContent = 'Connection error. Please try again later.';
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Review';
    });
  }
});
