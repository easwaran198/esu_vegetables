/* =========================================================
   ESU VEGETABLES — script.js
   Populates the vegetable grid and customer marquee from data
   arrays (single source of truth, easy to edit/extend), plus
   small UI behaviours: sticky-nav shadow, footer year, AOS init.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Data ---------- */
  var vegetables = [
    'Tomato', 'Potato', 'Onion', 'Brinjal', 'Carrot', 'Beetroot',
    'Cabbage', 'Cauliflower', 'Lady Finger', 'Drumstick', 'Bitter Gourd',
    'Bottle Gourd', 'Ridge Gourd', 'Snake Gourd', 'Pumpkin', 'Ash Gourd',
    'Green Chilli', 'Capsicum', 'Beans', 'Cluster Beans', 'Broad Beans',
    'Peas', 'Radish', 'Turnip', 'Spinach', 'Coriander', 'Mint',
    'Curry Leaves', 'Fenugreek Leaves', 'Banana Flower', 'Banana Stem',
    'Raw Banana', 'Sweet Potato', 'Garlic', 'Ginger', 'Lemon',
    'Ivy Gourd', 'Cucumber', 'Chow Chow', 'Mushroom'
  ];

  var customers = [
    { name: 'Madurai Amutha Hotel', icon: 'bi-building' },
    { name: 'SivaHari Catering', icon: 'bi-egg-fried' },
    { name: 'Aaharam Catering', icon: 'bi-egg-fried' },
    { name: 'Pandian Hotel, Ellis Nagar', icon: 'bi-building' },
    { name: 'Velan Store', icon: 'bi-shop' },
    { name: 'Heaven’s Park', icon: 'bi-tree-fill' }
];

  /* ---------- Render vegetables grid ---------- */
  var vegGrid = document.querySelector('.veg-grid');
  if (vegGrid) {
    var vegHtml = vegetables.map(function (name) {
      return '<div class="veg-tag"><i class="bi bi-leaf-fill"></i>' + name + '</div>';
    }).join('');
    vegGrid.innerHTML = vegHtml;
  }

  /* ---------- Render customer marquee (duplicated for a seamless loop) ---------- */
  var marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    var itemHtml = customers.map(function (c) {
      return '<div class="marquee-item"><i class="bi ' + c.icon + '"></i>' + c.name + '</div>';
    }).join('');
    // duplicate the sequence once so the CSS translateX(-50%) loop is seamless
    marqueeTrack.innerHTML = itemHtml + itemHtml;
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
