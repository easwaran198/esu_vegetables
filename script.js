/* =========================================================
   ESU VEGETABLES — script.js (Price Extraction Fix)
   ========================================================= */

var ESU_STORE = {
  VEG_KEY: 'esu_vegetables',
  CUST_KEY: 'esu_customers'
};

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
  return 'bi-basket-fill';
}

function esuReadLocal(key) {
  try {
    var raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function esuFetchJson(path) {
  return fetch(path, { cache: 'no-store' }).then(function (res) {
    if (!res.ok) throw new Error('Failed to load ' + path);
    return res.json();
  });
}

function esuLoadData(storageKey, jsonPath) {
  return esuFetchJson(jsonPath).catch(function () {
    var local = esuReadLocal(storageKey);
    return (local && Array.isArray(local)) ? local : [];
  });
}

// Helper function to safely format & extract price
function formatVegPrice(v) {
  var val = v.price !== undefined ? v.price : (v.rate !== undefined ? v.rate : v.cost);
  if (val !== null && val !== undefined && val !== '') {
    return '&#8377;' + val;
  }
  return 'Market Rate';
}

document.addEventListener('DOMContentLoaded', function () {

  /* Hide Loader */
  var loader = document.getElementById('siteLoader');
  var hideLoader = function () { if (loader) loader.classList.add('hidden'); };
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 2000);

  /* Render Vegetables (Table for Desktop + Cards for Mobile) */
  var vegGrid = document.querySelector('.veg-grid');
  if (vegGrid) {
    esuLoadData(ESU_STORE.VEG_KEY, 'data/vegetables.json').then(function (vegetables) {
      // Filter active items (or render all if status flag is not used)
      var active = vegetables.filter(function (v) { return v.status === undefined || v.status === true || v.status === 1 || v.status === 'true'; });
      
      if (!active.length) {
        vegGrid.innerHTML = '<p class="section-text text-center">Stock list is being updated. Please call us for today\'s price availability.</p>';
        return;
      }

      /* Desktop Table View */
      var tableHtml = '' +
        '<div class="table-responsive veg-table-wrap">' +
          '<table class="table veg-table">' +
            '<thead>' +
              '<tr>' +
                '<th>S.No</th>' +
                '<th>Vegetable Name (Tamil)</th>' +
                '<th>Vegetable Name (English)</th>' +
                '<th>Unit</th>' +
                '<th>Price</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              active.map(function (v, idx) {
                var sno = v.sno || (idx + 1);
                var priceDisplay = formatVegPrice(v);
                return '<tr>' +
                  '<td>' + sno + '</td>' +
                  '<td class="veg-ta">' + (v.name_ta || v.tamil_name || '&mdash;') + '</td>' +
                  '<td class="veg-en">' + (v.name_en || v.english_name || v.name || 'Vegetable') + '</td>' +
                  '<td class="veg-unit-cell">' + (v.unit || 'kg') + '</td>' +
                  '<td class="veg-price-cell">' + priceDisplay + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>';

      /* Mobile Card View */
      var cardsHtml = '' +
        '<div class="veg-cards-mobile">' +
          active.map(function (v) {
            var priceDisplay = formatVegPrice(v);
            return '<div class="veg-card-item">' +
              '<div class="veg-card-info">' +
                '<span class="veg-card-en">' + (v.name_en || v.english_name || v.name || 'Vegetable') + '</span>' +
                '<span class="veg-card-ta">' + (v.name_ta || v.tamil_name || '') + '</span>' +
              '</div>' +
              '<div class="veg-card-price-wrap">' +
                '<span class="veg-card-price">' + priceDisplay + '</span>' +
                '<span class="veg-card-unit">per ' + (v.unit || 'kg') + '</span>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>';

      vegGrid.innerHTML = tableHtml + cardsHtml;
    });
  }

  /* Render Customers Marquee */
  var marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    esuLoadData(ESU_STORE.CUST_KEY, 'data/customers.json').then(function (customers) {
      var active = customers.filter(function (c) { return c.status === undefined || c.status === true || c.status === 1 || c.status === 'true'; });
      if (!active.length) return;
      var itemHtml = active.map(function (c) {
        return '<div class="marquee-item"><i class="bi ' + esuCustomerIcon(c.name) + '"></i>' + c.name + '</div>';
      }).join('');
      marqueeTrack.innerHTML = itemHtml + itemHtml;
    });
  }

  /* Sticky Header */
  var navbar = document.querySelector('.site-header .navbar');
  var onScroll = function () {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* Auto-close Mobile Nav */
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

  /* Footer Dynamic Year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* AOS Initialization */
  if (window.AOS) {
    window.AOS.init({ duration: 800, once: true, offset: 50 });
  }
});
