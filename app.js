/*
 * Bahia Experiences: renders the content, switches language and theme,
 * runs the section tabs, the category filters and the experience window.
 * Content lives in content.js, labels in i18n.js.
 */
(function () {
  'use strict';

  var SITE = window.SITE;
  var I18N = window.I18N;
  var TABS = ['tours', 'guides', 'tips', 'transfers', 'concierge'];
  var LANG_KEY = 'bahia-lang';
  var THEME_KEY = 'bahia-theme';

  var state = {
    lang: 'en',
    theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    filter: 'all',
  };

  var tabList = document.querySelector('[role="tablist"]');
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));
  var dialog = document.getElementById('experience-dialog');

  /* ---------- helpers ---------- */

  // Storage can throw in private mode or when blocked; the site still works without it.
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* keep the choice for this visit only */ }
  }

  function t(key, vars) {
    var dict = I18N[state.lang] || I18N.en;
    var text = dict[key] !== undefined ? dict[key] : I18N.en[key];
    if (text === undefined) return key;
    Object.keys(vars || {}).forEach(function (name) {
      text = text.split('{' + name + '}').join(vars[name]);
    });
    return text;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }

  function findTour(id) {
    return SITE.tours.filter(function (item) { return item.id === id; })[0];
  }

  function askHref(subjectKey, topic) {
    var subject = t(subjectKey, { topic: topic });
    var body = t('mail.body', { topic: topic });
    return 'mailto:' + SITE.contactEmail +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  // Full sentence for the experience window, e.g. "From $95 USD per person".
  function priceText(tour) {
    return tour.price ? t('price.from', { price: tour.price }) : t('price.onRequest');
  }

  // Short badge on the card photo, e.g. "From $95 USD".
  function priceTag(tour) {
    return tour.price ? t('price.tag', { price: tour.price }) : t('price.onRequest');
  }

  function chipsHtml(labels) {
    return '<ul class="chip-list">' + labels.map(function (label) {
      return '<li>' + icon('check') + '<span>' + esc(label) + '</span></li>';
    }).join('') + '</ul>';
  }

  function pointsHtml(labels) {
    return '<ul class="check-list">' + labels.map(function (label) {
      return '<li>' + icon('check') + '<span>' + esc(label) + '</span></li>';
    }).join('') + '</ul>';
  }

  function visibleTours() {
    return SITE.tours.filter(function (tour) {
      return state.filter === 'all' || tour.categories.indexOf(state.filter) !== -1;
    });
  }

  /* ---------- rendering ---------- */

  function renderFilters() {
    document.getElementById('filters').innerHTML = ['all'].concat(SITE.filters).map(function (name) {
      var label = name === 'all' ? t('filters.all') : t('cat.' + name);
      var pressed = state.filter === name;
      return '<button type="button" class="filter-btn" data-filter="' + esc(name) + '" aria-pressed="' + pressed + '">' + esc(label) + '</button>';
    }).join('');
  }

  function renderTours() {
    document.getElementById('tour-grid').innerHTML = visibleTours().map(function (tour) {
      var copy = tour[state.lang];
      return '' +
        '<article class="tour-card">' +
          '<div class="tour-media">' +
            '<img src="' + esc(tour.image) + '" alt="" loading="lazy" decoding="async" style="object-position:' + esc(tour.focus) + '" />' +
            '<span class="price-tag">' + esc(priceTag(tour)) + '</span>' +
          '</div>' +
          '<div class="tour-body">' +
            '<p class="tour-kicker">' + esc(copy.category) + '</p>' +
            '<h3>' + esc(copy.title) + '</h3>' +
            '<p>' + esc(copy.description) + '</p>' +
            '<div class="tour-foot">' +
              '<button type="button" class="link-btn" data-tour="' + esc(tour.id) + '">' + esc(t('btn.view')) + icon('arrow') + '</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  // The two cards in the hero show the tour's own title and category.
  function renderHeroCards() {
    document.querySelectorAll('[data-hero-title]').forEach(function (el) {
      el.textContent = findTour(el.getAttribute('data-hero-title'))[state.lang].title;
    });
    document.querySelectorAll('[data-hero-kicker]').forEach(function (el) {
      el.textContent = findTour(el.getAttribute('data-hero-kicker'))[state.lang].category;
    });
  }

  function renderServices() {
    var services = SITE.services;

    var guides = services.guides[state.lang];
    document.querySelector('[data-service="guides"]').innerHTML = '' +
      '<div class="feature-copy">' +
        '<div class="feature-icon">' + icon(services.guides.icon) + '</div>' +
        '<h3>' + esc(guides.title) + '</h3>' +
        '<p>' + esc(guides.description) + '</p>' +
        chipsHtml(guides.chips) +
        '<a class="btn btn-primary" href="' + esc(askHref('mail.guideSubject', guides.title)) + '">' + esc(t('btn.ask')) + '</a>' +
      '</div>' +
      '<div class="feature-art" aria-hidden="true">' + icon(services.guides.icon) + '</div>';

    var transfers = services.transfers[state.lang];
    document.querySelector('[data-service="transfers"]').innerHTML = '' +
      '<figure class="split-media">' +
        '<img src="' + esc(services.transfers.image) + '" alt="' + esc(transfers.imageAlt) + '" loading="lazy" decoding="async" />' +
      '</figure>' +
      '<div class="split-copy">' +
        '<div class="feature-icon">' + icon(services.transfers.icon) + '</div>' +
        '<h3>' + esc(transfers.title) + '</h3>' +
        '<p>' + esc(transfers.description) + '</p>' +
        chipsHtml(transfers.chips) +
        '<a class="btn btn-primary" href="' + esc(askHref('mail.transferSubject', transfers.title)) + '">' + esc(t('btn.ask')) + '</a>' +
      '</div>';

    var concierge = services.concierge[state.lang];
    document.querySelector('[data-service="concierge"]').innerHTML = '' +
      '<div class="feature-copy">' +
        '<div class="feature-icon">' + icon(services.concierge.icon) + '</div>' +
        '<h3>' + esc(concierge.title) + '</h3>' +
        '<p>' + esc(concierge.description) + '</p>' +
        pointsHtml(concierge.points) +
        '<a class="btn btn-primary" href="' + esc(askHref('mail.conciergeSubject', concierge.title)) + '">' + esc(t('btn.ask')) + '</a>' +
      '</div>' +
      '<div class="feature-art" aria-hidden="true">' + icon(services.concierge.icon) + '</div>';
  }

  function renderTips() {
    document.getElementById('tips-grid').innerHTML = SITE.tips.map(function (tip) {
      var copy = tip[state.lang];
      return '' +
        '<article class="tip' + (tip.wide ? ' tip--wide' : '') + '">' +
          '<div class="feature-icon">' + icon(tip.icon) + '</div>' +
          '<h3>' + esc(copy.title) + '</h3>' +
          '<p>' + esc(copy.text) + '</p>' +
        '</article>';
    }).join('');
  }

  function renderContact() {
    document.getElementById('contact-ask').setAttribute('href', askHref('mail.generalSubject', SITE.brand));
    var email = document.getElementById('contact-email');
    email.setAttribute('href', 'mailto:' + SITE.contactEmail);
    email.textContent = SITE.contactEmail;
  }

  // Static labels carry data-i18n keys in index.html; this fills them in for the current language.
  function translateStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]').setAttribute('content', t('meta.description'));
    document.querySelector('meta[property="og:title"]').setAttribute('content', t('meta.title'));
    document.querySelector('meta[property="og:description"]').setAttribute('content', t('meta.description'));
    updateThemeToggle();
  }

  /* ---------- language ---------- */

  function detectLang() {
    var fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && I18N[fromUrl]) return fromUrl;

    var saved = read(LANG_KEY);
    if (saved && I18N[saved]) return saved;

    var browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return I18N[browser] ? browser : 'en';
  }

  function setLang(lang, save) {
    if (!I18N[lang]) return;
    state.lang = lang;
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en-US' : 'es');
    document.querySelectorAll('.lang-switch button').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-lang') === lang));
    });
    if (save) write(LANG_KEY, lang);

    translateStatic();
    renderFilters();
    renderTours();
    renderHeroCards();
    renderServices();
    renderTips();
    renderContact();
  }

  /* ---------- theme ---------- */

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggle();
  }

  function updateThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    var label = t(state.theme === 'dark' ? 'theme.toLight' : 'theme.toDark');
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  }

  /* ---------- tabs ---------- */

  function setTab(name, options) {
    var opts = options || {};
    if (TABS.indexOf(name) === -1) return;

    tabButtons.forEach(function (button) {
      var active = button.getAttribute('data-tab') === name;
      button.setAttribute('aria-selected', String(active));
      button.setAttribute('tabindex', active ? '0' : '-1');
      if (active && opts.focus) button.focus();
    });

    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-panel') !== name;
    });

    if (opts.updateHash !== false) {
      window.history.replaceState(window.history.state, '', '#' + name);
    }
  }

  tabList.addEventListener('click', function (event) {
    var button = event.target.closest('.tab');
    if (button) setTab(button.getAttribute('data-tab'));
  });

  // Arrow keys, Home and End move between tabs, as the ARIA tabs pattern expects.
  tabList.addEventListener('keydown', function (event) {
    var index = tabButtons.indexOf(document.activeElement);
    if (index === -1) return;

    var next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % tabButtons.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabButtons.length) % tabButtons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabButtons.length - 1;
    if (next === null) return;

    event.preventDefault();
    setTab(tabButtons[next].getAttribute('data-tab'), { focus: true });
  });

  // Links such as "#tours" in the hero or footer open the matching tab.
  // Other anchors (#how, #faq, #contact) are plain page sections and scroll normally.
  window.addEventListener('hashchange', function () {
    var name = window.location.hash.slice(1);
    if (TABS.indexOf(name) === -1) return;
    setTab(name, { updateHash: false });
    document.querySelector('.tabs-bar').scrollIntoView({ block: 'start' });
  });

  /* ---------- category filters ---------- */

  function setFilter(name) {
    if (name !== 'all' && SITE.filters.indexOf(name) === -1) return;
    state.filter = name;
    renderFilters();
    renderTours();
  }

  document.getElementById('filters').addEventListener('click', function (event) {
    var button = event.target.closest('[data-filter]');
    if (button) setFilter(button.getAttribute('data-filter'));
  });

  // Category chips in the hero filter the tours and bring the tours tab into view.
  document.querySelector('.cat-chips').addEventListener('click', function (event) {
    var chip = event.target.closest('[data-filter]');
    if (!chip) return;
    setFilter(chip.getAttribute('data-filter'));
    setTab('tours');
    document.querySelector('.tabs-bar').scrollIntoView({ block: 'start' });
  });

  /* ---------- experience window ---------- */

  function openTour(id) {
    var tour = findTour(id);
    if (!tour) return;
    var copy = tour[state.lang];

    var image = document.getElementById('dialog-image');
    image.setAttribute('src', tour.image);
    image.style.objectPosition = tour.focus;

    document.getElementById('dialog-price-tag').textContent = priceTag(tour);
    document.getElementById('dialog-kicker').textContent = copy.category;
    document.getElementById('dialog-title').textContent = copy.title;
    document.getElementById('dialog-tags').innerHTML = tour.categories.map(function (cat) {
      return '<span>' + esc(t('cat.' + cat)) + '</span>';
    }).join('');
    document.getElementById('dialog-description').textContent = copy.description;
    document.getElementById('dialog-highlights').innerHTML = copy.highlights.map(function (item) {
      return '<li>' + icon('check') + '<span>' + esc(item) + '</span></li>';
    }).join('');
    document.getElementById('dialog-bring').innerHTML = copy.bring.map(function (item) {
      return '<li>' + esc(item) + '</li>';
    }).join('');
    // Duration, inclusions and meeting point appear only once filled in content.js;
    // until then one row says they are confirmed before booking.
    var details = [
      [t('info.duration'), copy.duration],
      [t('info.included'), copy.included],
      [t('info.meeting'), copy.meetingPoint],
    ].filter(function (row) { return row[1]; });
    var info = [
      [t('info.price'), priceText(tour)],
      [t('info.languages'), t('info.guides')],
      [t('info.payment'), t('info.paymentValue')],
    ].concat(details.length ? details : [[t('info.details'), t('info.detailsValue')]]);
    document.getElementById('dialog-info').innerHTML = info.map(function (row) {
      return '<div><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>';
    }).join('');

    var ask = document.getElementById('dialog-ask');
    ask.setAttribute('href', askHref('mail.tourSubject', copy.title));
    ask.textContent = t('btn.ask');

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.scrollTop = 0;
  }

  // "View Experience" buttons on the cards and the photo cards in the hero both open the window.
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-tour]');
    if (button) openTour(button.getAttribute('data-tour'));
  });

  // Clicking the backdrop (the dialog element itself) closes it.
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  /* ---------- controls ---------- */

  document.querySelector('.lang-switch').addEventListener('click', function (event) {
    var button = event.target.closest('button[data-lang]');
    if (!button) return;
    var lang = button.getAttribute('data-lang');
    setLang(lang, true);

    // Keep the chosen language in the URL so the link can be shared as-is.
    var url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState(window.history.state, '', url.toString());
  });

  document.getElementById('theme-toggle').addEventListener('click', function () {
    var next = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    write(THEME_KEY, next);
  });

  // Follow the system theme until the visitor picks one.
  var systemTheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (systemTheme && read(THEME_KEY) === null) {
    systemTheme.addEventListener('change', function (event) {
      applyTheme(event.matches ? 'dark' : 'light');
    });
  }

  /* ---------- init ---------- */

  applyTheme(state.theme);
  setLang(detectLang(), false);

  var initialTab = window.location.hash.slice(1);
  setTab(TABS.indexOf(initialTab) !== -1 ? initialTab : 'tours', { updateHash: false });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
