/*
 * Mock booking system: agenda, booking window, cart, checkout and "My bookings".
 * Everything runs in the browser and is saved in localStorage. No payment is taken and
 * no request leaves the page. Prices, schedules and seats come from shop.js.
 */
(function () {
  'use strict';

  var SHOP = window.SHOP;
  var H = window.Bahia;

  var CART_KEY = 'bahia-cart';
  var COUPON_KEY = 'bahia-coupon';
  var ORDERS_KEY = 'bahia-orders';
  var GUEST_KEY = 'bahia-guest';
  var HORIZON_DAYS = 60;             // how far ahead guests can book
  var NOTICE_MS = 3 * 3600 * 1000;   // a time must start at least 3 hours from now
  var MAX_GUESTS = 12;               // per booking
  var COUNTRIES = ['us', 'br', 'ar', 'ca', 'mx', 'pt', 'es', 'other'];
  var LANGUAGES = [['en', 'English'], ['es', 'Español'], ['pt', 'Português']];

  var state = {
    cart: read(CART_KEY, []),
    coupon: read(COUPON_KEY, ''),
    orders: read(ORDERS_KEY, []),
    booking: null,        // the item being chosen in the booking window
    agendaDay: '',
    checkoutDone: null,   // the order just placed, shown on the confirmation screen
    checkoutError: '',
    payment: 'card',
    toastTimer: null,
  };

  /* ---------- storage ---------- */

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: keep working for this visit */ }
  }

  function saveCart() { write(CART_KEY, state.cart); }
  function saveCoupon() { write(COUPON_KEY, state.coupon); }
  function saveOrders() { write(ORDERS_KEY, state.orders); }

  /* ---------- dates and money ---------- */

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // The agency works on Bahia time (UTC-3, no daylight saving since 2019).
  function bahiaNow() {
    var u = new Date(Date.now() - 3 * 3600 * 1000);
    return new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate(), u.getUTCHours(), u.getUTCMinutes());
  }

  function today() {
    var n = bahiaNow();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  function fromKey(key) {
    var p = key.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }

  function atTime(day, time) {
    var p = time.split(':');
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), +p[0], +p[1]);
  }

  function locale() { return H.lang() === 'es' ? 'es-US' : 'en-US'; }

  function fmtDay(key) {
    return new Intl.DateTimeFormat(locale(), { weekday: 'short', month: 'short', day: 'numeric' }).format(fromKey(key));
  }

  function fmtTime(time) {
    var p = time.split(':');
    return new Intl.DateTimeFormat(locale(), { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, +p[0], +p[1]));
  }

  function fmtStamp(iso) {
    return new Intl.DateTimeFormat(locale(), { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
  }

  function fmtDuration(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    return m ? H.t('book.durationHm', { h: h, m: m }) : H.t('book.durationH', { h: h });
  }

  function money(n) { return '$' + n.toFixed(2); }

  function itemTitle(item) { return H.findTour(item.tourId)[H.lang()].title; }

  function guestsLabel(item) {
    return item.adults + ' ' + H.t('cart.adults').toLowerCase() +
      (item.children ? ' · ' + item.children + ' ' + H.t('cart.children').toLowerCase() : '');
  }

  /* ---------- availability ---------- */

  // Deterministic pseudo-random number in [0, 1), so a slot always shows the same demo occupancy.
  function hash01(text) {
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 10000) / 10000;
  }

  // Seats taken by other guests (demo data).
  function otherGuests(tourId, date, time, capacity) {
    return Math.floor(capacity * hash01(tourId + '|' + date + '|' + time) * 0.85);
  }

  // Seats taken by confirmed bookings made in this browser.
  function bookedSeats(tourId, date, time) {
    var seats = 0;
    state.orders.forEach(function (order) {
      if (order.status !== 'confirmed') return;
      order.items.forEach(function (item) {
        if (item.tourId === tourId && item.date === date && item.time === time) seats += item.adults + item.children;
      });
    });
    return seats;
  }

  // Seats held by items in the cart (guests have not paid yet, so they only block the slot for this browser).
  function cartSeats(tourId, date, time, exceptId) {
    return state.cart.reduce(function (sum, item) {
      var same = item.id !== exceptId && item.tourId === tourId && item.date === date && item.time === time;
      return sum + (same ? item.adults + item.children : 0);
    }, 0);
  }

  function seatsLeft(tourId, date, time) {
    var product = SHOP.products[tourId];
    var taken = otherGuests(tourId, date, time, product.capacity) + bookedSeats(tourId, date, time);
    return Math.max(0, product.capacity - taken);
  }

  function slotsFor(tourId, date) {
    var product = SHOP.products[tourId];
    if (!product) return [];
    var day = fromKey(date);
    if (product.days.indexOf(day.getDay()) === -1) return [];
    var now = bahiaNow();
    return product.times.map(function (time) {
      var past = atTime(day, time) - now < NOTICE_MS;
      var left = past ? 0 : seatsLeft(tourId, date, time);
      return { time: time, left: left, past: past, open: !past && left > 0 };
    });
  }

  function dayOpen(tourId, date) {
    return slotsFor(tourId, date).some(function (slot) { return slot.open; });
  }

  function withinHorizon(date) {
    var start = today();
    var d = fromKey(date);
    return d >= start && d <= addDays(start, HORIZON_DAYS);
  }

  function slotOpen(tourId, date, time) {
    return slotsFor(tourId, date).some(function (slot) { return slot.time === time && slot.open; });
  }

  // Guests this booking may still use at a slot: free seats minus what other cart items hold.
  function maxGuestsFor(tourId, date, time, exceptId) {
    var free = seatsLeft(tourId, date, time) - cartSeats(tourId, date, time, exceptId);
    return Math.max(0, Math.min(free, MAX_GUESTS));
  }

  /* ---------- prices ---------- */

  function guestPrice(tourId, kind) {
    var price = SHOP.products[tourId].prices[kind];
    return price === null ? 0 : price;
  }

  function addonKeys(item) {
    return Object.keys(SHOP.addons).filter(function (key) { return item.addons && item.addons[key]; });
  }

  function addonsTotal(addons) {
    return Object.keys(SHOP.addons).reduce(function (sum, key) {
      return sum + (addons[key] ? SHOP.addons[key].price : 0);
    }, 0);
  }

  function itemTotal(item) {
    return item.adults * guestPrice(item.tourId, 'adult') +
      item.children * guestPrice(item.tourId, 'child') +
      addonsTotal(item.addons || {});
  }

  function couponInfo(code) {
    return code ? SHOP.coupons[code.toUpperCase()] || null : null;
  }

  function couponDiscount(code, subtotal) {
    var c = couponInfo(code);
    if (!c) return 0;
    if (c.minSubtotal && subtotal < c.minSubtotal) return 0;
    if (c.type === 'percent') return Math.round(subtotal * c.value) / 100;
    return Math.min(c.value, subtotal);
  }

  function totalsFor(items, code) {
    var subtotal = items.reduce(function (sum, item) { return sum + itemTotal(item); }, 0);
    var discount = couponDiscount(code, subtotal);
    var fee = Math.round((subtotal - discount) * SHOP.serviceFeeRate * 100) / 100;
    return {
      subtotal: subtotal,
      discount: discount,
      fee: fee,
      total: Math.round((subtotal - discount + fee) * 100) / 100,
    };
  }

  function totalsHtml(totals) {
    var rows = '<div class="totals-row"><span>' + H.esc(H.t('totals.subtotal')) + '</span><span>' + money(totals.subtotal) + '</span></div>';
    if (totals.discount > 0) {
      rows += '<div class="totals-row is-discount"><span>' + H.esc(H.t('totals.discount')) + '</span><span>−' + money(totals.discount) + '</span></div>';
    }
    rows += '<div class="totals-row"><span>' + H.esc(H.t('totals.fee')) + '</span><span>' + money(totals.fee) + '</span></div>';
    rows += '<div class="totals-row is-total"><span>' + H.esc(H.t('totals.total')) + '</span><span>' + money(totals.total) + '</span></div>';
    return '<div class="totals">' + rows + '</div>';
  }

  /* ---------- small helpers ---------- */

  function closeDialog(id) {
    var dlg = document.getElementById(id);
    if (dlg && dlg.open) dlg.close();
  }

  function toast(message) {
    var el = document.getElementById('toast');
    el.textContent = message;
    el.hidden = false;
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () { el.hidden = true; }, 2800);
  }

  function uid() { return Math.random().toString(36).slice(2, 10); }

  function makeCode() {
    var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = 'BE-';
    for (var i = 0; i < 6; i++) code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return code;
  }

  function updateCartCount() {
    ['cart-count', 'cart-count-mobile'].forEach(function (id) {
      var el = document.getElementById(id);
      el.textContent = String(state.cart.length);
      el.hidden = state.cart.length === 0;
    });
  }

  /* ---------- booking window ---------- */

  function openBooking(tourId, preset) {
    if (!H.findTour(tourId)) return;
    closeDialog('experience-dialog');

    var start = preset && preset.date ? fromKey(preset.date) : today();
    state.booking = {
      tourId: tourId,
      date: '',
      time: '',
      adults: 2,
      children: 0,
      addons: { transfer: false, photo: false },
      month: new Date(start.getFullYear(), start.getMonth(), 1),
    };

    var b = state.booking;
    if (preset && preset.date && withinHorizon(preset.date) && dayOpen(tourId, preset.date)) {
      b.date = preset.date;
      if (preset.time && slotOpen(tourId, preset.date, preset.time)) b.time = preset.time;
    }
    applyGuestLimits();

    renderBooking();
    var dlg = document.getElementById('booking-dialog');
    if (!dlg.open) dlg.showModal();
  }

  // Keeps adults and children within the seats that are free for the chosen time.
  function applyGuestLimits() {
    var b = state.booking;
    if (!b || !b.time) return;
    var max = maxGuestsFor(b.tourId, b.date, b.time, null);
    var childOk = SHOP.products[b.tourId].prices.child !== null;
    b.adults = Math.min(Math.max(b.adults, 1), max);
    b.children = childOk ? Math.max(0, Math.min(b.children, max - b.adults)) : 0;
  }

  function changeGuest(target, kind, delta) {
    if (kind === 'children' && SHOP.products[target.tourId].prices.child === null) return;
    var max = maxGuestsFor(target.tourId, target.date, target.time, null);
    var total = target.adults + target.children;
    var minimum = kind === 'adults' ? 1 : 0;
    var next = target[kind] + delta;
    if (next < minimum) return;
    if (delta > 0 && total >= max) return;
    target[kind] = next;
  }

  function shiftMonth(delta) {
    var b = state.booking;
    b.month = new Date(b.month.getFullYear(), b.month.getMonth() + delta, 1);
    renderBooking();
  }

  function calendarHtml(b) {
    var year = b.month.getFullYear();
    var m = b.month.getMonth();
    var first = new Date(year, m, 1);
    var lastDay = new Date(year, m + 1, 0).getDate();
    var now = today();
    var lastAllowed = addDays(now, HORIZON_DAYS);
    var canPrev = first > new Date(now.getFullYear(), now.getMonth(), 1);
    var canNext = new Date(year, m + 1, 1) <= lastAllowed;
    var label = new Intl.DateTimeFormat(locale(), { month: 'long', year: 'numeric' }).format(first);

    var week = '';
    for (var w = 0; w < 7; w++) {
      week += '<span>' + H.esc(new Intl.DateTimeFormat(locale(), { weekday: 'short' }).format(new Date(2024, 0, 7 + w))) + '</span>';
    }

    var cells = '';
    for (var blank = 0; blank < first.getDay(); blank++) cells += '<span class="cal-blank"></span>';
    for (var d = 1; d <= lastDay; d++) {
      var key = dateKey(new Date(year, m, d));
      var open = withinHorizon(key) && dayOpen(b.tourId, key);
      var selected = b.date === key;
      cells += '<button type="button" class="cal-day ' + (open ? 'is-open' : 'is-closed') + (selected ? ' is-selected' : '') +
        '" data-cal-day="' + key + '" aria-pressed="' + selected + '"' + (open ? '' : ' disabled') + '>' + d + '</button>';
    }

    return '<div class="cal">' +
      '<div class="cal-head">' +
        '<button type="button" class="cal-nav" data-cal-nav="-1" aria-label="' + H.esc(H.t('cal.prev')) + '"' + (canPrev ? '' : ' disabled') + '>‹</button>' +
        '<strong>' + H.esc(label) + '</strong>' +
        '<button type="button" class="cal-nav" data-cal-nav="1" aria-label="' + H.esc(H.t('cal.next')) + '"' + (canNext ? '' : ' disabled') + '>›</button>' +
      '</div>' +
      '<div class="cal-week">' + week + '</div>' +
      '<div class="cal-grid">' + cells + '</div>' +
    '</div>';
  }

  function timesHtml(b) {
    if (!b.date) return '<p class="muted">' + H.esc(H.t('book.pickDate')) + '</p>';
    var slots = slotsFor(b.tourId, b.date);
    if (!slots.length) return '<p class="muted">' + H.esc(H.t('book.noTimes')) + '</p>';
    return '<div class="slot-grid">' + slots.map(function (slot) {
      var label = slot.past ? H.t('book.notAvailable') : (slot.left > 0 ? H.t('book.seatsLeft', { n: slot.left }) : H.t('book.soldOut'));
      return '<button type="button" class="slot-btn' + (b.time === slot.time ? ' is-selected' : '') +
        '" data-slot="' + slot.time + '" aria-pressed="' + (b.time === slot.time) + '"' + (slot.open ? '' : ' disabled') + '>' +
        '<span class="slot-time">' + H.esc(fmtTime(slot.time)) + '</span>' +
        '<span class="slot-left">' + H.esc(label) + '</span></button>';
    }).join('') + '</div>';
  }

  function stepper(kind, value, canMinus, canPlus) {
    return '<div class="stepper">' +
      '<button type="button" data-guest="' + kind + '" data-delta="-1"' + (canMinus ? '' : ' disabled') + '>−</button>' +
      '<output>' + value + '</output>' +
      '<button type="button" data-guest="' + kind + '" data-delta="1"' + (canPlus ? '' : ' disabled') + '>+</button>' +
    '</div>';
  }

  function addonInputs(addons) {
    return Object.keys(SHOP.addons).map(function (key) {
      var addon = SHOP.addons[key];
      return '<label class="check-row"><input type="checkbox" data-addon="' + key + '"' + (addons[key] ? ' checked' : '') + ' />' +
        '<span>' + H.esc(H.t(addon.label)) + '</span><span class="addon-price">+' + money(addon.price) + '</span></label>';
    }).join('');
  }

  function guestsHtml(b) {
    if (!b.time) {
      return '<section class="booking-section"><h3>' + H.esc(H.t('book.step3')) + '</h3>' +
        '<p class="muted">' + H.esc(H.t('book.pickTime')) + '</p></section>';
    }
    var product = SHOP.products[b.tourId];
    var max = maxGuestsFor(b.tourId, b.date, b.time, null);
    var canAdd = max >= 1;
    var total = b.adults * guestPrice(b.tourId, 'adult') + b.children * guestPrice(b.tourId, 'child') + addonsTotal(b.addons);
    var childRow = product.prices.child !== null
      ? '<div class="stepper-row"><div><strong>' + H.esc(H.t('book.children')) + '</strong><span class="muted small">' + H.esc(H.t('book.childrenHint')) + '</span></div>' +
        stepper('children', b.children, b.children > 0, b.adults + b.children < max) + '</div>'
      : '<p class="muted small">' + H.esc(H.t('book.adultsOnly')) + '</p>';

    return '<section class="booking-section"><h3>' + H.esc(H.t('book.step3')) + '</h3>' +
      '<div class="stepper-row"><div><strong>' + H.esc(H.t('book.adults')) + '</strong><span class="muted small">' + H.esc(H.t('book.adultsHint')) + '</span></div>' +
        stepper('adults', b.adults, b.adults > 1, b.adults + b.children < max) + '</div>' +
      childRow +
      '<p class="muted small">' + H.esc(H.t('book.maxGuests', { n: max })) + '</p>' +
      '<fieldset class="addon-list"><legend>' + H.esc(H.t('book.extras')) + '</legend>' + addonInputs(b.addons) + '</fieldset>' +
      '<div class="booking-foot">' +
        '<div><span class="muted small">' + H.esc(H.t('book.estimate')) + '</span><strong class="booking-total">' + money(total) + '</strong></div>' +
        '<button type="button" class="btn btn-primary" id="booking-add"' + (canAdd ? '' : ' disabled') + '>' + H.esc(H.t('book.addToCart')) + '</button>' +
      '</div></section>';
  }

  function renderBooking() {
    var b = state.booking;
    if (!b) return;
    var tour = H.findTour(b.tourId);
    var copy = tour[H.lang()];
    var product = SHOP.products[b.tourId];
    document.getElementById('booking-body').innerHTML =
      '<p class="tour-kicker">' + H.esc(copy.category) + '</p>' +
      '<h2 id="booking-title">' + H.esc(copy.title) + '</h2>' +
      '<p class="booking-meta">' + H.esc(H.t('book.durationLabel')) + ': ' + H.esc(fmtDuration(product.durationMinutes)) +
        ' · ' + H.esc(H.t('price.from', { price: H.minPrice(b.tourId) })) + '</p>' +
      '<p class="demo-note">' + H.esc(H.t('book.demoPrices')) + '</p>' +
      '<section class="booking-section"><h3>' + H.esc(H.t('book.step1')) + '</h3>' + calendarHtml(b) + '</section>' +
      '<section class="booking-section"><h3>' + H.esc(H.t('book.step2')) + '</h3>' + timesHtml(b) + '</section>' +
      guestsHtml(b);
  }

  function addBookingToCart() {
    var b = state.booking;
    if (!b || !b.time) return;
    if (maxGuestsFor(b.tourId, b.date, b.time, null) < b.adults + b.children) return;
    state.cart.push({
      id: uid(),
      tourId: b.tourId,
      date: b.date,
      time: b.time,
      adults: b.adults,
      children: b.children,
      addons: { transfer: b.addons.transfer, photo: b.addons.photo },
    });
    saveCart();
    updateCartCount();
    closeDialog('booking-dialog');
    toast(H.t('book.added'));
    openCart();
  }

  /* ---------- cart ---------- */

  function openCart() {
    renderCart();
    var dlg = document.getElementById('cart-dialog');
    if (!dlg.open) dlg.showModal();
  }

  function cartStepper(id, kind, value, canMinus, canPlus) {
    return '<span class="stepper">' +
      '<button type="button" data-cart-guest="' + kind + '" data-id="' + id + '" data-delta="-1"' + (canMinus ? '' : ' disabled') + '>−</button>' +
      '<output>' + value + '</output>' +
      '<button type="button" data-cart-guest="' + kind + '" data-id="' + id + '" data-delta="1"' + (canPlus ? '' : ' disabled') + '>+</button>' +
    '</span>';
  }

  function cartItemHtml(item) {
    var max = maxGuestsFor(item.tourId, item.date, item.time, item.id);
    var childOk = SHOP.products[item.tourId].prices.child !== null;
    var full = item.adults + item.children >= max;
    var addons = addonKeys(item).map(function (key) { return H.t(SHOP.addons[key].label); });
    return '<li class="cart-item">' +
      '<div class="cart-item-main">' +
        '<p class="cart-item-title">' + H.esc(itemTitle(item)) + '</p>' +
        '<p class="cart-item-meta">' + H.esc(fmtDay(item.date)) + ' · ' + H.esc(fmtTime(item.time)) + '</p>' +
        '<div class="cart-guests">' +
          '<span>' + H.esc(H.t('cart.adults')) + '</span>' + cartStepper(item.id, 'adults', item.adults, item.adults > 1, !full) +
          (childOk ? '<span>' + H.esc(H.t('cart.children')) + '</span>' + cartStepper(item.id, 'children', item.children, item.children > 0, !full) : '') +
        '</div>' +
        (addons.length ? '<p class="cart-item-meta">+ ' + H.esc(addons.join(' · ')) + '</p>' : '') +
      '</div>' +
      '<div class="cart-item-side">' +
        '<p class="cart-item-total">' + money(itemTotal(item)) + '</p>' +
        '<button type="button" class="link-btn small" data-remove="' + item.id + '">' + H.esc(H.t('cart.remove')) + '</button>' +
      '</div>' +
    '</li>';
  }

  function couponHtml() {
    var code = state.coupon;
    var info = couponInfo(code);
    var message = '';
    if (code) {
      var subtotal = state.cart.reduce(function (sum, item) { return sum + itemTotal(item); }, 0);
      if (!info) message = H.t('cart.couponInvalid');
      else if (info.minSubtotal && subtotal < info.minSubtotal) message = H.t('cart.couponMin', { min: info.minSubtotal });
      else message = H.t('cart.couponOk', { label: H.t(info.label) });
    }
    return '<form class="coupon" id="coupon-form">' +
      '<label for="coupon-input">' + H.esc(H.t('cart.couponLabel')) + '</label>' +
      '<div class="coupon-row"><input id="coupon-input" name="coupon" value="' + H.esc(code) + '" autocomplete="off" />' +
        '<button type="submit" class="btn btn-ghost btn-sm">' + H.esc(H.t('cart.apply')) + '</button></div>' +
      (code ? '<p class="coupon-msg">' + H.esc(message) + ' <button type="button" class="link-btn small" id="coupon-remove">' + H.esc(H.t('cart.couponRemove')) + '</button></p>' : '') +
      '<p class="hint">' + H.esc(H.t('cart.couponHint')) + '</p>' +
    '</form>';
  }

  function renderCart() {
    var items = state.cart;
    var html = '<h2 id="cart-title">' + H.esc(H.t('cart.title')) + '</h2>';
    if (!items.length) {
      html += '<p class="empty">' + H.esc(H.t('cart.empty')) + '</p>';
    } else {
      html += '<ul class="cart-list">' + items.map(cartItemHtml).join('') + '</ul>';
      html += couponHtml();
      html += totalsHtml(totalsFor(items, state.coupon));
    }
    html += '<div class="drawer-actions">' +
      '<button type="button" class="btn btn-primary" id="cart-checkout"' + (items.length ? '' : ' disabled') + '>' + H.esc(H.t('cart.checkout')) + '</button>' +
      '<button type="button" class="btn btn-ghost" id="cart-orders">' + H.esc(H.t('cart.bookings')) + '</button>' +
    '</div>';
    document.getElementById('cart-body').innerHTML = html;
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter(function (item) { return item.id !== id; });
    saveCart();
    updateCartCount();
    renderCart();
  }

  function changeCartGuest(id, kind, delta) {
    var item = state.cart.filter(function (i) { return i.id === id; })[0];
    if (!item) return;
    if (kind === 'children' && SHOP.products[item.tourId].prices.child === null) return;
    var max = maxGuestsFor(item.tourId, item.date, item.time, item.id);
    var total = item.adults + item.children;
    var minimum = kind === 'adults' ? 1 : 0;
    var next = item[kind] + delta;
    if (next < minimum) return;
    if (delta > 0 && total >= max) return;
    item[kind] = next;
    saveCart();
    renderCart();
  }

  function applyCoupon(raw) {
    state.coupon = String(raw || '').trim().toUpperCase();
    saveCoupon();
    renderCart();
  }

  /* ---------- checkout ---------- */

  // Slots whose seats are no longer free (or that have already started) since the item was added.
  function stockProblems() {
    var need = {};
    state.cart.forEach(function (item) {
      var key = item.tourId + '|' + item.date + '|' + item.time;
      need[key] = (need[key] || 0) + item.adults + item.children;
    });
    return Object.keys(need).filter(function (key) {
      var p = key.split('|');
      return !slotOpen(p[0], p[1], p[2]) || need[key] > seatsLeft(p[0], p[1], p[2]);
    });
  }

  function field(name, label, type, value, autocomplete) {
    return '<label class="field"><span>' + H.esc(label) + '</span>' +
      '<input name="' + name + '" type="' + type + '" value="' + H.esc(value || '') + '" autocomplete="' + autocomplete + '" /></label>';
  }

  function payOption(value, label) {
    return '<label class="pay-option"><input type="radio" name="payment" value="' + value + '"' +
      (state.payment === value ? ' checked' : '') + ' /><span>' + H.esc(label) + '</span></label>';
  }

  function checkoutFormHtml() {
    var guest = read(GUEST_KEY, {});
    var countries = COUNTRIES.map(function (code) {
      return '<option value="' + code + '"' + (guest.country === code ? ' selected' : '') + '>' + H.esc(H.t('country.' + code)) + '</option>';
    }).join('');
    var languages = LANGUAGES.map(function (lang) {
      return '<option value="' + lang[0] + '"' + ((guest.language || H.lang()) === lang[0] ? ' selected' : '') + '>' + H.esc(lang[1]) + '</option>';
    }).join('');
    return '<form class="checkout-form" id="checkout-form" novalidate>' +
      '<h3>' + H.esc(H.t('checkout.details')) + '</h3>' +
      '<div class="form-grid">' +
        field('name', H.t('checkout.name'), 'text', guest.name, 'name') +
        field('email', H.t('checkout.email'), 'email', guest.email, 'email') +
        field('phone', H.t('checkout.phone'), 'tel', guest.phone, 'tel') +
        '<label class="field"><span>' + H.esc(H.t('checkout.country')) + '</span><select name="country">' + countries + '</select></label>' +
        '<label class="field"><span>' + H.esc(H.t('checkout.language')) + '</span><select name="language">' + languages + '</select></label>' +
      '</div>' +
      '<label class="field"><span>' + H.esc(H.t('checkout.notes')) + '</span><textarea name="notes" rows="3">' + H.esc(guest.notes || '') + '</textarea></label>' +
      '<h3>' + H.esc(H.t('checkout.payment')) + '</h3>' +
      '<fieldset class="pay-options"><legend class="sr-only">' + H.esc(H.t('checkout.payment')) + '</legend>' +
        payOption('card', H.t('checkout.payCard')) + payOption('pix', H.t('checkout.payPix')) +
      '</fieldset>' +
      '<p class="demo-note">' + H.esc(H.t('checkout.payNote')) + '</p>' +
      '<p class="form-error" id="checkout-error" role="alert">' + H.esc(state.checkoutError) + '</p>' +
      '<button type="submit" class="btn btn-primary btn-block">' + H.esc(H.t('checkout.confirm')) + '</button>' +
    '</form>';
  }

  function cartSummaryHtml() {
    return '<div class="summary-card"><h3>' + H.esc(H.t('checkout.summary')) + '</h3>' +
      '<ul class="summary-items">' + state.cart.map(function (item) {
        return '<li><span>' + H.esc(itemTitle(item)) +
          '<small>' + H.esc(fmtDay(item.date)) + ' · ' + H.esc(fmtTime(item.time)) + ' · ' + H.esc(guestsLabel(item)) + '</small></span>' +
          '<strong>' + money(itemTotal(item)) + '</strong></li>';
      }).join('') + '</ul>' +
      totalsHtml(totalsFor(state.cart, state.coupon)) + '</div>';
  }

  function confirmationHtml(order) {
    return '<div class="confirm-card">' +
      '<p class="tour-kicker">' + H.esc(H.t('orders.confirmed')) + '</p>' +
      '<h3>' + H.esc(H.t('checkout.done')) + '</h3>' +
      '<p class="code-label">' + H.esc(H.t('checkout.code')) + '</p>' +
      '<p class="code">' + H.esc(order.code) + '</p>' +
      '<ul class="summary-items">' + order.items.map(function (item) {
        return '<li><span>' + H.esc(itemTitle(item)) +
          '<small>' + H.esc(fmtDay(item.date)) + ' · ' + H.esc(fmtTime(item.time)) + ' · ' + H.esc(guestsLabel(item)) + '</small></span>' +
          '<strong>' + money(item.total) + '</strong></li>';
      }).join('') + '</ul>' +
      '<p class="demo-note">' + H.esc(H.t('checkout.emailTo', { email: order.guest.email })) + '</p>' +
      '<div class="confirm-actions">' +
        '<button type="button" class="btn btn-primary" data-ics>' + H.esc(H.t('checkout.ics')) + '</button>' +
        '<button type="button" class="btn btn-ghost" data-open-orders>' + H.esc(H.t('checkout.viewBookings')) + '</button>' +
        '<a class="btn btn-ghost" href="#tours">' + H.esc(H.t('checkout.backToTours')) + '</a>' +
      '</div>' +
    '</div>';
  }

  function renderCheckout() {
    var main = document.getElementById('checkout-main');
    var side = document.getElementById('checkout-summary');
    if (state.checkoutDone) {
      main.innerHTML = confirmationHtml(state.checkoutDone);
      side.innerHTML = '<div class="summary-card"><h3>' + H.esc(H.t('checkout.summary')) + '</h3>' +
        totalsHtml(state.checkoutDone) + '</div>';
      return;
    }
    if (!state.cart.length) {
      main.innerHTML = '<div class="empty-state"><h3>' + H.esc(H.t('checkout.emptyTitle')) + '</h3>' +
        '<p>' + H.esc(H.t('checkout.emptyText')) + '</p>' +
        '<a class="btn btn-primary" href="#agenda">' + H.esc(H.t('checkout.browse')) + '</a></div>';
      side.innerHTML = '';
      return;
    }
    main.innerHTML = checkoutFormHtml();
    side.innerHTML = cartSummaryHtml();
  }

  function placeOrder(data) {
    var guest = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      country: String(data.get('country') || 'other'),
      language: String(data.get('language') || 'en'),
      notes: String(data.get('notes') || '').trim(),
    };

    var error = '';
    if (guest.name.length < 2) error = H.t('checkout.errName');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) error = H.t('checkout.errEmail');
    else if (stockProblems().length) error = H.t('checkout.errStock');
    if (error) {
      // Keep what the guest typed: only the message changes.
      document.getElementById('checkout-error').textContent = error;
      return;
    }

    write(GUEST_KEY, guest);
    var totals = totalsFor(state.cart, state.coupon);
    var order = {
      code: makeCode(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      guest: guest,
      payment: String(data.get('payment') || 'card'),
      items: state.cart.map(function (item) {
        return {
          id: item.id,
          tourId: item.tourId,
          date: item.date,
          time: item.time,
          adults: item.adults,
          children: item.children,
          addons: { transfer: !!item.addons.transfer, photo: !!item.addons.photo },
          total: itemTotal(item),
        };
      }),
      coupon: couponInfo(state.coupon) ? state.coupon.toUpperCase() : '',
      subtotal: totals.subtotal,
      discount: totals.discount,
      fee: totals.fee,
      total: totals.total,
    };

    state.orders.unshift(order);
    saveOrders();
    state.cart = [];
    state.coupon = '';
    saveCart();
    saveCoupon();
    updateCartCount();
    state.checkoutDone = order;
    state.checkoutError = '';
    renderCheckout();
    renderAgenda();
  }

  function route() {
    var inCheckout = window.location.hash === '#checkout';
    document.body.classList.toggle('view-checkout', inCheckout);
    if (inCheckout) {
      renderCheckout();
      window.scrollTo({ top: 0 });
    } else {
      state.checkoutDone = null;
      state.checkoutError = '';
    }
  }

  /* ---------- my bookings ---------- */

  function openOrders() {
    closeDialog('cart-dialog');
    renderOrders();
    var dlg = document.getElementById('orders-dialog');
    if (!dlg.open) dlg.showModal();
  }

  function orderCardHtml(order) {
    var cancelled = order.status === 'cancelled';
    return '<article class="order-card' + (cancelled ? ' is-cancelled' : '') + '">' +
      '<div class="order-head"><div>' +
        '<p class="tour-kicker">' + H.esc(H.t('orders.placed', { date: fmtStamp(order.createdAt) })) + '</p>' +
        '<h3>' + H.esc(order.code) + '</h3></div>' +
        '<span class="status ' + (cancelled ? 'is-cancelled' : 'is-confirmed') + '">' +
          H.esc(H.t(cancelled ? 'orders.cancelled' : 'orders.confirmed')) + '</span></div>' +
      '<ul class="order-items">' + order.items.map(function (item) {
        return '<li><span>' + H.esc(itemTitle(item)) + ' — ' + H.esc(fmtDay(item.date)) + ' · ' + H.esc(fmtTime(item.time)) +
          '</span><span>' + H.esc(guestsLabel(item)) + '</span></li>';
      }).join('') + '</ul>' +
      '<div class="order-foot"><strong>' + H.esc(H.t('orders.total')) + ': ' + money(order.total) + '</strong>' +
        '<div class="order-actions">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-order-ics="' + H.esc(order.code) + '">' + H.esc(H.t('orders.ics')) + '</button>' +
          (cancelled ? '' : '<button type="button" class="btn btn-ghost btn-sm" data-order-cancel="' + H.esc(order.code) + '">' + H.esc(H.t('orders.cancel')) + '</button>') +
        '</div></div>' +
    '</article>';
  }

  function renderOrders() {
    var html = '<h2 id="orders-title">' + H.esc(H.t('orders.title')) + '</h2>';
    html += state.orders.length
      ? state.orders.map(orderCardHtml).join('')
      : '<p class="empty">' + H.esc(H.t('orders.empty')) + '</p>';
    document.getElementById('orders-body').innerHTML = html;
  }

  function cancelOrder(code) {
    state.orders.forEach(function (order) {
      if (order.code === code) order.status = 'cancelled';
    });
    saveOrders();
    renderOrders();
    renderAgenda();
    if (document.getElementById('booking-dialog').open) renderBooking();
    toast(H.t('orders.cancelledMsg', { code: code }));
  }

  /* ---------- calendar file (.ics) ---------- */

  // Bahia wall-clock time converted to UTC, so the file works in any calendar app.
  function icsStamp(date, time, addMinutes) {
    var p = time.split(':');
    var d = fromKey(date);
    var ms = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), +p[0] + 3, +p[1]) + (addMinutes || 0) * 60000;
    var u = new Date(ms);
    return u.getUTCFullYear() + pad(u.getUTCMonth() + 1) + pad(u.getUTCDate()) + 'T' +
      pad(u.getUTCHours()) + pad(u.getUTCMinutes()) + '00Z';
  }

  function escIcs(text) {
    return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function buildIcs(order) {
    var stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bahia Experiences//Demo booking//EN', 'CALSCALE:GREGORIAN'];
    order.items.forEach(function (item, index) {
      lines.push(
        'BEGIN:VEVENT',
        'UID:' + order.code + '-' + (index + 1) + '@bahia-experiences.demo',
        'DTSTAMP:' + stamp,
        'DTSTART:' + icsStamp(item.date, item.time, 0),
        'DTEND:' + icsStamp(item.date, item.time, SHOP.products[item.tourId].durationMinutes),
        'SUMMARY:' + escIcs(itemTitle(item)),
        'LOCATION:' + escIcs('Porto Seguro, Bahia, Brazil'),
        'DESCRIPTION:' + escIcs('Booking ' + order.code + ' (demo). ' + guestsLabel(item)),
        'END:VEVENT'
      );
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function downloadIcs(order) {
    var blob = new Blob([buildIcs(order)], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'bahia-' + order.code.toLowerCase() + '.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ---------- agenda ---------- */

  function agendaRowHtml(tourId, date) {
    var copy = H.findTour(tourId)[H.lang()];
    return '<article class="agenda-row">' +
      '<div class="agenda-row-head"><div>' +
        '<p class="tour-kicker">' + H.esc(copy.category) + '</p>' +
        '<h3>' + H.esc(copy.title) + '</h3></div>' +
        '<p class="agenda-from">' + H.esc(H.t('price.from', { price: H.minPrice(tourId) })) +
          ' · ' + H.esc(fmtDuration(SHOP.products[tourId].durationMinutes)) + '</p></div>' +
      '<div class="agenda-slots">' + slotsFor(tourId, date).map(function (slot) {
        var label = slot.past ? H.t('book.notAvailable') : (slot.left > 0 ? H.t('book.seatsLeft', { n: slot.left }) : H.t('book.soldOut'));
        return '<button type="button" class="agenda-slot" data-agenda-tour="' + tourId + '" data-agenda-date="' + date +
          '" data-agenda-time="' + slot.time + '"' + (slot.open ? '' : ' disabled') + '>' +
          '<strong>' + H.esc(fmtTime(slot.time)) + '</strong><span>' + H.esc(label) + '</span></button>';
      }).join('') + '</div>' +
    '</article>';
  }

  function renderAgenda() {
    var base = today();
    var days = [];
    for (var i = 0; i < 7; i++) days.push(dateKey(addDays(base, i)));
    // First visit, or the selected day has passed: start on the first day that still has a time open.
    if (days.indexOf(state.agendaDay) === -1) {
      state.agendaDay = days.filter(function (key) {
        return Object.keys(SHOP.products).some(function (id) { return dayOpen(id, key); });
      })[0] || days[0];
    }

    document.getElementById('agenda-days').innerHTML = days.map(function (key) {
      var d = fromKey(key);
      var selected = key === state.agendaDay;
      return '<button type="button" class="agenda-day' + (selected ? ' is-selected' : '') +
        '" data-agenda-day="' + key + '" aria-pressed="' + selected + '">' +
        '<span>' + H.esc(new Intl.DateTimeFormat(locale(), { weekday: 'short' }).format(d)) + '</span>' +
        '<strong>' + d.getDate() + '</strong>' +
        '<small>' + H.esc(new Intl.DateTimeFormat(locale(), { month: 'short' }).format(d)) + '</small></button>';
    }).join('');

    var day = fromKey(state.agendaDay);
    var tourIds = Object.keys(SHOP.products).filter(function (id) {
      return SHOP.products[id].days.indexOf(day.getDay()) !== -1;
    });
    document.getElementById('agenda-list').innerHTML = tourIds.length
      ? tourIds.map(function (id) { return agendaRowHtml(id, state.agendaDay); }).join('')
      : '<p class="empty">' + H.esc(H.t('agenda.none')) + '</p>';
  }

  /* ---------- events ---------- */

  // Buttons that open the booking window, the cart and the agenda days.
  document.addEventListener('click', function (event) {
    var target = event.target;
    var book = target.closest('[data-book]');
    var slot = target.closest('[data-agenda-tour]');
    var day = target.closest('[data-agenda-day]');
    if (book && book.getAttribute('data-book')) {
      openBooking(book.getAttribute('data-book'));
    } else if (slot) {
      openBooking(slot.getAttribute('data-agenda-tour'), {
        date: slot.getAttribute('data-agenda-date'),
        time: slot.getAttribute('data-agenda-time'),
      });
    } else if (day) {
      state.agendaDay = day.getAttribute('data-agenda-day');
      renderAgenda();
    } else if (target.closest('[data-cart-open]')) {
      openCart();
    }
  });

  document.getElementById('booking-body').addEventListener('click', function (event) {
    var b = state.booking;
    if (!b) return;
    var nav = event.target.closest('[data-cal-nav]');
    var day = event.target.closest('[data-cal-day]');
    var slot = event.target.closest('[data-slot]');
    var guest = event.target.closest('[data-guest]');
    var add = event.target.closest('#booking-add');
    if (nav) {
      shiftMonth(+nav.getAttribute('data-cal-nav'));
    } else if (day) {
      b.date = day.getAttribute('data-cal-day');
      b.time = '';
      renderBooking();
    } else if (slot) {
      b.time = slot.getAttribute('data-slot');
      applyGuestLimits();
      renderBooking();
    } else if (guest) {
      changeGuest(b, guest.getAttribute('data-guest'), +guest.getAttribute('data-delta'));
      renderBooking();
    } else if (add) {
      addBookingToCart();
    }
  });

  document.getElementById('booking-body').addEventListener('change', function (event) {
    var b = state.booking;
    var box = event.target.closest('[data-addon]');
    if (!b || !box) return;
    b.addons[box.getAttribute('data-addon')] = box.checked;
    renderBooking();
  });

  document.getElementById('cart-body').addEventListener('click', function (event) {
    var target = event.target;
    var remove = target.closest('[data-remove]');
    var guest = target.closest('[data-cart-guest]');
    var checkout = target.closest('#cart-checkout');
    var orders = target.closest('#cart-orders');
    var removeCoupon = target.closest('#coupon-remove');
    if (remove) {
      removeFromCart(remove.getAttribute('data-remove'));
    } else if (guest) {
      changeCartGuest(guest.getAttribute('data-id'), guest.getAttribute('data-cart-guest'), +guest.getAttribute('data-delta'));
    } else if (checkout && !checkout.disabled) {
      closeDialog('cart-dialog');
      window.location.hash = '#checkout';
    } else if (orders) {
      openOrders();
    } else if (removeCoupon) {
      applyCoupon('');
    }
  });

  document.getElementById('cart-body').addEventListener('submit', function (event) {
    if (event.target.id !== 'coupon-form') return;
    event.preventDefault();
    applyCoupon(event.target.elements.coupon.value);
  });

  document.getElementById('checkout-main').addEventListener('submit', function (event) {
    if (event.target.id !== 'checkout-form') return;
    event.preventDefault();
    placeOrder(new FormData(event.target));
  });

  document.getElementById('checkout-main').addEventListener('click', function (event) {
    if (event.target.closest('[data-open-orders]')) openOrders();
    if (event.target.closest('[data-ics]') && state.checkoutDone) downloadIcs(state.checkoutDone);
  });

  document.getElementById('orders-body').addEventListener('click', function (event) {
    var ics = event.target.closest('[data-order-ics]');
    var cancel = event.target.closest('[data-order-cancel]');
    if (ics) {
      var found = state.orders.filter(function (o) { return o.code === ics.getAttribute('data-order-ics'); })[0];
      if (found) downloadIcs(found);
    } else if (cancel) {
      cancelOrder(cancel.getAttribute('data-order-cancel'));
    }
  });

  window.addEventListener('hashchange', route);

  H.onLang(function () {
    renderAgenda();
    if (document.getElementById('booking-dialog').open) renderBooking();
    if (document.getElementById('cart-dialog').open) renderCart();
    if (document.getElementById('orders-dialog').open) renderOrders();
    if (document.body.classList.contains('view-checkout')) renderCheckout();
  });

  /* ---------- init ---------- */

  H.toast = toast;
  updateCartCount();
  renderAgenda();
  route();
})();
