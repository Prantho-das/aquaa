document.addEventListener('DOMContentLoaded', () => {
  // Add js-reveal class to body for animated reveals
  document.body.classList.add('js-reveal');

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-init');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px 0px 50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Stat Counters Animation
  const counterElements = document.querySelectorAll('.stat-counter');
  let countersAnimated = false;

  const runCounterAnimation = () => {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        if (target % 1 === 0) {
          counter.textContent = prefix + currentVal.toLocaleString() + suffix;
        } else {
          counter.textContent = prefix + (easeProgress * target).toFixed(1) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = prefix + target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounterAnimation();
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }

  // Quote Modal Logic
  const quoteModal = document.getElementById('quote-modal');
  const quoteButtons = document.querySelectorAll('.open-quote-modal');
  const closeModalButtons = document.querySelectorAll('.close-quote-modal');

  const openModal = () => {
    if (quoteModal) {
      quoteModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (quoteModal) {
      quoteModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  quoteButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeModalButtons.forEach(btn => btn.addEventListener('click', closeModal));

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal();
      }
    });
  }

  // Quote Form Submission Handler
  const quoteForm = document.getElementById('quote-form');
  const formSuccess = document.getElementById('quote-form-success');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Processing...
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        quoteForm.classList.add('hidden');
        if (formSuccess) formSuccess.classList.remove('hidden');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            quoteForm.reset();
            quoteForm.classList.remove('hidden');
            if (formSuccess) formSuccess.classList.add('hidden');
          }, 300);
        }, 2500);
      }, 1000);
    });
  }

  // Interactive Process Step Highlights
  const processCards = document.querySelectorAll('.process-step-card');
  processCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      processCards.forEach(c => c.classList.remove('ring-2', 'ring-cyan-400', 'bg-cyan-50/50'));
      card.classList.add('ring-2', 'ring-cyan-400', 'bg-cyan-50/50');
    });
  });

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
          }
        }
      }
    });
  });
});
