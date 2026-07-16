document.addEventListener('DOMContentLoaded', () => {
  // --- STICKY HEADER ---
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- INNOVATIVE LIQUID INDICATOR PILL ---
  const headerLinks = document.querySelectorAll('.nav-menu > ul > li > a');
  const indicator = document.getElementById('navIndicator');

  function updateIndicator(target) {
    if (!indicator) return;
    const navMenuContainer = document.querySelector('.nav-menu > ul');
    if (!target || !navMenuContainer || window.innerWidth <= 768) {
      indicator.style.opacity = '0';
      return;
    }
    const rect = target.getBoundingClientRect();
    const containerRect = navMenuContainer.getBoundingClientRect();

    indicator.style.opacity = '1';
    indicator.style.left = (rect.left - containerRect.left) + 'px';
    indicator.style.width = rect.width + 'px';
    indicator.style.height = rect.height + 'px';
    indicator.style.top = (rect.top - containerRect.top) + 'px';
  }

  // Find active link on load
  const activeLink = document.querySelector('.nav-menu > ul > li > a.active');
  if (activeLink) {
    setTimeout(() => updateIndicator(activeLink), 100);
  }

  headerLinks.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      updateIndicator(e.target);
    });

    link.addEventListener('click', (e) => {
      headerLinks.forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  const navMenuContainer = document.querySelector('.nav-menu > ul');
  if (navMenuContainer) {
    navMenuContainer.addEventListener('mouseleave', () => {
      const currentActive = document.querySelector('.nav-menu > ul > li > a.active');
      updateIndicator(currentActive);
    });
  }

  // Handle window resizing to keep pill aligned
  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav-menu > ul > li > a.active');
    updateIndicator(currentActive);
  });


  // --- DESKTOP MENU TOGGLE (guarded) ---
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // --- MOBILE DRAWER TOGGLE ---
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');

  if (mobileMenuToggle && mobileDrawer) {
    function toggleDrawer() {
      mobileMenuToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('active');
      if (mobileDrawerOverlay) mobileDrawerOverlay.classList.toggle('active');
    }

    mobileMenuToggle.addEventListener('click', toggleDrawer);
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.addEventListener('click', toggleDrawer);
    }

    // Close drawer when a link is tapped
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        mobileDrawer.classList.remove('active');
        if (mobileDrawerOverlay) mobileDrawerOverlay.classList.remove('active');
      });
    });
  }

  // Mobile Dropdown toggles
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });

  // Close menu when clicking links
  if (navMenu && menuToggle) {
    const navLinks = navMenu.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // --- TESTIMONIAL SLIDER ---
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      if (idx === index) {
        slide.classList.add('active');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide--;
      if (currentSlide < 0) {
        currentSlide = slides.length - 1;
      }
      showSlide(currentSlide);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide++;
      if (currentSlide >= slides.length) {
        currentSlide = 0;
      }
      showSlide(currentSlide);
    });
  }

  // Auto play slides
  let slideInterval = setInterval(() => {
    if (nextBtn) {
      nextBtn.click();
    }
  }, 6000);

  // Stop auto play on user interaction
  if (prevBtn && nextBtn) {
    [prevBtn, nextBtn].forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(slideInterval);
      });
    });
  }

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- BOOKING MODAL ---
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.btn-book-trigger');
  const closeModalBtn = document.getElementById('modalCloseBtn');
  const bookingForm = document.getElementById('bookingForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
  });

  function closeModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeModalBtn.addEventListener('click', closeModal);
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeModal();
    }
  });

  // Form Submit Handler
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bookingName').value;
    const phone = document.getElementById('bookingPhone').value;
    const serviceSelect = document.getElementById('bookingService');
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const message = document.getElementById('bookingNote').value;
    
    let waText = `*New Service Booking*%0A`;
    waText += `*Name:* ${name}%0A`;
    waText += `*Phone:* ${phone}%0A`;
    waText += `*Service:* ${service}%0A`;
    if (message) {
      waText += `*Note:* ${message}%0A`;
    }
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const waUrl = isMobile 
      ? `whatsapp://send?phone=916235780788&text=${waText}`
      : `https://api.whatsapp.com/send?phone=916235780788&text=${waText}`;
    window.open(waUrl, '_blank');
    
    bookingForm.reset();
    closeModal();
  });

  // --- SUBMENU ACTIVE STATE TOGGLE ---
  const submenuItems = document.querySelectorAll('.submenu-item');
  submenuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      submenuItems.forEach(i => i.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  // --- 3-DOT QUICK ACTION SIDEBAR TOGGLE ---
  const moreToggle = document.getElementById('moreToggle');
  const moreSidebar = document.getElementById('moreSidebar');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (moreToggle && moreSidebar) {
    moreToggle.addEventListener('click', () => {
      moreSidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
    });
  }

  if (sidebarClose && sidebarOverlay) {
    const closeSidebar = () => {
      moreSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    };
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
  }
});


