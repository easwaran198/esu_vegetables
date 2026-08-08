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

/* ---------------------------------------------------------
   Data loading (fetch server JSON fresh; localStorage fallback)
   --------------------------------------------------------- */
function initData() {
  function loadJson(path, key) {
    return fetch(path, { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .catch(function () {
        var raw = localStorage.getItem(key);
        if (!raw) return [];
        try { return JSON.parse(raw); } catch (e) { return []; }
      });
  }

  Promise.all([
    loadJson('data/vegetables.json', LS.VEG),
    loadJson('data/customers.json', LS.CUST)
  ]).then(function (results) {
    state.vegetables = results[0] || [];
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
   VEGETABLES — CRUD
   --------------------------------------------------------- */
var vegModal;
function openVegModal(index) {
  document.getElementById('vegFormError').classList.add('d-none');
  document.getElementById('vegEditIndex').value = index;
  if (index > -1) {
    var v = state.vegetables[index];
    document.getElementById('vegModalTitle').textContent = 'Edit Vegetable';
    document.getElementById('vegNameTa').value = v.name_ta || '';
    document.getElementById('vegNameEn').value = v.name_en || '';
    document.getElementById('vegUnit').value = v.unit || 'kg';
    document.getElementById('vegPrice').value = v.price != null ? v.price : '';
    document.getElementById('vegStatus').checked = !!v.status;
  } else {
    document.getElementById('vegModalTitle').textContent = 'Add Vegetable';
    document.getElementById('vegNameTa').value = '';
    document.getElementById('vegNameEn').value = '';
    document.getElementById('vegUnit').value = 'kg';
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
  var record = {
    sno: index > -1 ? state.vegetables[index].sno : state.vegetables.length + 1,
    name_ta: document.getElementById('vegNameTa').value.trim(),
    name_en: nameEn,
    unit: document.getElementById('vegUnit').value,
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
  if (!confirm('Reset vegetables to the original seed data? Your edits will be lost.')) return;
  fetch('data/vegetables.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (data) {
    state.vegetables = data;
    saveVeg();
    renderVegTable();
    toast('Vegetables reset to seed data.');
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
