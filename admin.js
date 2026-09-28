/* =========================================================
   ESU VEGETABLES — admin.js
   Vanilla JS + JSON CRUD for:
     - Vegetables: sno, name_ta, name_en, unit, price, status
     - Customers:  sno, name, status
   The JSON files on the server (data/*.json) are the source of
   truth. On load the admin panel fetches them fresh, so edits
   made elsewhere / uploaded are always reflected. In-browser
   edits are kept in localStorage (esu_vegetables / esu_customers)
   for the current session and are made permanent with "Export
   JSON" -> upload the downloaded file to the server/repo.
   localStorage is only used as an offline fallback when the
   fetch fails.
   ========================================================= */

var LS = {
  PASS: 'esu_admin_pass',
  VEG: 'esu_vegetables',
  CUST: 'esu_customers'
};
var SESSION_FLAG = 'esu_admin_logged_in';
var DEFAULT_PASS = 'esu1234';

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

var state = {
  vegetables: [],
  customers: [],
  vegFilter: '',
  custFilter: ''
};

/* ---------------------------------------------------------
   Helpers
   --------------------------------------------------------- */
function saveVeg() { localStorage.setItem(LS.VEG, JSON.stringify(state.vegetables)); }
function saveCust() { localStorage.setItem(LS.CUST, JSON.stringify(state.customers)); }

function renumber(list) {
  list.forEach(function (item, i) { item.sno = i + 1; });
  return list;
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toast(message, isError) {
  var wrap = document.getElementById('adminToast');
  var item = document.createElement('div');
  item.className = 'admin-toast-item' + (isError ? ' error' : '');
  item.innerHTML = '<i class="bi ' + (isError ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill') + '"></i> ' + escapeHtml(message);
  wrap.appendChild(item);
  setTimeout(function () {
    item.style.opacity = '0';
    setTimeout(function () { item.remove(); }, 250);
  }, 2600);
}

function downloadJson(filename, data) {
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------
   Auth
   --------------------------------------------------------- */
function ensurePasswordSeed() {
  if (!localStorage.getItem(LS.PASS)) localStorage.setItem(LS.PASS, DEFAULT_PASS);
}

function showApp() {
  document.getElementById('loginGate').classList.add('d-none');
  document.getElementById('adminApp').classList.remove('d-none');
  initData();
}

function attemptLogin() {
  var input = document.getElementById('loginPassword');
  var stored = localStorage.getItem(LS.PASS) || DEFAULT_PASS;
  if (input.value === stored) {
    sessionStorage.setItem(SESSION_FLAG, '1');
    document.getElementById('loginError').classList.add('d-none');
    showApp();
  } else {
    document.getElementById('loginError').classList.remove('d-none');
  }
}

function logout() {
  sessionStorage.removeItem(SESSION_FLAG);
  window.location.reload();
}

function checkAndMigrateStorage() {
  try {
    var raw = localStorage.getItem(LS.VEG);
    if (!raw) {
      localStorage.setItem(LS.VEG, JSON.stringify(DEFAULT_VEGETABLES));
      return DEFAULT_VEGETABLES;
    }
    var list = JSON.parse(raw);
    if (!Array.isArray(list) || !list.length) {
      localStorage.setItem(LS.VEG, JSON.stringify(DEFAULT_VEGETABLES));
      return DEFAULT_VEGETABLES;
    }
    var hasSmallBox = list.some(function (v) {
      return (v.name_en || '').toLowerCase().indexOf('small box') > -1 || (v.name_ta || '').indexOf('சின்ன பாக்ஸ்') > -1;
    });
    var hasSmallOnion = list.some(function (v) {
      return (v.name_en || '').toLowerCase().indexOf('small onion') > -1 || (v.name_ta || '').indexOf('சின்ன வெங்காயம்') > -1;
    });
    if (!hasSmallBox || !hasSmallOnion || list.length < DEFAULT_VEGETABLES.length) {
      var updated = [];
      DEFAULT_VEGETABLES.forEach(function (defItem) {
        var match = list.find(function (it) {
          return (it.name_en && it.name_en.toLowerCase().trim() === defItem.name_en.toLowerCase().trim()) ||
                 (it.name_ta && it.name_ta.toLowerCase().trim() === defItem.name_ta.toLowerCase().trim());
        });
        updated.push(match ? JSON.parse(JSON.stringify(match)) : JSON.parse(JSON.stringify(defItem)));
      });
      renumber(updated);
      localStorage.setItem(LS.VEG, JSON.stringify(updated));
      return updated;
    }
    return list;
  } catch (e) {
    localStorage.setItem(LS.VEG, JSON.stringify(DEFAULT_VEGETABLES));
    return DEFAULT_VEGETABLES;
  }
}

/* ---------------------------------------------------------
   Data loading (prioritize saved localStorage so edits persist on refresh)
   --------------------------------------------------------- */
function initData() {
  // Synchronously migrate and render immediately
  state.vegetables = checkAndMigrateStorage();
  renderVegTable();

  function loadData(path, key) {
    return fetch(path, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load ' + path);
        return r.json();
      })
      .then(function (data) {
        if (key === LS.VEG) {
          var updated = checkAndMigrateStorage();
          return updated;
        }
        var raw = localStorage.getItem(key);
        if (raw) {
          try {
            var parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) return parsed;
          } catch (e) {}
        }
        if (Array.isArray(data) && data.length) {
          localStorage.setItem(key, JSON.stringify(data));
        }
        return data;
      })
      .catch(function () {
        var raw = localStorage.getItem(key);
        if (raw) {
          try {
            var p = JSON.parse(raw);
            if (Array.isArray(p) && p.length) return p;
          } catch (e) {}
        }
        return (key === LS.VEG) ? DEFAULT_VEGETABLES : [];
      });
  }

  Promise.all([
    loadData('data/vegetables.json', LS.VEG),
    loadData('data/customers.json', LS.CUST)
  ]).then(function (results) {
    state.vegetables = results[0] || state.vegetables;
    state.customers = results[1] || [];
    renderVegTable();
    renderCustTable();
  });
}

/* ---------------------------------------------------------
   VEGETABLES — render
   --------------------------------------------------------- */
function renderVegTable() {
  var tbody = document.getElementById('vegTableBody');
  var emptyMsg = document.getElementById('vegEmptyMsg');
  var filter = state.vegFilter.trim().toLowerCase();

  var rows = state.vegetables.filter(function (v) {
    if (!filter) return true;
    return (v.name_en || '').toLowerCase().indexOf(filter) > -1 ||
           (v.name_ta || '').toLowerCase().indexOf(filter) > -1;
  });

  document.getElementById('vegCount').textContent = state.vegetables.length + ' item' + (state.vegetables.length === 1 ? '' : 's');

  if (!rows.length) {
    tbody.innerHTML = '';
    emptyMsg.classList.remove('d-none');
    return;
  }
  emptyMsg.classList.add('d-none');

  tbody.innerHTML = rows.map(function (v) {
    var realIndex = state.vegetables.indexOf(v);
    return '' +
      '<tr>' +
        '<td>' + v.sno + '</td>' +
        '<td class="ta-cell">' + escapeHtml(v.name_ta || '&mdash;') + '</td>' +
        '<td>' + escapeHtml(v.name_en) + '</td>' +
        '<td>' + escapeHtml(v.unit || 'kg') + '</td>' +
        '<td>&#8377;' + (v.price != null ? v.price : 0) + '</td>' +
        '<td class="text-center">' +
          '<div class="form-check form-switch d-flex justify-content-center">' +
            '<input class="form-check-input veg-status-toggle" type="checkbox" data-index="' + realIndex + '" ' + (v.status ? 'checked' : '') + '>' +
          '</div>' +
        '</td>' +
        '<td>' +
          '<div class="row-actions">' +
            '<button class="edit-veg-btn" data-index="' + realIndex + '" title="Edit"><i class="bi bi-pencil-fill"></i></button>' +
            '<button class="delete-veg-btn delete-btn" data-index="' + realIndex + '" title="Delete"><i class="bi bi-trash-fill"></i></button>' +
          '</div>' +
        '</td>' +
      '</tr>';
  }).join('');

  document.querySelectorAll('.veg-status-toggle').forEach(function (el) {
    el.addEventListener('change', function () {
      var i = parseInt(this.dataset.index, 10);
      state.vegetables[i].status = this.checked;
      saveVeg();
      toast(state.vegetables[i].name_en + (this.checked ? ' is now active.' : ' is now hidden.'));
    });
  });
  document.querySelectorAll('.edit-veg-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { openVegModal(parseInt(this.dataset.index, 10)); });
  });
  document.querySelectorAll('.delete-veg-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { deleteVeg(parseInt(this.dataset.index, 10)); });
  });
}

/* ---------------------------------------------------------
   VEGETABLES — CRUD & Unit Management
   --------------------------------------------------------- */
var UNIT_STORE_KEY = 'esu_custom_units';

function getSavedCustomUnits() {
  try {
    var raw = localStorage.getItem(UNIT_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomUnit(unitName) {
  var u = (unitName || '').trim();
  if (!u || u === '__add_new__') return;
  var list = getSavedCustomUnits();
  var standard = ['kg', 'gram', 'piece', 'pocket', 'box', 'kattu', 'mudi'];
  var exists = list.some(function (item) { return item.toLowerCase() === u.toLowerCase(); });
  if (!exists && standard.indexOf(u.toLowerCase()) === -1) {
    list.push(u);
    localStorage.setItem(UNIT_STORE_KEY, JSON.stringify(list));
  }
}

function refreshUnitDropdown(selectedUnit) {
  var unitSelect = document.getElementById('vegUnit');
  var customGroup = document.getElementById('customUnitsGroup');
  if (!unitSelect || !customGroup) return;

  var saved = getSavedCustomUnits();
  if (state && state.vegetables) {
    state.vegetables.forEach(function (v) {
      if (v.unit) {
        var u = v.unit.trim();
        var standard = ['kg', 'gram', 'piece', 'pocket', 'box', 'kattu', 'mudi'];
        var inSaved = saved.some(function (item) { return item.toLowerCase() === u.toLowerCase(); });
        if (standard.indexOf(u.toLowerCase()) === -1 && !inSaved) {
          saved.push(u);
        }
      }
    });
  }

  if (saved.length) {
    customGroup.classList.remove('d-none');
    customGroup.innerHTML = saved.map(function (u) {
      return '<option value="' + u + '">' + u + '</option>';
    }).join('');
  } else {
    customGroup.classList.add('d-none');
    customGroup.innerHTML = '';
  }

  if (selectedUnit) {
    var matched = false;
    for (var i = 0; i < unitSelect.options.length; i++) {
      if (unitSelect.options[i].value.toLowerCase() === selectedUnit.toLowerCase()) {
        unitSelect.value = unitSelect.options[i].value;
        matched = true;
        break;
      }
    }
    if (!matched) {
      saveCustomUnit(selectedUnit);
      var newOpt = document.createElement('option');
      newOpt.value = selectedUnit;
      newOpt.textContent = selectedUnit;
      customGroup.appendChild(newOpt);
      customGroup.classList.remove('d-none');
      unitSelect.value = selectedUnit;
    }
  }
}

var vegModal;
function openVegModal(index) {
  document.getElementById('vegFormError').classList.add('d-none');
  document.getElementById('vegEditIndex').value = index;
  var unitSelect = document.getElementById('vegUnit');
  var customWrap = document.getElementById('vegCustomUnitWrap');
  var customInput = document.getElementById('vegCustomUnit');

  if (index > -1) {
    var v = state.vegetables[index];
    document.getElementById('vegModalTitle').textContent = 'Edit Vegetable';
    document.getElementById('vegNameTa').value = v.name_ta || '';
    document.getElementById('vegNameEn').value = v.name_en || '';
    document.getElementById('vegPrice').value = v.price != null ? v.price : '';
    document.getElementById('vegStatus').checked = !!v.status;
    refreshUnitDropdown(v.unit || 'Kg');
    if (customWrap) customWrap.classList.add('d-none');
    if (customInput) customInput.value = '';
  } else {
    document.getElementById('vegModalTitle').textContent = 'Add Vegetable';
    document.getElementById('vegNameTa').value = '';
    document.getElementById('vegNameEn').value = '';
    refreshUnitDropdown('Kg');
    if (unitSelect) unitSelect.value = 'Kg';
    if (customWrap) customWrap.classList.add('d-none');
    if (customInput) customInput.value = '';
    document.getElementById('vegPrice').value = '';
    document.getElementById('vegStatus').checked = true;
  }
  vegModal.show();
}

function saveVegFromModal() {
  var index = parseInt(document.getElementById('vegEditIndex').value, 10);
  var nameEn = document.getElementById('vegNameEn').value.trim();
  if (!nameEn) {
    document.getElementById('vegFormError').classList.remove('d-none');
    return;
  }
  var unitSelect = document.getElementById('vegUnit');
  var chosenUnit = unitSelect ? unitSelect.value : 'Kg';
  if (chosenUnit === '__add_new__') {
    var customInput = document.getElementById('vegCustomUnit');
    var typedUnit = customInput ? customInput.value.trim() : '';
    if (typedUnit) {
      chosenUnit = typedUnit;
      saveCustomUnit(typedUnit);
      refreshUnitDropdown(chosenUnit);
    } else {
      chosenUnit = 'Kg';
    }
  }

  var record = {
    sno: index > -1 ? state.vegetables[index].sno : state.vegetables.length + 1,
    name_ta: document.getElementById('vegNameTa').value.trim(),
    name_en: nameEn,
    unit: chosenUnit,
    price: parseFloat(document.getElementById('vegPrice').value) || 0,
    status: document.getElementById('vegStatus').checked
  };
  if (index > -1) {
    state.vegetables[index] = record;
    toast('Vegetable updated.');
  } else {
    state.vegetables.push(record);
    toast('Vegetable added.');
  }
  renumber(state.vegetables);
  saveVeg();
  renderVegTable();
  vegModal.hide();
}

function deleteVeg(index) {
  var v = state.vegetables[index];
  if (!confirm('Delete "' + v.name_en + '"? This cannot be undone.')) return;
  state.vegetables.splice(index, 1);
  renumber(state.vegetables);
  saveVeg();
  renderVegTable();
  toast('Vegetable deleted.');
}

/* ---------------------------------------------------------
   CUSTOMERS — render
   --------------------------------------------------------- */
function renderCustTable() {
  var tbody = document.getElementById('custTableBody');
  var emptyMsg = document.getElementById('custEmptyMsg');
  var filter = state.custFilter.trim().toLowerCase();

  var rows = state.customers.filter(function (c) {
    if (!filter) return true;
    return (c.name || '').toLowerCase().indexOf(filter) > -1;
  });

  document.getElementById('custCount').textContent = state.customers.length + ' item' + (state.customers.length === 1 ? '' : 's');

  if (!rows.length) {
    tbody.innerHTML = '';
    emptyMsg.classList.remove('d-none');
    return;
  }
  emptyMsg.classList.add('d-none');

  tbody.innerHTML = rows.map(function (c) {
    var realIndex = state.customers.indexOf(c);
    return '' +
      '<tr>' +
        '<td>' + c.sno + '</td>' +
        '<td>' + escapeHtml(c.name) + '</td>' +
        '<td class="text-center">' +
          '<div class="form-check form-switch d-flex justify-content-center">' +
            '<input class="form-check-input cust-status-toggle" type="checkbox" data-index="' + realIndex + '" ' + (c.status ? 'checked' : '') + '>' +
          '</div>' +
        '</td>' +
        '<td>' +
          '<div class="row-actions">' +
            '<button class="edit-cust-btn" data-index="' + realIndex + '" title="Edit"><i class="bi bi-pencil-fill"></i></button>' +
            '<button class="delete-cust-btn delete-btn" data-index="' + realIndex + '" title="Delete"><i class="bi bi-trash-fill"></i></button>' +
          '</div>' +
        '</td>' +
      '</tr>';
  }).join('');

  document.querySelectorAll('.cust-status-toggle').forEach(function (el) {
    el.addEventListener('change', function () {
      var i = parseInt(this.dataset.index, 10);
      state.customers[i].status = this.checked;
      saveCust();
      toast(state.customers[i].name + (this.checked ? ' is now active.' : ' is now hidden.'));
    });
  });
  document.querySelectorAll('.edit-cust-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { openCustModal(parseInt(this.dataset.index, 10)); });
  });
  document.querySelectorAll('.delete-cust-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { deleteCust(parseInt(this.dataset.index, 10)); });
  });
}

/* ---------------------------------------------------------
   CUSTOMERS — CRUD
   --------------------------------------------------------- */
var custModal;
function openCustModal(index) {
  document.getElementById('custFormError').classList.add('d-none');
  document.getElementById('custEditIndex').value = index;
  if (index > -1) {
    var c = state.customers[index];
    document.getElementById('custModalTitle').textContent = 'Edit Customer';
    document.getElementById('custName').value = c.name || '';
    document.getElementById('custStatus').checked = !!c.status;
  } else {
    document.getElementById('custModalTitle').textContent = 'Add Customer';
    document.getElementById('custName').value = '';
    document.getElementById('custStatus').checked = true;
  }
  custModal.show();
}

function saveCustFromModal() {
  var index = parseInt(document.getElementById('custEditIndex').value, 10);
  var name = document.getElementById('custName').value.trim();
  if (!name) {
    document.getElementById('custFormError').classList.remove('d-none');
    return;
  }
  var record = {
    sno: index > -1 ? state.customers[index].sno : state.customers.length + 1,
    name: name,
    status: document.getElementById('custStatus').checked
  };
  if (index > -1) {
    state.customers[index] = record;
    toast('Customer updated.');
  } else {
    state.customers.push(record);
    toast('Customer added.');
  }
  renumber(state.customers);
  saveCust();
  renderCustTable();
  custModal.hide();
}

function deleteCust(index) {
  var c = state.customers[index];
  if (!confirm('Delete "' + c.name + '"? This cannot be undone.')) return;
  state.customers.splice(index, 1);
  renumber(state.customers);
  saveCust();
  renderCustTable();
  toast('Customer deleted.');
}

/* ---------------------------------------------------------
   Import / Export / Reset
   --------------------------------------------------------- */
function handleImport(file, type) {
  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error('not an array');
      if (type === 'veg') {
        state.vegetables = renumber(data.map(function (d) {
          return { sno: 0, name_ta: d.name_ta || '', name_en: d.name_en || '', unit: d.unit || 'kg', price: d.price || 0, status: !!d.status };
        }));
        saveVeg();
        renderVegTable();
      } else {
        state.customers = renumber(data.map(function (d) {
          return { sno: 0, name: d.name || '', status: !!d.status };
        }));
        saveCust();
        renderCustTable();
      }
      toast('Import successful.');
    } catch (err) {
      toast('Import failed: invalid JSON file.', true);
    }
  };
  reader.readAsText(file);
}

function resetVeg() {
  if (!confirm('Reset vegetables to the original seed data? Your edits will be replaced with fresh catalog.')) return;
  state.vegetables = JSON.parse(JSON.stringify(DEFAULT_VEGETABLES));
  saveVeg();
  renderVegTable();
  fetch('data/vegetables.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (data) {
    if (Array.isArray(data) && data.length) {
      state.vegetables = data;
      saveVeg();
      renderVegTable();
    }
    toast('Vegetables reset to seed data.');
  }).catch(function () {
    toast('Vegetables reset to default list.');
  });
}

function resetCust() {
  if (!confirm('Reset customers to the original seed data? Your edits will be lost.')) return;
  fetch('data/customers.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (data) {
    state.customers = data;
    saveCust();
    renderCustTable();
    toast('Customers reset to seed data.');
  });
}

/* ---------------------------------------------------------
   Change Password
   --------------------------------------------------------- */
var passModal;
function updatePassword() {
  var current = document.getElementById('currentPass').value;
  var next = document.getElementById('newPass').value;
  var stored = localStorage.getItem(LS.PASS) || DEFAULT_PASS;
  var errEl = document.getElementById('passFormError');
  var okEl = document.getElementById('passFormSuccess');
  errEl.classList.add('d-none'); okEl.classList.add('d-none');

  if (current !== stored) {
    errEl.classList.remove('d-none');
    return;
  }
  if (!next || next.length < 4) {
    errEl.textContent = 'New password must be at least 4 characters.';
    errEl.classList.remove('d-none');
    return;
  }
  localStorage.setItem(LS.PASS, next);
  okEl.classList.remove('d-none');
  document.getElementById('currentPass').value = '';
  document.getElementById('newPass').value = '';
  toast('Password updated.');
}

/* ---------------------------------------------------------
   Init
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  ensurePasswordSeed();

  vegModal = new bootstrap.Modal(document.getElementById('vegModal'));
  custModal = new bootstrap.Modal(document.getElementById('custModal'));
  passModal = new bootstrap.Modal(document.getElementById('passModal'));

  if (sessionStorage.getItem(SESSION_FLAG) === '1') {
    showApp();
  }

  document.getElementById('loginBtn').addEventListener('click', attemptLogin);
  document.getElementById('loginPassword').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') attemptLogin();
  });
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('changePassBtn').addEventListener('click', function () {
    document.getElementById('passFormError').classList.add('d-none');
    document.getElementById('passFormSuccess').classList.add('d-none');
    document.getElementById('currentPass').value = '';
    document.getElementById('newPass').value = '';
    passModal.show();
  });
  document.getElementById('passSaveBtn').addEventListener('click', updatePassword);

  /* Vegetables toolbar */
  document.getElementById('vegAddBtn').addEventListener('click', function () { openVegModal(-1); });
  document.getElementById('vegSaveBtn').addEventListener('click', saveVegFromModal);
  var vegUnitSelect = document.getElementById('vegUnit');
  if (vegUnitSelect) {
    vegUnitSelect.addEventListener('change', function () {
      var customWrap = document.getElementById('vegCustomUnitWrap');
      var customInput = document.getElementById('vegCustomUnit');
      if (this.value === '__add_new__') {
        if (customWrap) customWrap.classList.remove('d-none');
        if (customInput) {
          customInput.value = '';
          customInput.focus();
        }
      } else {
        if (customWrap) customWrap.classList.add('d-none');
      }
    });
  }

  var addCustomUnitBtn = document.getElementById('vegAddCustomUnitBtn');
  if (addCustomUnitBtn) {
    addCustomUnitBtn.addEventListener('click', function () {
      var customInput = document.getElementById('vegCustomUnit');
      var customWrap = document.getElementById('vegCustomUnitWrap');
      var val = customInput ? customInput.value.trim() : '';
      if (!val) {
        alert('Please enter a unit name (எ.கா: Bag, Litre).');
        return;
      }
      saveCustomUnit(val);
      refreshUnitDropdown(val);
      if (customWrap) customWrap.classList.add('d-none');
      if (customInput) customInput.value = '';
      toast('Unit "' + val + '" added to list.');
    });
  }
  document.getElementById('vegSearch').addEventListener('input', function () {
    state.vegFilter = this.value; renderVegTable();
  });
  document.getElementById('vegExportBtn').addEventListener('click', function () {
    downloadJson('vegetables.json', state.vegetables);
  });
  document.getElementById('vegImportInput').addEventListener('change', function () {
    if (this.files[0]) handleImport(this.files[0], 'veg');
    this.value = '';
  });
  document.getElementById('vegResetBtn').addEventListener('click', resetVeg);

  /* Customers toolbar */
  document.getElementById('custAddBtn').addEventListener('click', function () { openCustModal(-1); });
  document.getElementById('custSaveBtn').addEventListener('click', saveCustFromModal);
  document.getElementById('custSearch').addEventListener('input', function () {
    state.custFilter = this.value; renderCustTable();
  });
  document.getElementById('custExportBtn').addEventListener('click', function () {
    downloadJson('customers.json', state.customers);
  });
  document.getElementById('custImportInput').addEventListener('change', function () {
    if (this.files[0]) handleImport(this.files[0], 'cust');
    this.value = '';
  });
  document.getElementById('custResetBtn').addEventListener('click', resetCust);
});
