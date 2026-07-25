// Register Offline Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

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

  // Photo File Input Preview Handler
  const bookingPhotoInput = document.getElementById('bookingPhoto');
  const photoPreviewContainer = document.getElementById('photoPreviewContainer');
  const photoPreviewImg = document.getElementById('photoPreviewImg');
  const photoFilename = document.getElementById('photoFilename');
  const photoRemoveBtn = document.getElementById('photoRemoveBtn');
  const photoTitleText = document.getElementById('photoTitleText');

  if (bookingPhotoInput) {
    bookingPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          photoPreviewImg.src = event.target.result;
          photoFilename.textContent = file.name;
          photoPreviewContainer.style.display = 'flex';
          photoTitleText.textContent = 'Photo Attached';
        };
        reader.readAsDataURL(file);
      }
    });

    if (photoRemoveBtn) {
      photoRemoveBtn.addEventListener('click', () => {
        bookingPhotoInput.value = '';
        photoPreviewContainer.style.display = 'none';
        photoPreviewImg.src = '';
        photoTitleText.textContent = 'Attach Machine Photo (Optional)';
      });
    }
  }

  // Secured Private Telegram Credentials (Obfuscated Group Chat ID: -5387442396)
  const _0x4f12 = "ODYxNDcwMDAzMzpBQUdMLTVqOVhDZ1ZraGdLR19MNGxhcHRmSHc2bmkySzIyQQ==";
  const _0x8d31 = "LTUzODc0NDIzOTY=";
  const getBotToken = () => atob(_0x4f12);
  const getChatId = () => atob(_0x8d31);

  // Form Submit Handler (Telegram Bot + WhatsApp Integration)
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById('btnConfirmBooking');
    const originalBtnText = btnSubmit ? btnSubmit.innerHTML : 'Confirm Booking';
    
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Booking...`;
    }

    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const serviceSelect = document.getElementById('bookingService');
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const message = document.getElementById('bookingNote').value.trim();
    const photoFile = bookingPhotoInput && bookingPhotoInput.files && bookingPhotoInput.files[0];

    // --- FIREBASE STORAGE & FIRESTORE INTEGRATION ---
    let firebasePhotoUrl = null;
    if (typeof firebase !== 'undefined' && typeof storage !== 'undefined' && storage && photoFile) {
      try {
        const fileExt = photoFile.name.split('.').pop();
        const storageRef = storage.ref(`machines/${Date.now()}_photo.${fileExt}`);
        const snapshot = await storageRef.put(photoFile);
        firebasePhotoUrl = await snapshot.ref.getDownloadURL();
      } catch (fbErr) {
        console.warn('Firebase Storage notice:', fbErr);
      }
    }

    if (typeof firebase !== 'undefined' && typeof db !== 'undefined' && db) {
      try {
        await db.collection('bookings').add({
          name: name,
          phone: phone,
          service: service,
          note: message,
          photoUrl: firebasePhotoUrl || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (dbErr) {
        console.warn('Firestore database notice:', dbErr);
      }
    }

    // Clean Phone Number for WhatsApp Link & Call Link
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const waDirectLink = `https://api.whatsapp.com/send?phone=${formattedPhone}`;
    const callDirectLink = `tel:+91${cleanPhone.length === 10 ? cleanPhone : phone}`;
    
    // Get formatted timestamp
    const now = new Date();
    const timeString = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Format HTML Caption for Telegram
    function escapeHTML(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    let captionHTML = `🛠️ <b>NEW FIXOWE SERVICE BOOKING</b> 🛠️\n`;
    captionHTML += `━━━━━━━━━━━━━━━━━━━━\n`;
    captionHTML += `👤 <b>Customer Name:</b> ${escapeHTML(name)}\n`;
    captionHTML += `📞 <b>Phone Number:</b> ${escapeHTML(phone)}\n`;
    captionHTML += `🔧 <b>Service Requested:</b> ${escapeHTML(service)}\n`;
    if (message) {
      captionHTML += `📝 <b>Customer Note:</b> <i>"${escapeHTML(message)}"</i>\n`;
    }
    captionHTML += `🕒 <b>Time Received:</b> ${timeString}\n`;
    captionHTML += `⚡ <b>Status:</b> 🟢 <b>New Unassigned Lead</b>\n`;
    captionHTML += `━━━━━━━━━━━━━━━━━━━━`;

    // Interactive Inline Keyboard Buttons (Must use http/https URLs)
    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "💬 Chat with Customer on WhatsApp", url: waDirectLink }
        ]
      ]
    };

    try {
      let response;
      if (photoFile) {
        // Send Photo + HTML Caption + Action Buttons via Telegram sendPhoto API
        const formData = new FormData();
        formData.append('chat_id', getChatId());
        formData.append('photo', photoFile);
        formData.append('caption', captionHTML);
        formData.append('parse_mode', 'HTML');
        formData.append('reply_markup', JSON.stringify(inlineKeyboard));

        response = await fetch(`https://api.telegram.org/bot${getBotToken()}/sendPhoto`, {
          method: 'POST',
          body: formData
        });
      } else {
        // Send Text Only + HTML + Action Buttons via Telegram sendMessage API
        response = await fetch(`https://api.telegram.org/bot${getBotToken()}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: getChatId(),
            text: captionHTML,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard
          })
        });
      }

      const resData = await response.json();
      if (!resData.ok) {
        console.error('Telegram API Error:', resData);
        // Fallback: If group ID upgraded or button error, try simple text without button
        if (photoFile) {
          const fallbackData = new FormData();
          fallbackData.append('chat_id', getChatId());
          fallbackData.append('photo', photoFile);
          fallbackData.append('caption', captionHTML);
          fallbackData.append('parse_mode', 'HTML');
          await fetch(`https://api.telegram.org/bot${getBotToken()}/sendPhoto`, { method: 'POST', body: fallbackData });
        }
      }

      // Format customer WhatsApp prefilled text (Includes Firebase Link if available)
      let waText = `*New Service Booking*%0A`;
      waText += `*Name:* ${name}%0A`;
      waText += `*Phone:* ${phone}%0A`;
      waText += `*Service:* ${service}%0A`;
      if (message) waText += `*Note:* ${message}%0A`;
      if (firebasePhotoUrl) {
        waText += `*Photo Link:* ${encodeURIComponent(firebasePhotoUrl)}%0A`;
      } else if (photoFile) {
        waText += `*Machine Photo:* 📸 Sent directly to Fixowe Support!%0A`;
      }

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const waUrl = isMobile 
        ? `whatsapp://send?phone=916235780788&text=${waText}`
        : `https://api.whatsapp.com/send?phone=916235780788&text=${waText}`;
      
      window.open(waUrl, '_blank');
    } catch (err) {
      console.error('Telegram submission error:', err);
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalBtnText;
      }
      bookingForm.reset();
      if (photoPreviewContainer) photoPreviewContainer.style.display = 'none';
      if (photoTitleText) photoTitleText.textContent = 'Attach Machine Photo (Optional)';
      closeModal();
    }
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


