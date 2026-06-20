document.addEventListener('DOMContentLoaded', () => {

  /* 
    =========================================
    1. MOBILE NAVIGATION HAMBURGER MENU
    =========================================
  */
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');

        // Set active link visually
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }


  /* 
    =========================================
    2. SCROLL TIMELINE & REVEAL FALLBACKS
    =========================================
  */
  const header = document.getElementById('main-header');

  // Fallback for shrinking header on scroll (for browsers without native CSS scroll() support)
  const supportsScrollTimeline = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
  
  if (!supportsScrollTimeline && header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    // Trigger on load as well in case of page refresh while scrolled
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    }
  }

  // Fallback for Entry/Exit reveal effects (IntersectionObserver)
  const supportsViewTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!supportsViewTimeline) {
    const revealElements = document.querySelectorAll(
      '.scroll-reveal, .services-grid > *, .process-grid > *, .testimonials-grid > *, .gallery-grid > *'
    );

    // Initial styles for javascript fallback
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // Unobserve after revealing to prevent repetitive animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before entering viewport
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }


  /* 
    =========================================
    3. PORTFOLIO / GALLERY FILTER TABS
    =========================================
  */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'tutti' || itemCategory === filterValue) {
          // Show with transition
          item.classList.remove('hidden');
        } else {
          // Hide
          item.classList.add('hidden');
        }
      });
    });
  });


  /* 
    =========================================
    4. INTERACTIVE STEP-BY-STEP BOOKING MODAL
    =========================================
  */
  const modalBackdrop = document.getElementById('booking-modal-backdrop');
  const closeBtn = document.getElementById('btn-modal-close');
  const triggerBtns = [
    document.getElementById('btn-schedule-nav'),
    document.getElementById('btn-hero-cta'),
    document.getElementById('btn-banner-cta')
  ];

  // Open Modal Function
  const openModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden'; // Disable background scrolling
      resetWizard();
    }
  };

  // Close Modal Function
  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = ''; // Re-enable background scrolling
    }
  };

  // Attach event listeners to all triggers
  triggerBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside of the modal content
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Close with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });


  /* 
    =========================================
    5. FORM WIZARD MULTI-STEP LOGIC
    =========================================
  */
  const form = document.getElementById('booking-wizard-form');
  const steps = document.querySelectorAll('.form-step');
  const stepDots = document.querySelectorAll('.step-dot');
  const progressBarFill = document.getElementById('step-progress-fill');
  
  const btnPrev = document.getElementById('btn-wizard-prev');
  const btnNext = document.getElementById('btn-wizard-next');
  
  const serviceCards = document.querySelectorAll('.service-select-card');
  const selectedServiceInput = document.getElementById('selected-service-input');
  
  let currentStep = 1;
  const totalSteps = 3;

  // Handle service selection in Step 1
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const val = card.getAttribute('data-value');
      if (selectedServiceInput) {
        selectedServiceInput.value = val;
      }
    });
  });

  // Reset Wizard state
  const resetWizard = () => {
    currentStep = 1;
    updateWizardUI();
    if (form) {
      form.reset();
      // Set default selected card
      serviceCards.forEach(c => c.classList.remove('selected'));
      if (serviceCards[0]) {
        serviceCards[0].classList.add('selected');
      }
      if (selectedServiceInput) {
        selectedServiceInput.value = 'tinteggiatura_interni';
      }
    }
  };

  // Update Progress Bar and dots
  const updateWizardUI = () => {
    // Show/Hide Form Steps
    steps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.getAttribute('data-step')) === currentStep) {
        step.classList.add('active');
      }
    });

    // Update step dots classes
    stepDots.forEach(dot => {
      const dotStep = parseInt(dot.getAttribute('data-step'));
      dot.classList.remove('active', 'completed');
      
      if (dotStep === currentStep) {
        dot.classList.add('active');
      } else if (dotStep < currentStep) {
        dot.classList.add('completed');
      }
    });

    // Update Progress Bar line width
    const fillPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressBarFill) {
      progressBarFill.style.width = `${fillPercent}%`;
    }

    // Toggle Nav Buttons
    if (currentStep === 1) {
      if (btnPrev) btnPrev.style.visibility = 'hidden';
      if (btnNext) btnNext.textContent = 'Avanti';
    } else {
      if (btnPrev) btnPrev.style.visibility = 'visible';
      if (btnNext) {
        if (currentStep === totalSteps) {
          btnNext.textContent = 'Invia Richiesta';
        } else {
          btnNext.textContent = 'Avanti';
        }
      }
    }
  };

  // Validation function per step
  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      // Step 1 service selection is always valid because a default is pre-selected
      return true;
    }
    
    if (stepNum === 2) {
      const nameInput = document.getElementById('input-name');
      const emailInput = document.getElementById('input-email');
      const phoneInput = document.getElementById('input-phone');
      
      let valid = true;

      // Basic Name Validation
      if (!nameInput.value.trim()) {
        highlightError(nameInput);
        valid = false;
      } else {
        clearError(nameInput);
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        highlightError(emailInput);
        valid = false;
      } else {
        clearError(emailInput);
      }

      // Phone Validation (at least 7 numbers)
      const phoneRegex = /^[0-9+\s\-()]{7,}$/;
      if (!phoneRegex.test(phoneInput.value.trim())) {
        highlightError(phoneInput);
        valid = false;
      } else {
        clearError(phoneInput);
      }

      return valid;
    }

    return true; // Step 3 notes are optional
  };

  const highlightError = (inputEl) => {
    inputEl.style.borderColor = 'hsl(0, 85%, 60%)';
    inputEl.style.boxShadow = '0 0 0 2px rgba(255, 0, 0, 0.15)';
  };

  const clearError = (inputEl) => {
    inputEl.style.borderColor = '';
    inputEl.style.boxShadow = '';
  };

  // Button Click Events
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      // Validate current step before proceeding
      if (!validateStep(currentStep)) {
        return;
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateWizardUI();
      } else {
        // Submit Form!
        handleFormSubmit();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  }

  // Handle Form Submission and Toast Alert
  const handleFormSubmit = () => {
    // Gather details for console logging to mock database submission
    const data = {
      servizio: selectedServiceInput.value,
      nome: document.getElementById('input-name').value,
      email: document.getElementById('input-email').value,
      telefono: document.getElementById('input-phone').value,
      note: document.getElementById('input-notes').value,
      dataSopralluogo: document.getElementById('input-date').value,
      grandezza: document.getElementById('input-size').value
    };
    
    console.log('Form data submitted successfully:', data);

    // Close Modal
    closeModal();
    
    // Trigger Success Toast
    triggerSuccessToast();
  };


  /* 
    =========================================
    6. CUSTOM DYNAMIC TOAST SYSTEM
    =========================================
  */
  const successToast = document.getElementById('success-toast');

  const triggerSuccessToast = () => {
    if (successToast) {
      // Add show class
      successToast.classList.add('show');
      
      // Auto hide after 4 seconds
      setTimeout(() => {
        successToast.classList.remove('show');
      }, 4000);
    }
  };


  /* 
    =========================================
    7. LIGHT/DARK THEME TOGGLE
    =========================================
  */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  const setInitialTheme = () => {
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme'); // default is dark
    }
  };
  
  setInitialTheme();
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  });

});
