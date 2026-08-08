/* =========================================================
   ESU VEGETABLES — script.js
   Loads vegetables & customers from /data/*.json. The JSON
   files on the server are the single source of truth (they
   are updated by replacing them after an admin "Export JSON").
   localStorage is only used as an offline fallback when the
   fetch fails, so stale data never overrides a fresh upload.
   Only items with status = true (checked) are shown.
   ========================================================= */

var ESU_STORE = {
  VEG_KEY: 'esu_vegetables',
  CUST_KEY: 'esu_customers'
};

/* Guess a Bootstrap icon for a customer name, since the JSON only stores a name + status */
function esuCustomerIcon(name) {
  var n = (name || '').toLowerCase();
  if (n.indexOf('hotel') > -1 || n.indexOf('restaurant') > -1) return 'bi-building';
  if (n.indexOf('cater') > -1) return 'bi-egg-fried';
  if (n.indexOf('hostel') > -1) return 'bi-house-door-fill';
  if (n.indexOf('school') > -1) return 'bi-mortarboard-fill';
  if (n.indexOf('college') > -1) return 'bi-bank2';
  if (n.indexOf('hospital') > -1) return 'bi-hospital-fill';
  if (n.indexOf('hall') > -1 || n.indexOf('marriage') > -1) return 'bi-flower3';
  if (n.indexOf('store') > -1 || n.indexOf('mart') > -1 || n.indexOf('super') > -1) return 'bi-shop';
  if (n.indexOf('park') > -1 || n.indexOf('resort') > -1) return 'bi-tree-fill';
  return 'bi-basket-fill';
}

/* Read admin overrides from localStorage; fall back to null if none saved yet */
function esuReadLocal(key) {
  try {
    var raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/* Fetch the seed JSON file from /data */
function esuFetchJson(path) {
  return fetch(path, { cache: 'no-store' }).then(function (res) {
    if (!res.ok) throw new Error('Failed to load ' + path);
    return res.json();
  });
}

/* Load a dataset: fetch the JSON on the server first (fresh),
   and only fall back to localStorage if the fetch fails. */
function esuLoadData(storageKey, jsonPath) {
  return esuFetchJson(jsonPath).catch(function () {
    var local = esuReadLocal(storageKey);
    return (local && Array.isArray(local)) ? local : [];
  });
}

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Hide the site loader once everything has loaded ---------- */
  var loader = document.getElementById('siteLoader');
  var hideLoader = function () {
    if (loader) loader.classList.add('hidden');
  };
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 2500);

  /* ---------- Render vegetables grid ---------- */
  var vegGrid = document.querySelector('.veg-grid');
  if (vegGrid) {
    esuLoadData(ESU_STORE.VEG_KEY, 'data/vegetables.json').then(function (vegetables) {
      var active = vegetables.filter(function (v) { return v.status; });
      if (!active.length) {
        vegGrid.innerHTML = '<p class="section-text">Stock list is being updated. Please call us for today\'s availability.</p>';
        return;
      }
      vegGrid.innerHTML = '' +
        '<div class="table-responsive veg-table-wrap">' +
          '<table class="table veg-table">' +
            '<thead>' +
              '<tr>' +
                '<th>S.No</th>' +
                '<th>Vegetable Name (Tamil)</th>' +
                '<th>Vegetable Name (English)</th>' +
                '<th>Unit</th>' +
                '<th>Price (&#8377;)</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              active.map(function (v) {
                var hasPrice = v.price !== undefined && v.price !== null && v.price !== '';
                return '<tr>' +
                  '<td>' + v.sno + '</td>' +
                  '<td class="veg-ta">' + (v.name_ta || '&mdash;') + '</td>' +
                  '<td class="veg-en">' + v.name_en + '</td>' +
                  '<td class="veg-unit-cell">' + (v.unit || 'kg') + '</td>' +
                  '<td class="veg-price-cell">' + (hasPrice ? '&#8377;' + v.price : '&mdash;') + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>';
    });
  }

  /* ---------- Render customer marquee (duplicated for a seamless loop) ---------- */
  var marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    esuLoadData(ESU_STORE.CUST_KEY, 'data/customers.json').then(function (customers) {
      var active = customers.filter(function (c) { return c.status; });
      if (!active.length) return;
      var itemHtml = active.map(function (c) {
        return '<div class="marquee-item"><i class="bi ' + esuCustomerIcon(c.name) + '"></i>' + c.name + '</div>';
      }).join('');
      // duplicate the sequence once so the CSS translateX(-50%) loop is seamless
      marqueeTrack.innerHTML = itemHtml + itemHtml;
    });
  }

  /* ---------- Sticky nav shadow on scroll ---------- */
  var navbar = document.querySelector('.site-header .navbar');
  var onScroll = function () {
    if (!navbar) return;
    if (window.scrollY > 12) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Collapse mobile menu after a link is tapped ---------- */
  var navLinks = document.querySelectorAll('#mainNav .nav-link');
  var navCollapseEl = document.getElementById('mainNav');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navCollapseEl && navCollapseEl.classList.contains('show') && window.bootstrap) {
        var collapse = window.bootstrap.Collapse.getOrCreateInstance(navCollapseEl);
        collapse.hide();
      }
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }
});
