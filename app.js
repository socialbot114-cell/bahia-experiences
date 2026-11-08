/*
 * Bahia Experiences: renders the content, switches language and theme,
 * runs the section tabs, the category filters and the experience window.
 * Content lives in content.js, labels in i18n.js.
 */
(function () {
  'use strict';

  var SITE = window.SITE;
  var BLOG = window.BLOG;
  var SHOP = window.SHOP;
  var I18N = window.I18N;
  var TABS = ['tours', 'guides', 'tips', 'transfers', 'concierge'];
  var LANG_KEY = 'bahia-lang';
  var THEME_KEY = 'bahia-theme';
  var SAVED_KEY = 'bahia-saved';
  var CHECK_KEY = 'bahia-checklist';
  var CHECK_ITEMS = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8'];

  var state = {
    lang: 'en',
    theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    filter: 'all',
    blogFilter: 'all',
    post: null,
    saved: readJSON(SAVED_KEY, []),
    checks: readJSON(CHECK_KEY, {}),
    currentTourId: '',
  };

  var tabList = document.querySelector('[role="tablist"]');
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));
  var dialog = document.getElementById('experience-dialog');
  var langListeners = [];

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

  // Lowest price for one guest, from the demo catalog in shop.js (the children's price if it is lower).
  function minPrice(tourId) {
    var p = SHOP.products[tourId].prices;
    return p.child !== null && p.child < p.adult ? p.child : p.adult;
  }

  // Full sentence for the experience window, e.g. "From $35 USD per person".
  function priceText(tour) {
    return t('price.from', { price: minPrice(tour.id) });
  }

  // Short badge on the card photo, e.g. "From $35 USD".
  function priceTag(tour) {
    return t('price.tag', { price: minPrice(tour.id) });
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
            '<button type="button" class="fav-btn" data-fav="' + esc(tour.id) + '" aria-pressed="' + isSaved(tour.id) + '" aria-label="' +
              esc(t(isSaved(tour.id) ? 'fav.remove' : 'fav.add')) + '"><svg class="icon" aria-hidden="true"><use href="#i-heart" /></svg></button>' +
            '<span class="price-tag">' + esc(priceTag(tour)) + '</span>' +
          '</div>' +
          '<div class="tour-body">' +
            '<p class="tour-kicker">' + esc(copy.category) + '</p>' +
            '<h3>' + esc(copy.title) + '</h3>' +
            '<p>' + esc(copy.description) + '</p>' +
            '<div class="tour-foot">' +
              '<button type="button" class="link-btn" data-tour="' + esc(tour.id) + '">' + esc(t('btn.view')) + icon('arrow') + '</button>' +
              '<button type="button" class="btn btn-primary btn-sm" data-book="' + esc(tour.id) + '">' + esc(t('book.bookNow')) + '</button>' +
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
    renderGallery();
    renderBlog();
    renderContact();
    renderSaved();
    renderChecklist();
    renderClock();
    syncDialogFav();
    langListeners.forEach(function (fn) { fn(lang); });
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

  // Hash links (#tours, #blog/slug, ...) are handled by routeHash, defined with the blog below.

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

  /* ---------- gallery ---------- */

  function renderGallery() {
    document.getElementById('gallery-grid').innerHTML = SITE.gallery.map(function (item) {
      var caption = item[state.lang].caption;
      return '' +
        '<figure class="gallery-item">' +
          '<img src="' + esc(item.image) + '" alt="' + esc(caption) + '" loading="lazy" decoding="async" />' +
          '<figcaption>' + esc(caption) + '</figcaption>' +
        '</figure>';
    }).join('');
  }

  /* ---------- blog ---------- */

  function findPost(slug) {
    return BLOG.posts.filter(function (post) { return post.slug === slug; })[0];
  }

  // Estimated from the words in the article: about 200 words per minute.
  function readingTime(post) {
    var copy = post[state.lang];
    var text = [copy.title].concat(copy.body.map(function (block) {
      return block.type === 'ul' ? block.items.join(' ') : block.text;
    })).join(' ');
    var words = text.split(/\s+/).filter(Boolean).length;
    return t('blog.readingTime', { min: Math.max(2, Math.round(words / 200)) });
  }

  function renderBlogFilters() {
    document.getElementById('blog-filters').innerHTML = ['all'].concat(BLOG.categories).map(function (name) {
      var label = name === 'all' ? t('filters.all') : t('blog.cat.' + name);
      var pressed = state.blogFilter === name;
      return '<button type="button" class="filter-btn" data-blog-filter="' + esc(name) + '" aria-pressed="' + pressed + '">' + esc(label) + '</button>';
    }).join('');
  }

  function renderBlogGrid() {
    var posts = BLOG.posts.filter(function (post) {
      return state.blogFilter === 'all' || post.category === state.blogFilter;
    });
    document.getElementById('post-grid').innerHTML = posts.map(function (post) {
      var copy = post[state.lang];
      return '' +
        '<article class="post-card">' +
          '<a class="post-card-link" href="#blog/' + esc(post.slug) + '">' +
            '<div class="post-card-media"><img src="' + esc(post.image) + '" alt="" loading="lazy" decoding="async" /></div>' +
            '<div class="post-card-body">' +
              '<p class="tour-kicker">' + esc(t('blog.cat.' + post.category)) + ' · ' + esc(readingTime(post)) + '</p>' +
              '<h3>' + esc(copy.title) + '</h3>' +
              '<p>' + esc(copy.excerpt) + '</p>' +
              '<span class="link-text">' + esc(t('blog.readMore')) + icon('arrow') + '</span>' +
            '</div>' +
          '</a>' +
        '</article>';
    }).join('');
  }

  function renderPost(post) {
    var copy = post[state.lang];
    document.getElementById('post-kicker').textContent = t('blog.cat.' + post.category);
    document.getElementById('post-title').textContent = copy.title;
    document.getElementById('post-meta').textContent = readingTime(post);
    document.getElementById('post-cover').setAttribute('src', post.image);
    document.getElementById('post-body').innerHTML = copy.body.map(function (block) {
      if (block.type === 'h') return '<h3>' + esc(block.text) + '</h3>';
      if (block.type === 'ul') {
        return '<ul class="dot-list">' + block.items.map(function (item) {
          return '<li>' + esc(item) + '</li>';
        }).join('') + '</ul>';
      }
      return '<p>' + esc(block.text) + '</p>';
    }).join('');
    var ask = document.getElementById('post-ask');
    ask.setAttribute('href', askHref('mail.postSubject', copy.title));
    ask.textContent = t('btn.ask');
  }

  // The blog shows either the list or one article, depending on state.post.
  function renderBlog() {
    renderBlogFilters();
    renderBlogGrid();
    var post = state.post && findPost(state.post);
    document.getElementById('blog-list').hidden = !!post;
    document.getElementById('blog-post').hidden = !post;
    if (post) renderPost(post);
  }

  function setBlogFilter(name) {
    if (name !== 'all' && BLOG.categories.indexOf(name) === -1) return;
    state.blogFilter = name;
    renderBlogFilters();
    renderBlogGrid();
  }

  document.getElementById('blog-filters').addEventListener('click', function (event) {
    var button = event.target.closest('[data-blog-filter]');
    if (button) setBlogFilter(button.getAttribute('data-blog-filter'));
  });

  /* ---------- hash routing ---------- */

  // #tours, #guides, ... open a tab; #blog shows the article list; #blog/<slug> opens one article.
  // Other anchors (#how, #faq, #contact, #gallery) are plain page sections and scroll normally.
  function routeHash(scroll) {
    var raw = window.location.hash.slice(1);

    // #tour/<id> is a shareable link that opens one experience window.
    if (raw.indexOf('tour/') === 0) {
      if (findTour(raw.slice(5))) openTour(raw.slice(5));
      return;
    }

    if (raw === 'blog' || raw.indexOf('blog/') === 0) {
      state.post = raw.indexOf('blog/') === 0 ? decodeURIComponent(raw.slice(5)) : null;
      if (state.post && !findPost(state.post)) state.post = null;
      renderBlog();
      if (scroll) document.getElementById('blog').scrollIntoView({ block: 'start' });
      return;
    }

    if (TABS.indexOf(raw) !== -1) {
      setTab(raw, { updateHash: false });
      if (scroll) document.querySelector('.tabs-bar').scrollIntoView({ block: 'start' });
    }
  }

  window.addEventListener('hashchange', function () { routeHash(true); });

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

    document.getElementById('dialog-book').setAttribute('data-book', tour.id);
    state.currentTourId = tour.id;
    syncDialogFav();
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

  // The site opens in light mode, whatever the system setting; only the visitor's own choice changes it.

  /* ---------- saved experiences, checklist, clock, share, back to top ---------- */

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: keep working for this visit */ }
  }

  function notify(message) {
    if (window.Bahia && window.Bahia.toast) window.Bahia.toast(message);
  }

  function isSaved(id) {
    return state.saved.indexOf(id) !== -1;
  }

  function toggleSaved(id) {
    state.saved = isSaved(id)
      ? state.saved.filter(function (item) { return item !== id; })
      : state.saved.concat([id]);
    writeJSON(SAVED_KEY, state.saved);
    renderTours();
    renderSaved();
    syncDialogFav();
  }

  function syncDialogFav() {
    var fav = document.getElementById('dialog-fav');
    if (!fav) return;
    var id = state.currentTourId;
    var saved = !!id && isSaved(id);
    fav.setAttribute('data-fav', id);
    fav.setAttribute('aria-pressed', String(saved));
    fav.querySelector('span').textContent = t(saved ? 'fav.saved' : 'fav.save');
  }

  function renderSaved() {
    var tours = state.saved.map(findTour).filter(Boolean);
    document.getElementById('saved-list').innerHTML = tours.map(function (tour) {
      var copy = tour[state.lang];
      return '' +
        '<article class="saved-card">' +
          '<img src="' + esc(tour.image) + '" alt="" loading="lazy" decoding="async" style="object-position:' + esc(tour.focus) + '" />' +
          '<div class="saved-card-body">' +
            '<p class="saved-card-kicker">' + esc(copy.category) + '</p>' +
            '<h3>' + esc(copy.title) + '</h3>' +
            '<p>' + esc(priceTag(tour)) + '</p>' +
            '<div class="saved-card-actions">' +
              '<button type="button" class="btn btn-primary btn-sm" data-book="' + esc(tour.id) + '">' + esc(t('book.bookNow')) + '</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-fav="' + esc(tour.id) + '" aria-pressed="true">' + esc(t('saved.remove')) + '</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');
    document.getElementById('saved-empty').hidden = tours.length > 0;
    document.getElementById('saved-clear').hidden = tours.length === 0;
    document.getElementById('saved-print').disabled = tours.length === 0;
  }

  function renderChecklist() {
    var done = CHECK_ITEMS.filter(function (id) { return !!state.checks[id]; }).length;
    var percent = Math.round(done / CHECK_ITEMS.length * 100);
    document.getElementById('check-grid').innerHTML = CHECK_ITEMS.map(function (id) {
      var checked = !!state.checks[id];
      return '<label class="check-item' + (checked ? ' is-done' : '') + '">' +
        '<input type="checkbox" data-check="' + id + '"' + (checked ? ' checked' : '') + ' />' +
        '<span>' + esc(t('checklist.' + id)) + '</span></label>';
    }).join('');
    document.getElementById('check-fill').style.width = percent + '%';
    document.getElementById('check-progress').setAttribute('aria-valuenow', String(percent));
    document.getElementById('check-text').textContent = t('checklist.progress', { done: done, total: CHECK_ITEMS.length });
  }

  function renderClock() {
    var el = document.getElementById('bahia-clock');
    if (!el) return;
    el.textContent = new Intl.DateTimeFormat(state.lang === 'es' ? 'es-US' : 'en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Bahia',
    }).format(new Date());
  }

  // Copies a link to this part of the site (#tour/<id> or #blog/<slug>).
  function copyLink(hash) {
    var link = window.location.href.split('#')[0] + hash;
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      notify(link);
      return;
    }
    navigator.clipboard.writeText(link).then(function () {
      notify(t('share.copied'));
    }, function () {
      notify(link);
    });
  }

  // Print only the shortlist or the checklist: the print styles in styles.css read data-print.
  function printSection(name) {
    document.body.setAttribute('data-print', name);
    window.print();
    document.body.removeAttribute('data-print');
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    var fav = target.closest('[data-fav]');
    if (fav && fav.getAttribute('data-fav')) {
      toggleSaved(fav.getAttribute('data-fav'));
    } else if (target.closest('#saved-print')) {
      printSection('saved');
    } else if (target.closest('#saved-clear')) {
      state.saved = [];
      writeJSON(SAVED_KEY, state.saved);
      renderTours();
      renderSaved();
      syncDialogFav();
    } else if (target.closest('#check-print')) {
      printSection('checklist');
    } else if (target.closest('#check-reset')) {
      state.checks = {};
      writeJSON(CHECK_KEY, state.checks);
      renderChecklist();
    } else if (target.closest('#dialog-share') && state.currentTourId) {
      copyLink('#tour/' + state.currentTourId);
    } else if (target.closest('#post-share') && state.post) {
      copyLink('#blog/' + state.post);
    }
  });

  document.getElementById('check-grid').addEventListener('change', function (event) {
    var box = event.target.closest('[data-check]');
    if (!box) return;
    state.checks[box.getAttribute('data-check')] = box.checked;
    writeJSON(CHECK_KEY, state.checks);
    renderChecklist();
  });

  var toTop = document.getElementById('to-top');
  window.addEventListener('scroll', function () {
    toTop.hidden = window.scrollY < 600;
  }, { passive: true });
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Helpers shared with booking.js, which is loaded after this file.
  window.Bahia = {
    t: t,
    esc: esc,
    icon: icon,
    lang: function () { return state.lang; },
    findTour: findTour,
    minPrice: minPrice,
    onLang: function (fn) { langListeners.push(fn); },
  };

  /* ---------- init ---------- */

  applyTheme(state.theme);
  setLang(detectLang(), false);
  setTab('tours', { updateHash: false });
  routeHash(false);

  renderSaved();
  renderChecklist();
  renderClock();
  setInterval(renderClock, 30000);
  document.getElementById('year').textContent = new Date().getFullYear();
})();
