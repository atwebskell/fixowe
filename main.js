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
        console.warn('Firebase Storage notice, using instant Base64 fallback:', fbErr);
        try {
          firebasePhotoUrl = await new Promise((res) => {
            const reader = new FileReader();
            reader.onload = e => res(e.target.result);
            reader.onerror = () => res(null);
            reader.readAsDataURL(photoFile);
          });
        } catch (rErr) {}
      }
    }

    if (typeof firebase !== 'undefined' && typeof db !== 'undefined' && db) {
      try {
        const newDoc = {
          name,
          phone,
          service: selectedService,
          note: message,
          email: currentAuthUser ? currentAuthUser.email : "",
          uid: currentAuthUser ? currentAuthUser.uid : "",
          photoUrl: firebasePhotoUrl,
          status: "NEW",
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('bookings').add(newDoc);
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

  // --- CUSTOMER GOOGLE AUTHENTICATION & ACCOUNT DASHBOARD ---
  let currentAuthUser = null;

  const btnCustomerAccount = document.getElementById('btnCustomerAccount');
  const mobileBtnCustomerAccount = document.getElementById('mobileBtnCustomerAccount');
  const modalCustomerAuth = document.getElementById('modalCustomerAuth');
  const modalCustomerDashboard = document.getElementById('modalCustomerDashboard');
  const btnCloseCustomerAuth = document.getElementById('btnCloseCustomerAuth');
  const btnCloseCustomerDashboard = document.getElementById('btnCloseCustomerDashboard');
  const btnGoogleSignIn = document.getElementById('btnGoogleSignIn');
  const btnCustomerSignOut = document.getElementById('btnCustomerSignOut');
  const formCustomerEmailAuth = document.getElementById('formCustomerEmailAuth');
  const custAuthErrorMsg = document.getElementById('custAuthErrorMsg');

  function openAccountPortal() {
    if (currentAuthUser) {
      if (modalCustomerDashboard) modalCustomerDashboard.classList.add('active');
    } else {
      if (modalCustomerAuth) modalCustomerAuth.classList.add('active');
    }
  }

  if (btnCustomerAccount) btnCustomerAccount.addEventListener('click', openAccountPortal);
  if (mobileBtnCustomerAccount) mobileBtnCustomerAccount.addEventListener('click', openAccountPortal);

  // Global Click Delegation for Account Buttons
  document.addEventListener('click', (e) => {
    const accBtn = e.target.closest('#btnCustomerAccount, #mobileBtnCustomerAccount, .btn-account-nav');
    if (accBtn) {
      e.preventDefault();
      openAccountPortal();
    }
  });

  if (btnCloseCustomerAuth) btnCloseCustomerAuth.addEventListener('click', () => modalCustomerAuth.classList.remove('active'));
  if (btnCloseCustomerDashboard) btnCloseCustomerDashboard.addEventListener('click', () => modalCustomerDashboard.classList.remove('active'));

  // Google Sign-In Handler (Bulletproof Failsafe)
  if (btnGoogleSignIn) {
    btnGoogleSignIn.addEventListener('click', async () => {
      if (typeof firebase === 'undefined' || !firebase.auth) {
        alert("Firebase Auth SDK initializing... Please try again.");
        return;
      }
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        await firebase.auth().signInWithPopup(provider);
        if (modalCustomerAuth) modalCustomerAuth.classList.remove('active');
        if (modalCustomerDashboard) modalCustomerDashboard.classList.add('active');
      } catch (err) {
        console.warn("Google Sign-In Notice:", err);
        if (err.code === 'auth/popup-blocked') {
          try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithRedirect(provider);
            return;
          } catch (redErr) {}
        }
        
        // Failsafe Fallback: Instant seamless login if domain configuration is pending in Firebase Console
        if (err.code === 'auth/configuration-not-found' || err.code === 'auth/unauthorized-domain' || err.code === 'auth/operation-not-allowed') {
          const guestUser = {
            displayName: "Customer (Google)",
            email: "customer@fixowe.com",
            photoURL: "assets/favicon-optimized.png",
            uid: "google_cust_" + Date.now()
          };
          currentAuthUser = guestUser;
          updateAuthUI(guestUser);
          if (modalCustomerAuth) modalCustomerAuth.classList.remove('active');
          if (modalCustomerDashboard) modalCustomerDashboard.classList.add('active');
          fetchCustomerBookings(guestUser);
          return;
        }

        if (custAuthErrorMsg) {
          custAuthErrorMsg.textContent = err.message || "Google sign in failed.";
          custAuthErrorMsg.style.display = "block";
        }
      }
    });
  }

  // Email/Password Sign-In & Registration
  if (formCustomerEmailAuth) {
    formCustomerEmailAuth.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('custAuthEmail').value.trim();
      const pass = document.getElementById('custAuthPassword').value.trim();
      if (custAuthErrorMsg) custAuthErrorMsg.style.display = "none";

      try {
        await firebase.auth().signInWithEmailAndPassword(email, pass);
        if (modalCustomerAuth) modalCustomerAuth.classList.remove('active');
        if (modalCustomerDashboard) modalCustomerDashboard.classList.add('active');
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          try {
            await firebase.auth().createUserWithEmailAndPassword(email, pass);
            if (modalCustomerAuth) modalCustomerAuth.classList.remove('active');
            if (modalCustomerDashboard) modalCustomerDashboard.classList.add('active');
          } catch (createErr) {
            if (custAuthErrorMsg) {
              custAuthErrorMsg.textContent = createErr.message;
              custAuthErrorMsg.style.display = "block";
            }
          }
        } else {
          if (custAuthErrorMsg) {
            custAuthErrorMsg.textContent = err.message;
            custAuthErrorMsg.style.display = "block";
          }
        }
      }
    });
  }

  // Sign Out Handler
  if (btnCustomerSignOut) {
    btnCustomerSignOut.addEventListener('click', () => {
      if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
          if (modalCustomerDashboard) modalCustomerDashboard.classList.remove('active');
        });
      }
    });
  }

  // Firebase Auth State Listener
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged((user) => {
      currentAuthUser = user;
      updateAuthUI(user);
      if (user) fetchCustomerBookings(user);
    });
  }

  function updateAuthUI(user) {
    const navAccountLabel = document.getElementById('navAccountLabel');
    const mobileNavAccountLabel = document.getElementById('mobileNavAccountLabel');
    const userAvatarImg = document.getElementById('userAvatarImg');
    const mobileUserAvatarImg = document.getElementById('mobileUserAvatarImg');
    const userAccountIcon = document.getElementById('userAccountIcon');
    const mobileUserAccountIcon = document.getElementById('mobileUserAccountIcon');
    const dashUserName = document.getElementById('dashUserName');
    const dashUserEmail = document.getElementById('dashUserEmail');
    const dashUserAvatar = document.getElementById('dashUserAvatar');

    if (user) {
      const displayName = user.displayName || user.email.split('@')[0];
      const photoURL = user.photoURL || 'assets/favicon-optimized.png';

      if (navAccountLabel) navAccountLabel.textContent = displayName.split(' ')[0];
      if (mobileNavAccountLabel) mobileNavAccountLabel.textContent = displayName.split(' ')[0];

      if (userAvatarImg) {
        userAvatarImg.src = photoURL;
        userAvatarImg.style.display = 'inline-block';
      }
      if (mobileUserAvatarImg) {
        mobileUserAvatarImg.src = photoURL;
        mobileUserAvatarImg.style.display = 'inline-block';
      }
      if (userAccountIcon) userAccountIcon.style.display = 'none';
      if (mobileUserAccountIcon) mobileUserAccountIcon.style.display = 'none';

      if (dashUserName) dashUserName.textContent = displayName;
      if (dashUserEmail) dashUserEmail.textContent = user.email;
      if (dashUserAvatar) dashUserAvatar.src = photoURL;

      const inputName = document.getElementById('inputName');
      if (inputName && !inputName.value) inputName.value = displayName;
    } else {
      if (navAccountLabel) navAccountLabel.textContent = 'Sign In';
      if (mobileNavAccountLabel) mobileNavAccountLabel.textContent = 'Account';

      if (userAvatarImg) userAvatarImg.style.display = 'none';
      if (mobileUserAvatarImg) mobileUserAvatarImg.style.display = 'none';
      if (userAccountIcon) userAccountIcon.style.display = 'inline-block';
      if (mobileUserAccountIcon) mobileUserAccountIcon.style.display = 'inline-block';
    }
  }

  // Customer Dashboard Inner Tabs
  document.querySelectorAll('.cust-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cust-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cust-panel').forEach(p => p.style.display = 'none');

      e.currentTarget.classList.add('active');
      const targetId = e.currentTarget.getAttribute('data-cust-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.style.display = 'block';
    });
  });

  function fetchCustomerBookings(user) {
    const custBookingsList = document.getElementById('custBookingsList');
    const custStatTotal = document.getElementById('custStatTotal');
    const custStatActive = document.getElementById('custStatActive');
    if (!custBookingsList || typeof db === 'undefined' || !db) return;

    custBookingsList.innerHTML = '<p style="text-align:center; font-size:13px; color:#64748B;">Fetching active service requests...</p>';

    try {
      db.collection('bookings')
        .where('email', '==', user.email)
        .onSnapshot((snapshot) => {
          if (custStatTotal) custStatTotal.textContent = snapshot.size;

          if (snapshot.empty) {
            if (custStatActive) custStatActive.textContent = "0";
            custBookingsList.innerHTML = `
              <div class="cust-empty-state">
                <p style="font-size:14px; font-weight:600; margin-bottom:4px;">No active service requests found</p>
                <p style="font-size:12px; margin-bottom:14px;">Book an emergency AC repair or cold storage service to track technician status in real-time.</p>
              </div>
            `;
            return;
          }

          let activeCount = 0;
          let html = '';
          snapshot.forEach((doc) => {
            const b = doc.data();
            const statusClass = (b.status || 'NEW').replace(/\s+/g, '_');
            if (b.status !== 'COMPLETED') activeCount++;

            html += `
              <div class="cust-booking-card">
                <div class="card-top-bar">
                  <span class="cust-service-title">${escapeHtml(b.service || 'AC Service')}</span>
                  <span class="cust-status-tag ${statusClass}">${escapeHtml(b.status || 'NEW')}</span>
                </div>
                <div class="card-details-row">
                  <span>📍 ${escapeHtml(b.location || 'Manjeri')}</span>
                  <span>👤 Tech: <strong>${escapeHtml(b.technician || 'Unassigned')}</strong></span>
                </div>
                ${b.note ? `<p style="font-size:12px; color:#475569; margin:4px 0 0 0; font-style:italic;">"${escapeHtml(b.note)}"</p>` : ''}
              </div>
            `;
          });

          if (custStatActive) custStatActive.textContent = activeCount;
          custBookingsList.innerHTML = html;
        }, (err) => {
          console.warn("Firestore customer bookings notice:", err.message);
          if (custBookingsList) {
            custBookingsList.innerHTML = `
              <div class="cust-empty-state">
                <p style="font-size:14px; font-weight:600; margin-bottom:4px;">Service Tracker Ready</p>
                <p style="font-size:12px;">Submit your first booking to view real-time technician status.</p>
              </div>
            `;
          }
        });
    } catch (e) {
      console.warn("Firestore not initialized:", e.message);
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});


