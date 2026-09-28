/* =========================================================
   ESU VEGETABLES — Dynamic Renderer with Search & Mobile UX
   ========================================================= */

var ESU_STORE = {
  VEG_KEY: 'esu_vegetables',
  CUST_KEY: 'esu_customers'
};

var DEFAULT_VEGETABLES = [
  { "sno": 1,  "name_ta": "தக்காளி (சின்ன பாக்ஸ்)", "name_en": "Tomato (Small Box)", "unit": "Box", "price": 280, "status": true },
  { "sno": 2,  "name_ta": "தக்காளி (பெரிய பாக்ஸ்)", "name_en": "Tomato (Big Box)",   "unit": "Box", "price": 450, "status": true },
  { "sno": 3,  "name_ta": "தக்காளி (சில்லறை)",      "name_en": "Tomato (Retail)",    "unit": "Kg",  "price": 25,  "status": true },
  { "sno": 4,  "name_ta": "உருளைக்கிழங்கு",         "name_en": "Potato",             "unit": "Kg",  "price": 30,  "status": true },
  { "sno": 5,  "name_ta": "பெரிய வெங்காயம்",       "name_en": "Big Onion",          "unit": "Kg",  "price": 40,  "status": true },
  { "sno": 6,  "name_ta": "சின்ன வெங்காயம்",       "name_en": "Small Onion",        "unit": "Kg",  "price": 70,  "status": true },
  { "sno": 7,  "name_ta": "கத்தரிக்காய்",            "name_en": "Brinjal",            "unit": "Kg",  "price": 40,  "status": true },
  { "sno": 8,  "name_ta": "கேரட்",                  "name_en": "Carrot",             "unit": "Kg",  "price": 60,  "status": true },
  { "sno": 9,  "name_ta": "பீட்ரூட்",                "name_en": "Beetroot",           "unit": "Kg",  "price": 50,  "status": true },
  { "sno": 10, "name_ta": "முட்டைக்கோஸ்",           "name_en": "Cabbage",            "unit": "Kg",  "price": 35,  "status": true },
  { "sno": 11, "name_ta": "காலிஃபிளவர்",            "name_en": "Cauliflower",        "unit": "Piece", "price": 45, "status": true },
  { "sno": 12, "name_ta": "வெண்டைக்காய்",           "name_en": "Lady Finger",        "unit": "Kg",  "price": 50,  "status": true },
  { "sno": 13, "name_ta": "முருங்கைக்காய்",          "name_en": "Drumstick",          "unit": "Kg",  "price": 60,  "status": true },
  { "sno": 14, "name_ta": "பாகற்காய்",               "name_en": "Bitter Gourd",       "unit": "Kg",  "price": 45,  "status": true },
  { "sno": 15, "name_ta": "சுரைக்காய்",              "name_en": "Bottle Gourd",       "unit": "Piece", "price": 35, "status": true },
  { "sno": 16, "name_ta": "பீர்க்கங்காய்",            "name_en": "Ridge Gourd",        "unit": "Kg",  "price": 40,  "status": true },
  { "sno": 17, "name_ta": "புடலங்காய்",              "name_en": "Snake Gourd",        "unit": "Kg",  "price": 45,  "status": true },
  { "sno": 18, "name_ta": "மஞ்சள் பூசணிக்காய்",       "name_en": "Pumpkin",            "unit": "Kg",  "price": 25,  "status": true },
  { "sno": 19, "name_ta": "வெள்ளைப்பூசணிக்காய்",      "name_en": "Ash Gourd",          "unit": "Kg",  "price": 25,  "status": true },
  { "sno": 20, "name_ta": "பச்சை மிளகாய்",           "name_en": "Green Chilli",       "unit": "Kg",  "price": 70,  "status": true },
  { "sno": 21, "name_ta": "குடமிளகாய்",              "name_en": "Capsicum",           "unit": "Kg",  "price": 55,  "status": true },
  { "sno": 22, "name_ta": "பீன்ஸ்",                  "name_en": "Beans",              "unit": "Kg",  "price": 85,  "status": true },
  { "sno": 23, "name_ta": "கொத்தவரங்காய்",           "name_en": "Cluster Beans",      "unit": "Kg",  "price": 50,  "status": true },
  { "sno": 24, "name_ta": "அவரைக்காய்",              "name_en": "Broad Beans",        "unit": "Kg",  "price": 50,  "status": true },
  { "sno": 25, "name_ta": "பட்டாணி",                "name_en": "Peas",               "unit": "Kg",  "price": 60,  "status": true },
  { "sno": 26, "name_ta": "முள்ளங்கி",               "name_en": "Radish",             "unit": "Kg",  "price": 35,  "status": true },
  { "sno": 27, "name_ta": "டர்னிப்",                 "name_en": "Turnip",             "unit": "Kg",  "price": 60,  "status": true },
  { "sno": 28, "name_ta": "பசலைக்கீரை",             "name_en": "Spinach",            "unit": "Kattu", "price": 15, "status": true },
  { "sno": 29, "name_ta": "கொத்தமல்லி",              "name_en": "Coriander",          "unit": "Kattu", "price": 10, "status": true },
  { "sno": 30, "name_ta": "புதினா",                  "name_en": "Mint",               "unit": "Kattu", "price": 10, "status": true },
  { "sno": 31, "name_ta": "கறிவேப்பிலை",             "name_en": "Curry Leaves",       "unit": "Kattu", "price": 10, "status": true },
  { "sno": 32, "name_ta": "வெந்தயக்கீரை",            "name_en": "Fenugreek Leaves",   "unit": "Kattu", "price": 12, "status": true },
  { "sno": 33, "name_ta": "வாழைப்பூ",                "name_en": "Banana Flower",      "unit": "Piece", "price": 20, "status": true },
  { "sno": 34, "name_ta": "வாழைத்தண்டு",             "name_en": "Banana Stem",        "unit": "Piece", "price": 20, "status": true },
  { "sno": 35, "name_ta": "வாழைக்காய்",              "name_en": "Raw Banana",         "unit": "Kg",  "price": 15,  "status": true },
  { "sno": 36, "name_ta": "சர்க்கரைவள்ளிக்கிழங்கு",     "name_en": "Sweet Potato",       "unit": "Kg",  "price": 40,  "status": true },
  { "sno": 37, "name_ta": "பூண்டு",                  "name_en": "Garlic",             "unit": "Kg",  "price": 220, "status": true },
  { "sno": 38, "name_ta": "இஞ்சி",                   "name_en": "Ginger",             "unit": "Kg",  "price": 130, "status": true },
  { "sno": 39, "name_ta": "எலுமிச்சை",               "name_en": "Lemon",              "unit": "Piece", "price": 5,   "status": true },
  { "sno": 40, "name_ta": "கோவைக்காய்",              "name_en": "Ivy Gourd",          "unit": "Kg",  "price": 45,  "status": true },
  { "sno": 41, "name_ta": "வெள்ளரிக்காய்",           "name_en": "Cucumber",           "unit": "Kg",  "price": 35,  "status": true },
  { "sno": 42, "name_ta": "சவ் சவ்",                 "name_en": "Chow Chow",          "unit": "Kg",  "price": 30,  "status": true },
  { "sno": 43, "name_ta": "காளான்",                  "name_en": "Mushroom",           "unit": "Pocket", "price": 45, "status": true }
];

var DEFAULT_CUSTOMERS = [
  { "sno": 1, "name": "Madurai Amutha Hotel",         "status": true },
  { "sno": 2, "name": "SivaHari Catering",            "status": true },
  { "sno": 3, "name": "Aaharam Catering",             "status": true },
  { "sno": 4, "name": "Pandian Hotel, Ellis Nagar",   "status": true },
  { "sno": 5, "name": "Velan Store",                  "status": true },
  { "sno": 6, "name": "Heaven's Park",                "status": true }
];

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
  var defaultData = (storageKey === ESU_STORE.VEG_KEY) ? DEFAULT_VEGETABLES : DEFAULT_CUSTOMERS;
  return esuFetchJson(jsonPath).then(function (serverData) {
    var local = esuReadLocal(storageKey);
    if (local && Array.isArray(local) && local.length) {
      if (storageKey === ESU_STORE.VEG_KEY) {
        var hasSmallBox = local.some(function (v) {
          return (v.name_en || '').toLowerCase().indexOf('small box') > -1 || (v.name_ta || '').indexOf('சின்ன பாக்ஸ்') > -1;
        });
        var hasSmallOnion = local.some(function (v) {
          return (v.name_en || '').toLowerCase().indexOf('small onion') > -1 || (v.name_ta || '').indexOf('சின்ன வெங்காயம்') > -1;
        });
        if (!hasSmallBox || !hasSmallOnion || local.length < serverData.length) {
          var updated = [];
          serverData.forEach(function (sItem) {
            var match = local.find(function (l) {
              return (l.name_en && l.name_en.toLowerCase().trim() === sItem.name_en.toLowerCase().trim()) ||
                     (l.name_ta && l.name_ta.toLowerCase().trim() === sItem.name_ta.toLowerCase().trim());
            });
            updated.push(match || sItem);
          });
          try { window.localStorage.setItem(storageKey, JSON.stringify(updated)); } catch (e) {}
          return updated;
        }
      }
      return local;
    }
    return serverData;
  }).catch(function () {
    var local = esuReadLocal(storageKey);
    return (local && Array.isArray(local) && local.length) ? local : defaultData;
  });
}

function formatVegUnit(unit) {
  var u = (unit || 'kg').trim();
  if (/^\d/.test(u)) return u;
  return '1 ' + u;
}

function formatVegPrice(item) {
  var p = item.price;
  if (p !== undefined && p !== null && p !== '') {
    return '₹' + p;
  }
  return 'Market Rate';
}

document.addEventListener('DOMContentLoaded', function () {

  /* Render Vegetables with Live Search Filter */
  var vegGrid = document.querySelector('.veg-grid');
  if (vegGrid) {
    esuLoadData(ESU_STORE.VEG_KEY, 'data/vegetables.json').then(function (vegetables) {
      
      var active = vegetables.filter(function (v) { 
        return v.status === true || v.status === undefined || v.status === 'true'; 
      });

      if (!active.length) {
        active = DEFAULT_VEGETABLES;
      }

      // Base search and container HTML
      vegGrid.innerHTML = '' +
        '<div class="veg-search-bar">' +
          '<i class="bi bi-search veg-search-icon"></i>' +
          '<input type="text" id="userVegSearch" class="veg-search-input" placeholder="Search vegetable... (e.g. தக்காளி, Tomato)" autocomplete="off">' +
          '<button type="button" id="userVegClear" class="veg-search-clear" aria-label="Clear search"><i class="bi bi-x-circle-fill"></i></button>' +
        '</div>' +
        '<div class="veg-status-info" id="vegStatusInfo">Showing all ' + active.length + ' varieties</div>' +
        '<div id="vegListContainer"></div>';

      var listContainer = document.getElementById('vegListContainer');
      var searchInput = document.getElementById('userVegSearch');
      var clearBtn = document.getElementById('userVegClear');
      var statusInfo = document.getElementById('vegStatusInfo');

      function renderItems(items, query) {
        if (!items.length) {
          listContainer.innerHTML = '' +
            '<div class="veg-empty-state">' +
              '<i class="bi bi-search"></i>' +
              '<p>No vegetables found matching "<strong>' + (query || '') + '</strong>".<br>Call us at <a href="tel:9025990230" class="text-success fw-bold">90259 90230</a> to check availability.</p>' +
            '</div>';
          statusInfo.textContent = '0 varieties found';
          return;
        }

        if (query) {
          statusInfo.textContent = 'Found ' + items.length + ' of ' + active.length + ' varieties';
        } else {
          statusInfo.textContent = 'Showing all ' + active.length + ' varieties';
        }

        /* Desktop Table View */
        var tableHtml = '' +
          '<div class="veg-table-wrap">' +
            '<table class="table veg-table">' +
              '<thead>' +
                '<tr>' +
                  '<th style="width: 70px;">S.No</th>' +
                  '<th>Tamil Name</th>' +
                  '<th>English Name</th>' +
                  '<th>Unit</th>' +
                  '<th>Price</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                items.map(function (v, idx) {
                  var sno = v.sno || (idx + 1);
                  var priceText = formatVegPrice(v);
                  return '<tr>' +
                    '<td>' + sno + '</td>' +
                    '<td class="veg-ta">' + (v.name_ta || '-') + '</td>' +
                    '<td class="veg-en">' + (v.name_en || '-') + '</td>' +
                    '<td class="veg-unit-cell">' + formatVegUnit(v.unit) + '</td>' +
                    '<td class="veg-price-cell">' + priceText + '</td>' +
                  '</tr>';
                }).join('') +
              '</tbody>' +
            '</table>' +
          '</div>';

        /* Mobile Card View */
        var cardsHtml = '' +
          '<div class="veg-cards-mobile">' +
            items.map(function (v, idx) {
              var sno = v.sno || (idx + 1);
              var priceText = formatVegPrice(v);
              return '<div class="veg-card-item">' +
                '<div class="veg-card-sno">' + sno + '</div>' +
                '<div class="veg-card-info">' +
                  '<span class="veg-card-en">' + (v.name_en || '-') + '</span>' +
                  '<span class="veg-card-ta">' + (v.name_ta || '') + '</span>' +
                '</div>' +
                '<div class="veg-card-price-wrap">' +
                  '<span class="veg-card-price">' + priceText + '</span>' +
                  '<span class="veg-card-unit">/ ' + (v.unit || 'kg') + '</span>' +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>';

        listContainer.innerHTML = tableHtml + cardsHtml;
      }

      // Initial render
      renderItems(active, '');

      // Search event listener
      if (searchInput) {
        searchInput.addEventListener('input', function () {
          var val = this.value.trim().toLowerCase();
          if (clearBtn) {
            clearBtn.style.display = val ? 'block' : 'none';
          }
          if (!val) {
            renderItems(active, '');
            return;
          }
          var filtered = active.filter(function (v) {
            var en = (v.name_en || '').toLowerCase();
            var ta = (v.name_ta || '').toLowerCase();
            return en.indexOf(val) > -1 || ta.indexOf(val) > -1;
          });
          renderItems(filtered, val);
        });
      }

      // Clear button listener
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
          }
          clearBtn.style.display = 'none';
          renderItems(active, '');
        });
      }
    });
  }

  /* Render Customers Marquee */
  var marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    esuLoadData(ESU_STORE.CUST_KEY, 'data/customers.json').then(function (customers) {
      var active = customers.filter(function (c) { return c.status === true || c.status === undefined; });
      if (!active.length) active = DEFAULT_CUSTOMERS;
      var itemHtml = active.map(function (c) {
        return '<div class="marquee-item"><i class="bi ' + esuCustomerIcon(c.name) + '"></i><span>' + c.name + '</span></div>';
      }).join('');
      // Duplicate for seamless infinite marquee loop
      marqueeTrack.innerHTML = itemHtml + itemHtml + itemHtml;
    });
  }

  /* Sticky Header Scroll Effect */
  var navbar = document.querySelector('.site-header .navbar');
  var onScroll = function () {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Auto-close Mobile Nav on Link Click */
  var navLinks = document.querySelectorAll('#mainNav .nav-link, #mainNav .btn-tag');
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
    window.AOS.init({ duration: 800, once: true, offset: 40 });
  }
});
