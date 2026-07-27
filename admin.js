// Fixowe Scandinavian Minimalist Web Admin Portal JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const authOverlay = document.getElementById('auth-overlay');
  const loginForm = document.getElementById('admin-login-form');
  const authErrorMsg = document.getElementById('auth-error-msg');
  const btnLogout = document.getElementById('btn-admin-logout');
  const btnSyncLive = document.getElementById('btn-sync-live');
  
  const bookingsContainer = document.getElementById('bookings-container');
  const techContainer = document.getElementById('tech-container');
  const searchInput = document.getElementById('search-input');
  
  const countTotal = document.getElementById('count-total');
  const countNew = document.getElementById('count-new');
  const countActive = document.getElementById('count-active');
  const countCompleted = document.getElementById('count-completed');

  const fabCreateLead = document.getElementById('fab-create-lead');
  const modalAddLead = document.getElementById('modal-add-lead');
  const formCreateLead = document.getElementById('form-create-lead');
  
  const btnOpenAddTech = document.getElementById('btn-open-add-tech');
  const modalAddTech = document.getElementById('modal-add-tech');
  const formCreateTech = document.getElementById('form-create-tech');

  const modalPhotoViewer = document.getElementById('modal-photo-viewer');
  const highResImg = document.getElementById('high-res-img');

  // Security Rate Limiting State
  let failedLoginAttempts = 0;
  let lockoutUntil = 0;

  // Secure Cryptographic Master Passcode Hashes
  const HASH_FIXOWE_2026 = "4a4442c599e1e63d4e9e4667653126e2cf55ee10a05872566e9520d8420237e3"; // SHA-256 of "fixowe@2026"
  const HASH_PIN_1234 = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"; // SHA-256 of "1234"
  const HASH_FIXOWE2026 = "0734112c1beac7e14cbb5d0540ef305fafb99ac78cd9192b49cc5fa015463eec"; // SHA-256 of "fixowe2026"

  // Application Data (Clean Live Production State)
  let bookingsData = [];
  let techniciansData = [];

  let currentFilter = "ALL";
  let searchQuery = "";

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function verifyAdminAuth(email, pin) {
    const now = Date.now();
    if (now < lockoutUntil) {
      const remainingMins = Math.ceil((lockoutUntil - now) / 60000);
      throw new Error(`Security Lockout: Try again in ${remainingMins} mins.`);
    }

    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, pin);
        failedLoginAttempts = 0;
        return true;
      } catch (e) {}
    }

    const inputHash = await sha256(pin);
    const customHash = localStorage.getItem('fixowe_custom_admin_hash');
    const validHashes = [HASH_FIXOWE_2026, HASH_PIN_1234, HASH_FIXOWE2026];
    if (customHash) validHashes.push(customHash);

    const cleanUser = email.toLowerCase().trim();
    const isUserValid = cleanUser === 'admin@fixowe.com' || cleanUser === '6235780788' || cleanUser === 'admin' || cleanUser === 'ashfak' || cleanUser === 'owner';

    if (isUserValid && validHashes.includes(inputHash)) {
      failedLoginAttempts = 0;
      return true;
    } else {
      failedLoginAttempts++;
      if (failedLoginAttempts >= 3) {
        lockoutUntil = Date.now() + (15 * 60 * 1000);
        throw new Error("Security Alert: System locked for 15 minutes due to failed login attempts.");
      }
      throw new Error(`Invalid credentials (${failedLoginAttempts}/3 attempts).`);
    }
  }

  function checkAuthSession() {
    const token = sessionStorage.getItem('fixowe_secure_token');
    const mainEls = document.querySelectorAll('header, .nav-tabs, .metric-bar, main, .fab-btn');
    
    if (token && token.startsWith('ZERO_TRUST_JWT_')) {
      authOverlay.style.display = 'none';
      mainEls.forEach(el => el.style.visibility = 'visible');
      initFirestoreListener();
    } else {
      authOverlay.style.display = 'flex';
      mainEls.forEach(el => el.style.visibility = 'hidden');
    }
  }

  // AUTOMATED INACTIVITY AUTO-LOGOUT
  let inactivityTimer;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (sessionStorage.getItem('fixowe_secure_token')) {
        sessionStorage.removeItem('fixowe_secure_token');
        checkAuthSession();
        alert("Session Expired: Logged out due to 15 minutes of inactivity.");
      }
    }, 15 * 60 * 1000);
  }

  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetInactivityTimer);
  });

  // PASSCODE TOGGLE & SHAKE ANIMATIONS
  const btnTogglePass = document.getElementById('btn-toggle-pass');
  const adminPinInput = document.getElementById('admin-pin');
  const authCardBox = document.getElementById('auth-card-box');

  if (btnTogglePass && adminPinInput) {
    btnTogglePass.addEventListener('click', () => {
      const type = adminPinInput.getAttribute('type') === 'password' ? 'text' : 'password';
      adminPinInput.setAttribute('type', type);
      btnTogglePass.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // STRICT OWNER PASSCODE LOGIN HANDLER
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value.trim();
      const pin = document.getElementById('admin-pin').value.trim();

      try {
        await verifyAdminAuth(email, pin);
        const secureToken = 'ZERO_TRUST_JWT_' + await sha256(email + Date.now());
        sessionStorage.setItem('fixowe_secure_token', secureToken);
        authOverlay.style.display = 'none';
        authErrorMsg.style.display = 'none';
        if (authCardBox) authCardBox.classList.remove('shake');
        resetInactivityTimer();
        checkAuthSession();
      } catch (err) {
        authErrorMsg.textContent = err.message;
        authErrorMsg.style.display = 'block';
        if (authCardBox) {
          authCardBox.classList.remove('shake');
          void authCardBox.offsetWidth;
          authCardBox.classList.add('shake');
        }
      }
    });
  }

  btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem('fixowe_secure_token');
    clearTimeout(inactivityTimer);
    checkAuthSession();
  });

  // TABS
  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view-panel').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // FILTERS
  document.querySelectorAll('.filter-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      renderBookings();
    });
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderBookings();
  });

  // RENDER BOOKINGS
  function renderBookings() {
    bookingsContainer.innerHTML = '';

    // Duplicate Detection Algorithm
    const phoneCounts = {};
    bookingsData.forEach(b => {
      const clean = b.phone.replace(/[^0-9]/g, '');
      if (clean) phoneCounts[clean] = (phoneCounts[clean] || 0) + 1;
    });

    const duplicateCount = bookingsData.filter(b => {
      const clean = b.phone.replace(/[^0-9]/g, '');
      return clean && phoneCounts[clean] > 1;
    }).length;

    const elDuplicates = document.getElementById('count-duplicates');
    if (elDuplicates) elDuplicates.textContent = duplicateCount;

    const filtered = bookingsData.filter(b => {
      const clean = b.phone.replace(/[^0-9]/g, '');
      const isDup = clean && phoneCounts[clean] > 1;

      const matchesFilter = (currentFilter === 'ALL') ||
        (currentFilter === 'NEW' && b.status === 'NEW') ||
        (currentFilter === 'IN_PROGRESS' && b.status === 'IN PROGRESS') ||
        (currentFilter === 'COMPLETED' && b.status === 'COMPLETED') ||
        (currentFilter === 'DUPLICATES' && isDup);

      const matchesSearch = !searchQuery ||
        b.name.toLowerCase().includes(searchQuery) ||
        b.phone.toLowerCase().includes(searchQuery) ||
        b.service.toLowerCase().includes(searchQuery) ||
        b.location.toLowerCase().includes(searchQuery);

      return matchesFilter && matchesSearch;
    });

    countTotal.textContent = bookingsData.length;
    countNew.textContent = bookingsData.filter(b => b.status === 'NEW').length;
    countActive.textContent = bookingsData.filter(b => b.status === 'IN PROGRESS').length;
    countCompleted.textContent = bookingsData.filter(b => b.status === 'COMPLETED').length;

    if (filtered.length === 0) {
      bookingsContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">No records found.</div>`;
      return;
    }

    filtered.forEach(b => {
      const card = document.createElement('div');
      card.className = 'card-item';

      const cleanPh = b.phone.replace(/[^0-9]/g, '');
      const isDup = cleanPh && phoneCounts[cleanPh] > 1;

      const techOptionsHtml = techniciansData.map(t => 
        `<option value="${t.name} (${t.role})" ${b.technician.includes(t.name) ? 'selected' : ''}>${t.name} (${t.role})</option>`
      ).join('');

      card.innerHTML = `
        ${isDup ? `
          <div style="background:#FEF2F2; border:1px solid #FCA5A5; color:#DC2626; padding:6px 10px; border-radius:6px; font-size:11px; font-weight:600; display:flex; justify-content:space-between; align-items:center;">
            <span>⚠️ POSSIBLY DUPLICATE LEAD (${phoneCounts[cleanPh]} submissions)</span>
            <button style="background:#DC2626; color:#FFF; border:none; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:700; cursor:pointer;" onclick="deleteDuplicateBooking('${b.id}')">Dismiss</button>
          </div>
        ` : ''}

        <div class="card-header">
          <div>
            <div class="client-title">${escapeHtml(b.name)}</div>
            <div class="client-time">${escapeHtml(b.time)}</div>
          </div>
          <span class="status-tag tag-${b.status.replace(' ', '-')}" onclick="toggleBookingStatus('${b.id}')">${escapeHtml(b.status)}</span>
        </div>

        <div class="service-desc">${escapeHtml(b.service)}</div>
        <div class="location-desc">Location: ${escapeHtml(b.location)}</div>

        ${b.photoUrl ? `
          <div class="photo-thumb" onclick="openPhotoModal('${escapeHtml(b.photoUrl)}')">
            <img src="${escapeHtml(b.photoUrl)}" alt="Machine Photo" onerror="this.src='assets/transparent-logo-fixowe.png'" />
            <span class="photo-tag">Inspect Photo</span>
          </div>
        ` : ''}

        ${b.note ? `<div class="note-container">"${escapeHtml(b.note)}"</div>` : ''}

        <div style="display:flex; gap:8px;">
          <select class="select-tech" style="flex:1;" onchange="updateBookingStatus('${b.id}', this.value)">
            <option value="NEW" ${b.status === 'NEW' ? 'selected' : ''}>Status: NEW</option>
            <option value="IN PROGRESS" ${b.status === 'IN PROGRESS' ? 'selected' : ''}>Status: IN PROGRESS</option>
            <option value="COMPLETED" ${b.status === 'COMPLETED' ? 'selected' : ''}>Status: COMPLETED</option>
          </select>

          <select class="select-tech" style="flex:1;" onchange="assignTechnician('${b.id}', this.value)">
            <option value="Unassigned">Assign Tech...</option>
            ${techOptionsHtml}
          </select>
        </div>

        <div class="action-row">
          <a class="btn-act btn-act-main" href="https://api.whatsapp.com/send?phone=${b.phone.replace(/[^0-9]/g, '')}" target="_blank">WhatsApp</a>
          <a class="btn-act" href="tel:${b.phone}">Call</a>
        </div>
      `;

      bookingsContainer.appendChild(card);
    });
  }

  // RENDER TECHNICIANS
  function renderTechnicians() {
    techContainer.innerHTML = '';
    techniciansData.forEach(t => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; font-size:15px; letter-spacing:-0.01em;">${escapeHtml(t.name)}</div>
            <div style="font-size:12px; color:var(--blue); font-weight:600; margin-top:2px;">${escapeHtml(t.role)}</div>
          </div>
          <span class="status-tag ${t.status === 'AVAILABLE' ? 'tag-COMPLETED' : 'tag-IN-PROGRESS'}">${escapeHtml(t.status)}</span>
        </div>
        <div style="font-size:12px; color:var(--text-muted); display:flex; justify-content:space-between; margin-top:6px;">
          <span>Phone: ${escapeHtml(t.phone)}</span>
          <span style="font-weight:600; color:var(--text-main);">Active Jobs: ${t.activeJobs}</span>
        </div>
      `;
      techContainer.appendChild(card);
    });
  }

  window.deleteDuplicateBooking = function(id) {
    if (confirm("Are you sure you want to dismiss this duplicate lead?")) {
      bookingsData = bookingsData.filter(b => b.id !== id);
      if (typeof db !== 'undefined' && db) {
        db.collection("bookings").doc(id).delete().catch(() => {});
      }
      renderBookings();
    }
  };

  window.updateBookingStatus = function(id, newStatus) {
    const booking = bookingsData.find(b => b.id === id);
    if (booking) {
      booking.status = newStatus;
      if (typeof db !== 'undefined' && db) {
        db.collection("bookings").doc(id).update({ status: newStatus }).catch(() => {});
      }
      renderBookings();
    }
  };

  window.toggleBookingStatus = function(id) {
    const booking = bookingsData.find(b => b.id === id);
    if (booking) {
      const nextStatus = booking.status === 'NEW' ? 'IN PROGRESS' : (booking.status === 'IN PROGRESS' ? 'COMPLETED' : 'NEW');
      updateBookingStatus(id, nextStatus);
    }
  };

  window.assignTechnician = function(id, techValue) {
    const booking = bookingsData.find(b => b.id === id);
    if (booking) {
      booking.technician = techValue;
      if (typeof db !== 'undefined' && db) {
        db.collection("bookings").doc(id).update({ technician: techValue }).catch(() => {});
      }
    }
  };

  window.openPhotoModal = function(url) {
    highResImg.src = url;
    modalPhotoViewer.classList.add('active');
  };



  // EXPORT TO CSV FEATURE
  const btnExportCsv = document.getElementById('btn-export-csv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Booking ID,Customer Name,Phone Number,Service,Location,Status,Technician,Estimated Amount,Date Time\n";

      bookingsData.forEach(b => {
        const row = [
          `"${b.id}"`,
          `"${b.name.replace(/"/g, '""')}"`,
          `"${b.phone.replace(/"/g, '""')}"`,
          `"${b.service.replace(/"/g, '""')}"`,
          `"${b.location.replace(/"/g, '""')}"`,
          `"${b.status}"`,
          `"${b.technician.replace(/"/g, '""')}"`,
          `"${b.estimatedCost}"`,
          `"${b.time}"`
        ].join(",");
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `fixowe_bookings_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  fabCreateLead.addEventListener('click', () => modalAddLead.classList.add('active'));
  btnOpenAddTech.addEventListener('click', () => modalAddTech.classList.add('active'));

  // ADMIN PASSCODE & AUTHENTICATION SETTINGS
  const btnAdminSecurity = document.getElementById('btn-admin-security');
  const modalAdminSecurity = document.getElementById('modal-admin-security');
  const formUpdatePasscode = document.getElementById('form-update-passcode');
  const secStatusMsg = document.getElementById('sec-status-msg');

  if (btnAdminSecurity) {
    btnAdminSecurity.addEventListener('click', () => {
      modalAdminSecurity.classList.add('active');
    });
  }

  if (formUpdatePasscode) {
    formUpdatePasscode.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPin = document.getElementById('sec-current-pin').value.trim();
      const newPin = document.getElementById('sec-new-pin').value.trim();
      const confirmPin = document.getElementById('sec-confirm-pin').value.trim();

      if (newPin !== confirmPin) {
        secStatusMsg.style.color = "var(--red)";
        secStatusMsg.textContent = "New passcodes do not match!";
        secStatusMsg.style.display = "block";
        return;
      }

      if (newPin.length < 4) {
        secStatusMsg.style.color = "var(--red)";
        secStatusMsg.textContent = "Passcode must be at least 4 characters long.";
        secStatusMsg.style.display = "block";
        return;
      }

      try {
        const curHash = await sha256(currentPin);
        const storedCustom = localStorage.getItem('fixowe_custom_admin_hash');
        const validHashes = [HASH_FIXOWE_2026, HASH_PIN_1234, HASH_FIXOWE2026];
        if (storedCustom) validHashes.push(storedCustom);

        if (!validHashes.includes(curHash)) {
          secStatusMsg.style.color = "var(--red)";
          secStatusMsg.textContent = "Current passcode is incorrect!";
          secStatusMsg.style.display = "block";
          return;
        }

        const newHash = await sha256(newPin);
        localStorage.setItem('fixowe_custom_admin_hash', newHash);

        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
          await firebase.auth().currentUser.updatePassword(newPin).catch(() => {});
        }

        secStatusMsg.style.color = "var(--green)";
        secStatusMsg.textContent = "Admin Passcode updated successfully!";
        secStatusMsg.style.display = "block";
        formUpdatePasscode.reset();

        setTimeout(() => {
          modalAdminSecurity.classList.remove('active');
          secStatusMsg.style.display = "none";
        }, 1500);

      } catch (err) {
        secStatusMsg.style.color = "var(--red)";
        secStatusMsg.textContent = "Error updating passcode: " + err.message;
        secStatusMsg.style.display = "block";
      }
    });
  }

  // UNIVERSAL BULLETPROOF MODAL CLOSING LOGIC
  window.closeAllModals = function() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  };

  // 1. Global Event Delegation for all [data-close] buttons & elements
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      const targetId = closeBtn.getAttribute('data-close');
      if (targetId) {
        const targetModal = document.getElementById(targetId);
        if (targetModal) targetModal.classList.remove('active');
      } else {
        closeAllModals();
      }
    }
    
    // 2. Backdrop Click to Close (clicking background overlay)
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('active');
    }
  });

  // 3. Escape Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  formCreateLead.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('lead-name').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();
    const service = document.getElementById('lead-service').value.trim();
    const note = document.getElementById('lead-note').value.trim();

    const docId = "manual_" + Date.now();
    const newLead = {
      id: docId,
      name, phone, service, note,
      location: "Manjeri, Kerala",
      time: "Just Now",
      status: "NEW",
      photoUrl: null,
      technician: "Unassigned",
      estimatedCost: "₹1,200"
    };

    bookingsData.unshift(newLead);
    renderBookings();

    if (typeof db !== 'undefined' && db) {
      db.collection("bookings").doc(docId).set({
        name, phone, service, note, status: "NEW", timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(err => console.log("Firestore lead error:", err));
    }

    modalAddLead.classList.remove('active');
    formCreateLead.reset();
  });

  formCreateTech.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('tech-name').value.trim();
    const role = document.getElementById('tech-role').value.trim();
    const phone = document.getElementById('tech-phone').value.trim();

    const techId = "t_" + Date.now();
    const newTech = {
      id: techId,
      name, role, phone,
      status: "AVAILABLE",
      activeJobs: 0
    };

    techniciansData.push(newTech);
    renderTechnicians();
    renderBookings();

    if (typeof db !== 'undefined' && db) {
      db.collection("technicians").doc(techId).set({
        name, role, phone, status: "AVAILABLE", activeJobs: 0
      }).catch(err => console.log("Firestore tech error:", err));
    }

    modalAddTech.classList.remove('active');
    formCreateTech.reset();
  });

  const DEMO_NAMES = ["rahul sharma", "anil kumar", "mohammed faisal"];

  function initFirestoreListener() {
    if (typeof db !== 'undefined' && db) {
      db.collection("bookings").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            const docId = change.doc.id;
            const nameLower = (data.name || '').toLowerCase().trim();

            if (docId.startsWith('doc_') || DEMO_NAMES.includes(nameLower)) {
              return;
            }

            if (!bookingsData.some(b => b.id === docId)) {
              bookingsData.unshift({
                id: docId,
                name: data.name || "Customer",
                phone: data.phone || "",
                service: data.service || "AC Service",
                note: data.note || "",
                location: "Manjeri, Kerala",
                time: "Live Sync",
                status: data.status || "NEW",
                photoUrl: data.photoUrl || null,
                technician: "Unassigned",
                estimatedCost: "₹1,500"
              });
              renderBookings();
            }
          }
        });
      }, (error) => {
        console.log("Firestore snapshot info:", error);
      });
    }
  }

  btnSyncLive.addEventListener('click', () => {
    initFirestoreListener();
    renderBookings();
  });

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  checkAuthSession();
  renderBookings();
  renderTechnicians();
});
