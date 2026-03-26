/* ============================================
   VolAir Airlines — Main JavaScript
   ============================================ */

'use strict';

// ── State ──────────────────────────────────────
const STATE = {
  tripType:      'one-way',
  departure:     '',
  returnDate:    '',
  passengers:    { adults: 1, teens: 0, children: 0 },
  selectedFlight: null,
  extras:        { luggage: false, priority: false, drinks: false },
  extrasPerPassenger: [],
  selectedSeats: [],
  contact:       { email: '', phone: '' },
  paymentMethod: 'card',
  totalPrice:    0,
  bookingRef:    ''
};

// Price map
const EXTRA_PRICES = { luggage: 35, priority: 15, drinks: 25 };
const BASE_PRICES  = { 'VA101': 120, 'VA203': 95, 'VA315': 145 };

// ── Utility helpers ────────────────────────────
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function saveState() {
  try { sessionStorage.setItem('volair_state', JSON.stringify(STATE)); } catch(e) {}
}
function loadState() {
  try {
    const s = sessionStorage.getItem('volair_state');
    if (s) Object.assign(STATE, JSON.parse(s));
  } catch(e) {}
}

function formatPrice(n) { return '€' + n.toFixed(2); }

function generateRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'VA';
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

// ── i18n helper ────────────────────────────────
function tOr(key, hebrewDefault) {
  const t = window.i18n?.t(key);
  return (t !== undefined && t !== null) ? t : hebrewDefault;
}

// ── Mobile nav toggle ──────────────────────────
function initNav() {
  const toggle = $('.nav-toggle');
  const links  = $('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Highlight active page
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Entry animations ───────────────────────────
function initAnimations() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Stagger-animate direct children of these containers
  const containerSelectors = [
    '.crew-grid',
    '.why-grid',
    '.destinations-grid',
    '.fleet-hero-images',
    '.crew-hero-images',
    '.fleet-spec-grid',
    '.value-cards',
  ];

  const animEls = [];

  containerSelectors.forEach(sel => {
    $$(sel).forEach(container => {
      Array.from(container.children).forEach((child, i) => {
        child.style.setProperty('--anim-delay', `${i * 80}ms`);
        child.classList.add('anim-ready');
        animEls.push(child);
      });
    });
  });

  // Stat items (crew + fleet pages)
  $$('.stat-item').forEach((el, i) => {
    el.style.setProperty('--anim-delay', `${i * 60}ms`);
    el.classList.add('anim-ready');
    animEls.push(el);
  });

  if (!animEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('anim-done');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  animEls.forEach(el => io.observe(el));
}

// ── FLIGHTS PAGE ───────────────────────────────
function initFlightsPage() {
  if (!$('.flights-page')) return;
  loadState();

  // Trip type toggle
  $$('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.tripType = btn.dataset.type;
      const returnRow = $('.return-row');
      if (returnRow) returnRow.classList.toggle('visible', STATE.tripType === 'round-trip');
      saveState();
    });
  });

  // Restore trip type
  if (STATE.tripType === 'round-trip') {
    const btn = $('[data-type="round-trip"]');
    if (btn) { btn.click(); }
  }

  // Passenger counters
  $$('.counter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const valEl  = $(`[data-val="${target}"]`);
      if (!valEl) return;

      let val = parseInt(valEl.textContent) || 0;
      const min = parseInt(valEl.dataset.min ?? 0);
      const max = parseInt(valEl.dataset.max ?? 9);

      if (btn.dataset.action === 'inc') val = Math.min(val + 1, max);
      if (btn.dataset.action === 'dec') val = Math.max(val - 1, min);

      valEl.textContent = val;
      STATE.passengers[target] = val;
      saveState();
    });
  });

  // Restore passenger counts
  Object.entries(STATE.passengers).forEach(([k, v]) => {
    const el = $(`[data-val="${k}"]`);
    if (el) el.textContent = v;
  });

  // Date inputs
  const deptInput = $('#departure-date');
  const retInput  = $('#return-date');

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  if (deptInput) { deptInput.min = today; deptInput.value = STATE.departure || ''; }
  if (retInput)  { retInput.min  = today; retInput.value  = STATE.returnDate || ''; }

  if (deptInput) deptInput.addEventListener('change', () => {
    STATE.departure = deptInput.value;
    if (retInput) retInput.min = deptInput.value;
    saveState();
  });
  if (retInput) retInput.addEventListener('change', () => {
    STATE.returnDate = retInput.value;
    saveState();
  });

  // Search button
  const searchBtn = $('#search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (!deptInput || !deptInput.value) {
        showError(deptInput, tOr('err.noDate', 'נא לבחור תאריך יציאה.'));
        return;
      }
      const totalPassengers = STATE.passengers.adults + STATE.passengers.teens + STATE.passengers.children;
      if (totalPassengers < 1) {
        showToast(tOr('err.noPax', 'נא להוסיף לפחות נוסע אחד.'), 'error');
        return;
      }
      STATE.departure = deptInput.value;
      saveState();
      window.location.href = 'results.html';
    });
  }
}

// ── RESULTS PAGE ───────────────────────────────
function initResultsPage() {
  if (!$('.results-page')) return;
  loadState();

  const flights = [
    { id: 'VA101', dep: '06:30', arr: '08:45', duration: '2h 15m', price: 120, label: tOr('lbl.bestValue',   'הכי משתלם') },
    { id: 'VA203', dep: '11:00', arr: '13:10', duration: '2h 10m', price: 95,  label: null },
    { id: 'VA315', dep: '17:45', arr: '20:05', duration: '2h 20m', price: 145, label: tOr('lbl.mostPopular', 'הפופולרי ביותר') }
  ];

  const list = $('.flight-list');
  if (list) {
    flights.forEach(f => {
      const card = document.createElement('div');
      card.className = 'flight-card' + (f.id === STATE.selectedFlight ? ' selected' : '');
      card.dataset.id = f.id;
      const isBest = f.label === tOr('lbl.bestValue', 'הכי משתלם');
      card.innerHTML = `
        <div class="flight-header">
          <span class="flight-number">${f.id}</span>
          ${f.label ? `<span class="flight-badge ${isBest?'best':''}">${f.label}</span>` : ''}
        </div>
        <div class="flight-times">
          <div class="flight-time">
            <div class="time">${f.dep}</div>
            <div class="airport">TLV</div>
          </div>
          <div class="flight-duration">
            <div class="duration-text">${f.duration}</div>
            <div class="duration-line"></div>
            <div class="flight-direct">${tOr('lbl.direct', 'ישיר')}</div>
          </div>
          <div class="flight-time">
            <div class="time">${f.arr}</div>
            <div class="airport">BCN</div>
          </div>
        </div>
        <div class="flight-footer">
          <div class="flight-price">
            <div class="amount">${formatPrice(f.price)}</div>
            <div class="per">${tOr('lbl.perPassenger', 'לנוסע')}</div>
          </div>
          <button class="btn btn-primary btn-sm select-flight-btn" data-id="${f.id}">
            ${f.id === STATE.selectedFlight ? tOr('lbl.selected', 'נבחר ✓') : tOr('lbl.select', 'בחר')}
          </button>
        </div>`;
      list.appendChild(card);
    });

    // Stagger flight cards in
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(() => {
        $$('.flight-card', list).forEach((c, i) => {
          c.style.animation = `fade-in-up 500ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms both`;
        });
      });
    }

    // Select flight
    list.addEventListener('click', e => {
      const btn = e.target.closest('.select-flight-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      STATE.selectedFlight = id;
      const flight = flights.find(f => f.id === id);
      STATE.totalPrice = flight ? flight.price : 0;
      saveState();

      $$('.flight-card').forEach(c => c.classList.remove('selected'));
      $$('.select-flight-btn').forEach(b => { b.textContent = tOr('lbl.select', 'בחר'); });
      btn.closest('.flight-card').classList.add('selected');
      btn.textContent = tOr('lbl.selected', 'נבחר ✓');

      updateExtrasTotal();
    });
  }

  // Extras — per-passenger
  const totalPassengers = STATE.passengers.adults + STATE.passengers.teens + STATE.passengers.children || 1;

  // Ensure extrasPerPassenger is initialised with correct length
  if (!Array.isArray(STATE.extrasPerPassenger) || STATE.extrasPerPassenger.length !== totalPassengers) {
    STATE.extrasPerPassenger = Array.from({ length: totalPassengers }, (_, i) =>
      STATE.extrasPerPassenger?.[i]
        ? { ...STATE.extrasPerPassenger[i] }
        : { luggage: false, priority: false, drinks: false }
    );
  }

  let currentPaxIndex = 0;

  const paxTabsEl   = $('#pax-tabs');
  const applyAllBtn = $('#apply-all-btn');
  const perLabelEl  = $('#extras-per-label');

  if (totalPassengers > 1 && paxTabsEl) {
    paxTabsEl.style.display   = '';
    if (applyAllBtn) applyAllBtn.style.display = '';
    if (perLabelEl)  perLabelEl.setAttribute('data-i18n', 'results.perAll');

    for (let i = 0; i < totalPassengers; i++) {
      const tab = document.createElement('button');
      tab.className = 'pax-tab' + (i === 0 ? ' active' : '');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tab.dataset.pax = i;
      tab.textContent = tOr('results.paxTab', 'נוסע') + ' ' + (i + 1);
      tab.addEventListener('click', () => {
        currentPaxIndex = i;
        $$('.pax-tab', paxTabsEl).forEach((t, idx) => {
          t.classList.toggle('active', idx === i);
          t.setAttribute('aria-selected', idx === i ? 'true' : 'false');
        });
        refreshExtrasUI();
      });
      paxTabsEl.appendChild(tab);
    }
  }

  if (applyAllBtn) {
    applyAllBtn.addEventListener('click', () => {
      const src = { ...STATE.extrasPerPassenger[currentPaxIndex] };
      STATE.extrasPerPassenger = STATE.extrasPerPassenger.map(() => ({ ...src }));
      syncExtras(); saveState(); refreshExtrasUI(); updateExtrasTotal();
    });
  }

  function syncExtras() {
    const merged = { luggage: false, priority: false, drinks: false };
    STATE.extrasPerPassenger.forEach(p => {
      Object.keys(merged).forEach(k => { if (p[k]) merged[k] = true; });
    });
    STATE.extras = merged;
  }

  function refreshExtrasUI() {
    const pax = STATE.extrasPerPassenger[currentPaxIndex];
    $$('.extra-item').forEach(item => {
      const chk = item.querySelector('.extra-checkbox');
      const key = item.dataset.extra;
      if (!chk || !key) return;
      chk.classList.toggle('checked', !!pax[key]);
      item.setAttribute('aria-checked', pax[key] ? 'true' : 'false');
    });
  }

  $$('.extra-item').forEach(item => {
    const chk = item.querySelector('.extra-checkbox');
    const key = item.dataset.extra;
    if (!chk || !key) return;

    item.addEventListener('click', () => {
      STATE.extrasPerPassenger[currentPaxIndex][key] = !STATE.extrasPerPassenger[currentPaxIndex][key];
      syncExtras(); saveState(); refreshExtrasUI(); updateExtrasTotal();
    });
    item.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); item.click(); }
    });
  });

  refreshExtrasUI();

  function updateExtrasTotal() {
    const basePrice  = STATE.selectedFlight ? (BASE_PRICES[STATE.selectedFlight] || 0) : 0;
    const extrasSum  = STATE.extrasPerPassenger.reduce((sum, pax) =>
      sum + Object.entries(pax).filter(([,v]) => v).reduce((s, [k]) => s + (EXTRA_PRICES[k] || 0), 0), 0);
    const grand = basePrice * totalPassengers + extrasSum;
    STATE.totalPrice = grand;
    const totalEl = $('#extras-total');
    if (totalEl) {
      totalEl.textContent = formatPrice(grand);
      totalEl.classList.remove('price-flash');
      void totalEl.offsetWidth;
      totalEl.classList.add('price-flash');
    }
  }

  updateExtrasTotal();

  // Navigation
  const nextBtn = $('#next-btn');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (!STATE.selectedFlight) { showToast(tOr('err.noFlight', 'נא לבחור טיסה תחילה.'), 'error'); return; }
    window.location.href = 'seats.html';
  });

  const backBtn = $('#back-btn');
  if (backBtn) backBtn.addEventListener('click', () => window.location.href = 'flights.html');
}

// ── SEATS PAGE ─────────────────────────────────
function initSeatsPage() {
  if (!$('.seats-page')) return;
  loadState();

  // Define pre-taken seats
  const TAKEN = ['1A','1C','2B','2D','3A','4C','4E','5B','6A','6F','7D','8B','8E','9C','10A','10F','11D','12B','13A','13E','14C','15B','16A','16D','17F','18C','19A','19E','20B'];

  const totalPassengers = STATE.passengers.adults + STATE.passengers.teens + STATE.passengers.children || 1;

  const map = $('.seat-map');
  if (!map) return;

  // Build seat map: rows 1-20, cols A-F (3+3)
  for (let row = 1; row <= 20; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'seat-row';

    const numEl = document.createElement('div');
    numEl.className = 'seat-row-num';
    numEl.textContent = row;
    rowEl.appendChild(numEl);

    ['A','B','C'].forEach(col => {
      const seat = makeSeat(row, col, TAKEN);
      rowEl.appendChild(seat);
    });

    const aisle = document.createElement('div');
    aisle.className = 'seat-aisle';
    rowEl.appendChild(aisle);

    ['D','E','F'].forEach(col => {
      const seat = makeSeat(row, col, TAKEN);
      rowEl.appendChild(seat);
    });

    map.appendChild(rowEl);
  }

  function makeSeat(row, col, taken) {
    const id = `${row}${col}`;
    const el = document.createElement('div');
    el.className = 'seat ' + (taken.includes(id) ? 'taken' : 'available') + (row <= 3 ? ' first-class' : '');
    el.dataset.seat = id;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Seat ${id}${taken.includes(id) ? ' - taken' : ''}`);
    el.textContent = col;
    if (!taken.includes(id)) {
      el.addEventListener('click', () => toggleSeat(el, id, totalPassengers));
    }
    return el;
  }

  function toggleSeat(el, id, max) {
    if (el.classList.contains('taken')) return;

    if (el.classList.contains('selected')) {
      el.classList.remove('selected');
      el.classList.add('available');
      STATE.selectedSeats = STATE.selectedSeats.filter(s => s !== id);
    } else {
      if (STATE.selectedSeats.length >= max) {
        showToast(tOr('err.maxSeats', 'ניתן לבחור עד {n} מושב(ים) בלבד.').replace('{n}', max), 'warn');
        return;
      }
      el.classList.remove('available');
      el.classList.add('selected');
      STATE.selectedSeats.push(id);
    }
    saveState();
    updateSeatInfo();
  }

  // Restore previously selected seats
  STATE.selectedSeats.forEach(id => {
    const el = $(`.seat[data-seat="${id}"]`);
    if (el && !el.classList.contains('taken')) {
      el.classList.remove('available');
      el.classList.add('selected');
    }
  });

  function updateSeatInfo() {
    const infoEl = $('.selected-seats-info');
    if (!infoEl) return;
    if (STATE.selectedSeats.length === 0) {
      infoEl.innerHTML = `<span class="text-muted">${tOr('seats.noSeats', 'טרם נבחרו מושבים.')}</span>`;
    } else {
      const sel   = tOr('seats.seatsSelected', 'נבחרו');
      const ofLbl = tOr('seats.of',            'מתוך');
      const pass  = tOr('seats.passengers',    'נוסעים');
      infoEl.innerHTML = `<strong>${sel}:</strong> ${STATE.selectedSeats.join(', ')} &nbsp;|&nbsp; <strong>${STATE.selectedSeats.length}/${totalPassengers}</strong> ${pass}`;
    }
  }
  updateSeatInfo();

  const nextBtn = $('#next-btn');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (STATE.selectedSeats.length < totalPassengers) {
      showToast(tOr('err.needSeats', 'נא לבחור {n} מושב(ים) עבור כל הנוסעים.').replace('{n}', totalPassengers), 'error');
      return;
    }
    window.location.href = 'summary.html';
  });

  const backBtn = $('#back-btn');
  if (backBtn) backBtn.addEventListener('click', () => window.location.href = 'results.html');
}

// ── SUMMARY PAGE ───────────────────────────────
function initSummaryPage() {
  if (!$('.summary-page')) return;
  loadState();

  const totalPassengers = STATE.passengers.adults + STATE.passengers.teens + STATE.passengers.children || 1;
  const basePrice = STATE.selectedFlight ? (BASE_PRICES[STATE.selectedFlight] || 120) : 120;
  const perPax = Array.isArray(STATE.extrasPerPassenger) && STATE.extrasPerPassenger.length === totalPassengers
    ? STATE.extrasPerPassenger
    : Array.from({ length: totalPassengers }, () => ({ ...STATE.extras }));
  const extrasTotal = perPax.reduce((sum, pax) =>
    sum + Object.entries(pax).filter(([,v]) => v).reduce((s, [k]) => s + (EXTRA_PRICES[k] || 0), 0), 0);
  const total = basePrice * totalPassengers + extrasTotal;
  STATE.totalPrice = total;

  // Build extras summary label (e.g. "מזוודה ×2, עלייה מועדפת ×1")
  const extrasNames = {
    luggage:  tOr('results.extras.luggage.name',  'מזוודה'),
    priority: tOr('results.extras.priority.name', 'עלייה מועדפת'),
    drinks:   tOr('results.extras.drinks.name',   'משקאות')
  };
  const extrasSummary = Object.keys(EXTRA_PRICES).map(k => {
    const count = perPax.filter(p => p[k]).length;
    if (!count) return null;
    return count === totalPassengers ? extrasNames[k] : `${extrasNames[k]} ×${count}`;
  }).filter(Boolean).join(', ') || tOr('summary.none', 'ללא');

  // Populate summary display
  const sets = {
    '#sum-flight':    STATE.selectedFlight || 'VA101',
    '#sum-seats':     STATE.selectedSeats.join(', ') || '—',
    '#sum-passengers': totalPassengers,
    '#sum-extras':    extrasSummary,
    '#sum-base':      formatPrice(basePrice * totalPassengers),
    '#sum-extras-cost': formatPrice(extrasTotal),
    '#sum-total':     formatPrice(total)
  };
  Object.entries(sets).forEach(([sel, val]) => {
    const el = $(sel);
    if (el) el.textContent = val;
  });

  // Contact form
  const form = $('#contact-form');
  if (form) {
    const emailInput = $('#contact-email');
    const phoneInput = $('#contact-phone');

    if (emailInput) emailInput.value = STATE.contact.email || '';
    if (phoneInput) phoneInput.value = STATE.contact.phone || '';

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      if (!emailInput.value || !emailInput.checkValidity()) {
        showError(emailInput, tOr('err.noEmail', 'נא להזין כתובת דוא"ל תקינה.'), { focus: valid });
        valid = false;
      }
      if (!phoneInput.value) {
        showError(phoneInput, tOr('err.noPhone', 'נא להזין מספר טלפון.'), { focus: valid });
        valid = false;
      }

      if (!valid) return;

      STATE.contact.email = emailInput.value;
      STATE.contact.phone = phoneInput.value;
      saveState();
      window.location.href = 'payment.html';
    });
  }

  const backBtn = $('#back-btn');
  if (backBtn) backBtn.addEventListener('click', () => window.location.href = 'seats.html');
}

// ── PAYMENT PAGE ───────────────────────────────
function initPaymentPage() {
  if (!$('.payment-page')) return;
  loadState();

  const totalEl = $('#pay-total');
  if (totalEl) totalEl.textContent = formatPrice(STATE.totalPrice || 0);

  // Payment method selection
  $$('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      $$('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      STATE.paymentMethod = opt.dataset.method;
      saveState();

      // Show card form only for credit card
      const cardForm = $('.card-form');
      if (cardForm) cardForm.classList.toggle('visible', STATE.paymentMethod === 'card');

      // Update radio visuals
      $$('.payment-radio').forEach(r => r.style.removeProperty('border-color'));
      opt.querySelector('.payment-radio').style.borderColor = 'var(--color-primary)';
    });
  });

  // Restore selection
  const savedOpt = $(`.payment-option[data-method="${STATE.paymentMethod}"]`);
  if (savedOpt) savedOpt.click();

  // Pay button
  const payBtn = $('#pay-btn');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      if (STATE.paymentMethod === 'card') {
        const cardFields = [
          { el: $('#card-name'),   msg: tOr('err.noCardName',   'נא להזין שם בעל הכרטיס.') },
          { el: $('#card-number'), msg: tOr('err.noCardNumber', 'נא להזין מספר כרטיס.') },
          { el: $('#card-expiry'), msg: tOr('err.noCardExpiry', 'נא להזין תאריך תפוגה.') },
          { el: $('#card-cvv'),    msg: tOr('err.noCardCVV',    'נא להזין קוד CVV.') },
        ];
        const invalid = cardFields.filter(f => !f.el?.value?.trim());
        if (invalid.length) {
          invalid.forEach((f, i) => showError(f.el, f.msg, { focus: i === 0 }));
          return;
        }
      }

      // Generate booking reference
      STATE.bookingRef = generateRef();
      saveState();

      // Simulate processing
      payBtn.disabled = true;
      payBtn.textContent = 'Processing…';
      setTimeout(() => window.location.href = 'confirmation.html', 1500);
    });
  }

  const backBtn = $('#back-btn');
  if (backBtn) backBtn.addEventListener('click', () => window.location.href = 'summary.html');
}

// ── CONFIRMATION PAGE ──────────────────────────
function initConfirmationPage() {
  if (!$('.confirmation-page')) return;
  loadState();

  const ref = STATE.bookingRef || generateRef();
  STATE.bookingRef = ref;

  const sets = {
    '#conf-ref':        ref,
    '#conf-flight':     STATE.selectedFlight || 'VA101',
    '#conf-seats':      STATE.selectedSeats.join(', ') || '—',
    '#conf-passengers': (STATE.passengers.adults + STATE.passengers.teens + STATE.passengers.children) || 1,
    '#conf-email':      STATE.contact.email || '—',
    '#conf-total':      formatPrice(STATE.totalPrice || 0),
    '#conf-date':       STATE.departure || '—',
    '#conf-extras':     (() => {
      const tp = STATE.passengers.adults + STATE.passengers.teens + STATE.passengers.children || 1;
      const pp = Array.isArray(STATE.extrasPerPassenger) && STATE.extrasPerPassenger.length === tp
        ? STATE.extrasPerPassenger : Array.from({ length: tp }, () => ({ ...STATE.extras }));
      const names = {
        luggage:  tOr('results.extras.luggage.name',  'מזוודה'),
        priority: tOr('results.extras.priority.name', 'עלייה מועדפת'),
        drinks:   tOr('results.extras.drinks.name',   'משקאות')
      };
      return Object.keys(EXTRA_PRICES).map(k => {
        const c = pp.filter(p => p[k]).length;
        return c ? (c === tp ? names[k] : `${names[k]} ×${c}`) : null;
      }).filter(Boolean).join(', ') || tOr('summary.none', 'ללא');
    })()
  };
  Object.entries(sets).forEach(([sel, val]) => {
    const el = $(sel);
    if (el) el.textContent = val;
  });

  // Print
  const printBtn = $('#print-btn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  // Save as text
  const saveBtn = $('#save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const extrasMapTxt = {
        luggage:  tOr('results.extras.luggage.name',  'מזוודה'),
        priority: tOr('results.extras.priority.name', 'עלייה מועדפת'),
        drinks:   tOr('results.extras.drinks.name',   'משקאות')
      };
      const tp2 = STATE.passengers.adults + STATE.passengers.teens + STATE.passengers.children || 1;
      const pp2 = Array.isArray(STATE.extrasPerPassenger) && STATE.extrasPerPassenger.length === tp2
        ? STATE.extrasPerPassenger : Array.from({ length: tp2 }, () => ({ ...STATE.extras }));
      const activeExtrasTxt = Object.keys(extrasMapTxt).map(k => {
        const c = pp2.filter(p => p[k]).length;
        return c ? (c === tp2 ? extrasMapTxt[k] : `${extrasMapTxt[k]} ×${c}`) : null;
      }).filter(Boolean);
      const content = [
        tOr('conf.txt.title',  'VolAir Airlines — אישור הזמנה'),
        '═══════════════════════════════════════',
        `${tOr('conf.txt.ref',    'מספר הזמנה:')} ${ref}`,
        `${tOr('conf.txt.flight', 'טיסה:')}       ${STATE.selectedFlight || 'VA101'}`,
        `${tOr('conf.txt.date',   'תאריך:')}      ${STATE.departure || '—'}`,
        `${tOr('conf.txt.seats',  'מושבים:')}     ${STATE.selectedSeats.join(', ') || '—'}`,
        `${tOr('conf.txt.extras', 'תוספות:')}     ${activeExtrasTxt.join(', ') || tOr('summary.none', 'ללא')}`,
        `${tOr('conf.txt.email',  'דוא"ל:')}      ${STATE.contact.email || '—'}`,
        `${tOr('conf.txt.total',  'סה"כ שולם:')}  ${formatPrice(STATE.totalPrice || 0)}`,
        '',
        tOr('conf.txt.thanks', '!תודה שטסת עם VolAir Airlines')
      ].join('\n');

      const blob = new Blob([content], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = `VolAir-${ref}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // New booking
  const newBtn = $('#new-booking-btn');
  if (newBtn) newBtn.addEventListener('click', () => {
    sessionStorage.removeItem('volair_state');
    window.location.href = 'index.html';
  });
}

// ── Toast notifications ────────────────────────
function showToast(msg, type = 'info') {
  const existing = $('.volair-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'volair-toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    z-index: 9999; padding: 14px 24px; border-radius: 12px;
    font-family: var(--font-sans,sans-serif); font-size: 0.95rem; font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2); max-width: 90vw;
    background: ${{ info:'#0A1628', error:'#C62828', warn:'#E65100', success:'#2E7D32' }[type]};
    color: #fff; text-align: center;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function showError(input, msg, { focus = true } = {}) {
  if (!input) return;
  input.classList.add('is-invalid');
  input.classList.remove('shake');
  void input.offsetWidth;
  input.classList.add('shake');
  if (focus) input.focus();
  const errEl = input.closest('.form-group')?.querySelector('.form-error')
             || input.parentElement?.querySelector('.form-error');
  if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
  input.addEventListener('input', () => {
    input.classList.remove('is-invalid', 'shake');
    if (errEl) errEl.classList.remove('visible');
  }, { once: true });
}

// ── Init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAnimations();
  initFlightsPage();
  initResultsPage();
  initSeatsPage();
  initSummaryPage();
  initPaymentPage();
  initConfirmationPage();
  window.i18n?.applyLang(window._volairLang || 'he');
});
