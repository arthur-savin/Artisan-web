/**
 * Artisan-Web — injection header / footer + navigation (dropdown, mobile, scroll)
 * Chemins : détection automatique selon la présence de /pages/ dans l’URL.
 */
(function () {
  "use strict";

  var TRADES = [
    { label: "Électricien", file: "electricien.html" },
    { label: "Plombier", file: "plombier.html" },
    { label: "Menuisier", file: "menuisier.html" },
    { label: "Maçon", file: "macon.html" },
    { label: "Peintre", file: "peintre-batiment.html" },
    { label: "Couvreur", file: "couvreur.html" },
    { label: "Façadier", file: "facadier.html" },
    { label: "Serrurier", file: "serrurier.html" },
    { label: "Paysagiste", file: "paysagiste.html" },
    { label: "Rénovation", file: "renovation-maison.html" },
  ];

  function rootPrefix() {
    var p = (location.pathname || "").replace(/\\/g, "/");
    /* Insensible à la casse (hébergeurs / dossiers « Pages » / chemins Windows) */
    return p.toLowerCase().indexOf("/pages/") !== -1 ? ".." : ".";
  }

  function pilierHref(file) {
    var r = rootPrefix();
    return r === ".." ? file : "pages/" + file;
  }

  function homeHref() {
    return rootPrefix() + "/index.html";
  }

  /** Logo principal (PNG 500×500, composition horizontale) — même fichier partout pour le cache navigateur */
  function logoSrc() {
    return rootPrefix() + "/images/brand/logo-artisan-web.png";
  }

  function realisationsHref(hash) {
    var base = pilierHref("realisations.html");
    return hash ? base + hash : base;
  }

  function legalHref() {
    return pilierHref("mentions-legales.html");
  }

  function maquetteHref() {
    return pilierHref("maquette-gratuite.html");
  }

  function escapeHtml(text) {
    var d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  function tradeListHtml() {
    return TRADES.map(function (t) {
      return (
        '<li role="none"><a role="menuitem" href="' +
        escapeHtml(pilierHref(t.file)) +
        '">' +
        escapeHtml(t.label) +
        "</a></li>"
      );
    }).join("");
  }

  function footerTradeLinksHtml() {
    return TRADES.map(function (t) {
      return (
        '<li><a href="' +
        escapeHtml(pilierHref(t.file)) +
        '">' +
        escapeHtml(t.label) +
        "</a></li>"
      );
    }).join("");
  }

  function renderHeader() {
    var h = homeHref();
    var maquette = maquetteHref();
    return (
      '<header class="aw-site-header" role="banner">' +
      /* Fond vitré séparé : si backdrop-filter est sur le <header>, il crée un bloc de contenu
       * qui piège les descendants position:fixed (le menu mobile) dans la barre ~3.5rem. */
      '<div class="aw-site-header__bg" aria-hidden="true"></div>' +
      /* Backdrop avant la barre : même z-index, le flou reste sous les liens du panneau (ordre de peinture) */
      '<div class="aw-site-header__mobile-backdrop" id="aw-nav-backdrop" hidden aria-hidden="true"></div>' +
      '<div class="aw-site-header__inner">' +
      '<a class="aw-site-header__logo" href="' +
      escapeHtml(h) +
      '" aria-label="Artisan-Web — accueil">' +
      '<img class="aw-site-header__logo-img" src="' +
      escapeHtml(logoSrc()) +
      '" width="500" height="500" alt="" decoding="async" fetchpriority="high" />' +
      "</a>" +
      '<nav class="aw-site-header__nav" id="aw-primary-nav" aria-label="Navigation principale">' +
      '<div class="aw-site-header__nav-core">' +
      '<div class="aw-site-header__dropdown" data-aw-dropdown>' +
      '<button type="button" class="aw-site-header__drop-trigger" id="aw-trades-trigger" aria-expanded="false" aria-haspopup="true" aria-controls="aw-trades-list">Métiers</button>' +
      '<ul class="aw-site-header__drop-panel" id="aw-trades-list" role="menu" aria-labelledby="aw-trades-trigger">' +
      tradeListHtml() +
      "</ul></div>" +
      '<a class="aw-site-header__link" href="' +
      escapeHtml(h + "#step-intro") +
      '">Comment ça marche</a>' +
      '<a class="aw-site-header__link" href="' +
      escapeHtml(realisationsHref("#realisations")) +
      '">Nos réalisations</a>' +
      '<a class="aw-site-header__link" href="' +
      escapeHtml(realisationsHref("#a-propos")) +
      '">À propos</a>' +
      '<a class="aw-site-header__link" href="' +
      escapeHtml(realisationsHref("#contact")) +
      '">Contact</a>' +
      "</div>" +
      '<a class="aw-site-header__cta" href="' +
      escapeHtml(maquette) +
      '">Maquette gratuite</a>' +
      "</nav>" +
      '<button type="button" class="aw-site-header__burger" id="aw-nav-burger" aria-expanded="false" aria-controls="aw-primary-nav" aria-label="Ouvrir le menu">' +
      '<span class="aw-site-header__burger-line"></span>' +
      '<span class="aw-site-header__burger-line"></span>' +
      '<span class="aw-site-header__burger-line"></span>' +
      "</button></div>" +
      "</header>"
    );
  }

  function renderFooter() {
    var h = homeHref();
    var legal = legalHref();
    var maquette = maquetteHref();
    return (
      '<footer class="aw-site-footer" role="contentinfo">' +
      '<div class="aw-site-footer__inner">' +
      '<div>' +
      '<a class="aw-site-footer__brand" href="' +
      escapeHtml(h) +
      '">' +
      '<img class="aw-site-footer__logo-img" src="' +
      escapeHtml(logoSrc()) +
      '" width="500" height="500" alt="Artisan-Web" decoding="async" loading="lazy" />' +
      "</a>" +
      '<p class="aw-site-footer__tag">Sites web clairs pour artisans — vous restez sur le chantier.</p>' +
      "</div>" +
      "<div>" +
      '<p class="aw-site-footer__col-title">Navigation</p>' +
      '<ul class="aw-site-footer__list">' +
      '<li><a href="' +
      escapeHtml(maquette) +
      '">Maquette gratuite</a></li>' +
      '<li><a href="' +
      escapeHtml(h + "#step-intro") +
      '">Comment ça marche</a></li>' +
      '<li><a href="' +
      escapeHtml(realisationsHref("#realisations")) +
      '">Nos réalisations</a></li>' +
      '<li><a href="' +
      escapeHtml(realisationsHref("#a-propos")) +
      '">À propos</a></li>' +
      '<li><a href="' +
      escapeHtml(realisationsHref("#contact")) +
      '">Contact</a></li>' +
      "</ul></div>" +
      "<div>" +
      '<p class="aw-site-footer__col-title">Métiers</p>' +
      '<ul class="aw-site-footer__list">' +
      footerTradeLinksHtml() +
      "</ul></div>" +
      '<div id="aw-footer-contact">' +
      '<p class="aw-site-footer__col-title">Écrire</p>' +
      '<p class="aw-site-footer__contact" id="aw-contact">' +
      "Une question ou un projet ?<br />" +
      '<a href="mailto:contact@artisan-web.fr">contact@artisan-web.fr</a>' +
      "</p></div></div>" +
      '<div class="aw-site-footer__bottom">' +
      '<p class="aw-site-footer__legal">© Artisan-Web</p>' +
      '<p class="aw-site-footer__legal"><a href="' +
      escapeHtml(legal) +
      '">Mentions légales</a></p>' +
      "</div></footer>"
    );
  }

  function mount(id, html) {
    var el = document.getElementById(id);
    if (!el) return null;
    el.innerHTML = html;
    return el;
  }

  function closeDropdown(root) {
    var wrap = root.querySelector("[data-aw-dropdown]");
    if (!wrap) return;
    wrap.classList.remove("is-open");
    var btn = document.getElementById("aw-trades-trigger");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown(root) {
    var wrap = root.querySelector("[data-aw-dropdown]");
    if (!wrap) return;
    var open = !wrap.classList.contains("is-open");
    wrap.classList.toggle("is-open", open);
    var btn = document.getElementById("aw-trades-trigger");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function setMobileOpen(header, nav, burger, backdrop, open) {
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    backdrop.classList.toggle("is-visible", open);
    backdrop.hidden = !open;
    backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("aw-mobile-nav-open", open);

    /* Verrouillage scroll (iOS / pages longues) : overflow:hidden seul ne suffit pas toujours */
    if (open) {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.dataset.awNavScrollLock = String(y);
      document.body.style.position = "fixed";
      document.body.style.top = -y + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      var prev =
        document.body.dataset.awNavScrollLock != null
          ? parseInt(document.body.dataset.awNavScrollLock, 10)
          : 0;
      delete document.body.dataset.awNavScrollLock;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, prev);
    }

    if (!open) closeDropdown(header);
  }

  function initScrollAffordance(header) {
    if (!header) return;
    var thresholdPx = 20;
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      header.classList.toggle("is-scrolled", y > thresholdPx);
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  function bindHeaderBehaviors(header) {
    if (!header) return;
    var nav = header.querySelector("#aw-primary-nav");
    var burger = header.querySelector("#aw-nav-burger");
    var backdrop = header.querySelector("#aw-nav-backdrop");
    var trigger = header.querySelector("#aw-trades-trigger");

    if (trigger) {
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleDropdown(header);
      });
    }

    var tradesList = header.querySelector("#aw-trades-list");
    if (tradesList) {
      tradesList.addEventListener("click", function () {
        closeDropdown(header);
      });
    }

    document.addEventListener("click", function () {
      closeDropdown(header);
    });

    header.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDropdown(header);
        if (nav && burger && backdrop && nav.classList.contains("is-open")) {
          setMobileOpen(header, nav, burger, backdrop, false);
        }
      }
    });

    if (nav && burger && backdrop) {
      burger.addEventListener("click", function () {
        var open = !nav.classList.contains("is-open");
        setMobileOpen(header, nav, burger, backdrop, open);
      });

      backdrop.addEventListener("click", function () {
        setMobileOpen(header, nav, burger, backdrop, false);
      });

      nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          if (window.matchMedia("(max-width: 960px)").matches) {
            setMobileOpen(header, nav, burger, backdrop, false);
          }
        });
      });
    }
  }

  function init() {
    var headerHost = mount("aw-site-header", renderHeader());
    mount("aw-site-footer", renderFooter());

    document.body.classList.add("aw-has-site-chrome");

    var headerEl = headerHost ? headerHost.firstElementChild : null;
    if (headerEl && headerEl.classList.contains("aw-site-header")) {
      initScrollAffordance(headerEl);
      bindHeaderBehaviors(headerEl);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
