/**
 * Artisan-Web — interactions (header, menu, portfolio tabs, process, modal, reveal)
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileMenu() {
    var toggle = document.getElementById("menuToggle");
    var nav = document.getElementById("mainNav");
    var backdrop = document.getElementById("navBackdrop");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.classList.toggle("is-open", open);
      nav.classList.toggle("is-open", open);
      if (backdrop) {
        backdrop.classList.toggle("is-open", open);
        backdrop.setAttribute("aria-hidden", open ? "false" : "true");
      }
      var modalOpen = document.getElementById("contactModal");
      var keepLock = modalOpen && modalOpen.classList.contains("is-open");
      document.body.classList.toggle("modal-open", open || keepLock);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initProcessProgress() {
    var fill = document.getElementById("processProgressFill");
    var dots = document.querySelectorAll(".progress-dot");
    var cards = document.querySelectorAll("[data-process-step]");
    if (!fill || !cards.length) return;

    function update() {
      var visible = 0;
      cards.forEach(function (card, i) {
        var rect = card.getBoundingClientRect();
        var mid = window.innerHeight * 0.65;
        if (rect.top < mid) {
          visible = i + 1;
          card.classList.add("is-active");
        }
      });
      var ratio = Math.max(0, (visible - 1) / Math.max(1, cards.length - 1));
      fill.style.transform = "scaleX(" + ratio + ")";
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i < visible);
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initPortfolioTabs() {
    var root = document.getElementById("portfolioShowcase");
    if (!root) return;

    var tabs = root.querySelectorAll("[data-portfolio-tab]");
    var panels = root.querySelectorAll("[data-portfolio-panel]");

    function activate(id) {
      tabs.forEach(function (tab) {
        var active = tab.getAttribute("data-portfolio-tab") === id;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var active = panel.getAttribute("data-portfolio-panel") === id;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-portfolio-tab"));
      });
    });
  }

  function initModal() {
    var modal = document.getElementById("contactModal");
    if (!modal) return;

    var title = document.getElementById("modalTitle");
    var closeBtn = document.getElementById("closeModal");
    var overlay = modal.querySelector(".modal-overlay");
    var lastFocus = null;

    function openModal(type) {
      lastFocus = document.activeElement;
      var isDevis = type === "devis";
      document.body.classList.add("modal-open");
      document.body.classList.toggle("modal-devis", isDevis);
      if (title) {
        title.textContent = isDevis ? "Demander un devis" : "Réserver un appel";
      }

      var lastName = document.getElementById("lastName");
      var email = document.getElementById("email");
      if (lastName) lastName.required = isDevis;
      if (email) email.required = isDevis;

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      var first = modal.querySelector("input:not([type=hidden]), button");
      if (first) first.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open", "modal-devis");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.querySelectorAll(".open-modal").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(btn.getAttribute("data-modal-type") || "appel");
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  ready(function () {
    initYear();
    initHeader();
    initMobileMenu();
    initReveal();
    initProcessProgress();
    initPortfolioTabs();
    initModal();
    initSmoothNav();
  });
})();
