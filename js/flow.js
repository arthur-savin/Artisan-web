/**
 * Landing guidée — étapes, persistance, redirection page pilier
 */
(function () {
  "use strict";

  var STORAGE_PREFIX = "aw_flow_";

  /** Qualification « type de chantiers » → fichier page pilier (carte-du-site.md) */
  var TRADE_TO_PAGE = {
    electricite: "electricien.html",
    plomberie: "plombier.html",
    menuiserie: "menuisier.html",
    maconnerie: "macon.html",
    cloisons: "peintre-batiment.html",
    toiture: "couvreur.html",
    facade: "facadier.html",
    serrurerie: "serrurier.html",
    amenagement_ext: "paysagiste.html",
    renovation_globale: "renovation-maison.html",
  };

  var steps = [
    "intro",
    "profile",
    "acquisition",
    "trade",
    "goal",
    "loading",
  ];

  var flashMessages = [
    "Parfait 👌",
    "On vous prépare quelque chose…",
    "Parfait 👌",
    "On affine votre parcours…",
  ];

  var flashIndex = 0;

  var STEP_LEAVE_MS = 420;
  var FLASH_DISPLAY_MS = 960;

  function $(id) {
    return document.getElementById(id);
  }

  function setStepVisible(stepId) {
    steps.forEach(function (s) {
      var el = $("step-" + s);
      if (!el) return;
      el.classList.remove("is-active", "is-leaving");
      el.hidden = s !== stepId;
      el.setAttribute("aria-hidden", s !== stepId ? "true" : "false");
    });
    var active = $("step-" + stepId);
    if (active) {
      active.hidden = false;
      active.classList.add("is-active");
    }
  }

  function transitionTo(nextStepId, afterMs) {
    var current = document.querySelector(".step.is-active");
    if (current) {
      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      window.setTimeout(function () {
        current.classList.remove("is-leaving");
        current.hidden = true;
        setStepVisible(nextStepId);
      }, afterMs != null ? afterMs : STEP_LEAVE_MS);
    } else {
      setStepVisible(nextStepId);
    }
  }

  function showFlash(message, then) {
    var layer = $("flash-layer");
    var text = $("flash-text");
    if (!layer || !text) {
      if (then) then();
      return;
    }
    text.textContent = message;
    layer.classList.add("is-visible");
    window.setTimeout(function () {
      layer.classList.remove("is-visible");
      if (then) then();
    }, FLASH_DISPLAY_MS);
  }

  function persist(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, value);
    } catch (e) {}
  }

  function nextFlashMessage() {
    var m = flashMessages[flashIndex % flashMessages.length];
    flashIndex += 1;
    return m;
  }

  function goAfterChoice(storageKey, value, nextStep) {
    persist(storageKey, value);
    showFlash(nextFlashMessage(), function () {
      transitionTo(nextStep);
    });
  }

  function bindChoiceCards(containerId, storageKey, nextStep) {
    var root = $(containerId);
    if (!root) return;
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".choice-card[data-value]");
      if (!btn || !root.contains(btn)) return;
      var value = btn.getAttribute("data-value");
      goAfterChoice(storageKey, value, nextStep);
    });
  }

  function bindIntro() {
    var start = $("btn-start");
    if (!start) return;
    start.addEventListener("click", function () {
      showFlash("C'est parti", function () {
        transitionTo("profile");
      });
    });
  }

  function bindGoal() {
    var root = $("goal-choices");
    if (!root) return;
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".choice-card[data-value]");
      if (!btn || !root.contains(btn)) return;
      var value = btn.getAttribute("data-value");
      persist("goal", value);
      showFlash("Parfait 👌", function () {
        transitionTo("loading");
        finalizeRedirect();
      });
    });
  }

  function finalizeRedirect() {
    var trade = "";
    try {
      trade = localStorage.getItem(STORAGE_PREFIX + "trade") || "";
    } catch (e) {}

    var file = TRADE_TO_PAGE[trade];
    var base = "pages/";
    var url = file ? base + file : base + "site-web-artisan.html";

    var goal = "";
    try {
      goal = localStorage.getItem(STORAGE_PREFIX + "goal") || "";
    } catch (e) {}

    if (goal) {
      url += (url.indexOf("?") === -1 ? "?" : "&") + "objectif=" + encodeURIComponent(goal);
    }

    persist("completed_at", new Date().toISOString());

    window.setTimeout(function () {
      window.location.href = url;
    }, 1400);
  }

  function init() {
    setStepVisible("intro");
    bindIntro();
    bindChoiceCards("profile-choices", "profile", "acquisition");
    bindChoiceCards("acquisition-choices", "acquisition", "trade");
    bindChoiceCards("trade-choices", "trade", "goal");
    bindGoal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
