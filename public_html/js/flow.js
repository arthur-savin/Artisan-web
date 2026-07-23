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

  /** Étapes affichées dans l’indicateur (ordre du parcours) */
  var QUESTION_STEPS = [
    "profile",
    "acquisition",
    "trade",
    "goal",
  ];

  /** Une question est « validée » (point orange) après réponse + passage à l’étape suivante */
  var completedQuestions = {
    profile: false,
    acquisition: false,
    trade: false,
    goal: false,
  };

  var flashMessages = [
    "Parfait 👌",
    "On vous prépare quelque chose…",
    "Parfait 👌",
    "On affine votre parcours…",
  ];

  var flashIndex = 0;

  /** Aligné sur css/flow.css : --flow-dur-fast (sortie d’étape) */
  var STEP_LEAVE_MS = 420;
  /** Temps d’affichage du message entre deux étapes */
  var FLASH_DISPLAY_MS = 960;

  function $(id) {
    return document.getElementById(id);
  }

  function getQuestionIndex(stepId) {
    var i = QUESTION_STEPS.indexOf(stepId);
    return i;
  }

  function isQuestionStepId(stepId) {
    return getQuestionIndex(stepId) >= 0;
  }

  function markQuestionCompleted(stepId) {
    if (completedQuestions.hasOwnProperty(stepId)) {
      completedQuestions[stepId] = true;
    }
  }

  function updateProgressBar() {
    var nav = $("flow-progress");
    if (!nav) return;

    var activeEl = document.querySelector(".step.is-active");
    var activeStep = activeEl && activeEl.getAttribute("data-step");
    var curIdx = activeStep ? getQuestionIndex(activeStep) : -1;

    if (
      activeStep === "intro" ||
      activeStep === "loading" ||
      curIdx < 0
    ) {
      nav.hidden = true;
      nav.setAttribute("aria-hidden", "true");
      return;
    }

    nav.hidden = false;
    nav.setAttribute("aria-hidden", "false");

    QUESTION_STEPS.forEach(function (stepId, i) {
      var btn = nav.querySelector('[data-flow-step="' + stepId + '"]');
      if (!btn) return;
      var li = btn.closest(".flow-progress__item");
      if (li) li.classList.remove("flow-progress__item--active");

      btn.classList.remove("is-active", "is-done", "is-upcoming");
      btn.removeAttribute("aria-current");
      btn.disabled = true;

      if (i === curIdx) {
        btn.classList.add("is-active");
        if (li) li.classList.add("flow-progress__item--active");
        btn.setAttribute("aria-current", "step");
      } else if (completedQuestions[stepId]) {
        btn.classList.add("is-done");
        if (i < curIdx) {
          btn.disabled = false;
        }
      } else {
        btn.classList.add("is-upcoming");
      }
    });
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
    updateProgressBar();
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
    if (isQuestionStepId(storageKey)) {
      markQuestionCompleted(storageKey);
    }
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
      markQuestionCompleted("goal");
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
    var url = file ? base + file : base + "realisations.html";

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

  function bindProgressNav() {
    var nav = $("flow-progress");
    if (!nav) return;
    nav.addEventListener("click", function (e) {
      var btn = e.target.closest(".flow-progress__dot");
      if (!btn || !nav.contains(btn) || btn.disabled) return;

      var stepId = btn.getAttribute("data-flow-step");
      if (!stepId) return;

      var targetIdx = getQuestionIndex(stepId);
      var activeEl = document.querySelector(".step.is-active");
      var curId = activeEl && activeEl.getAttribute("data-step");
      var curIdx = curId ? getQuestionIndex(curId) : -1;

      if (targetIdx < 0 || curIdx < 0 || targetIdx >= curIdx) return;

      transitionTo(stepId);
    });
  }

  function init() {
    setStepVisible("intro");
    bindIntro();
    bindChoiceCards("profile-choices", "profile", "acquisition");
    bindChoiceCards("acquisition-choices", "acquisition", "trade");
    bindChoiceCards("trade-choices", "trade", "goal");
    bindGoal();
    bindProgressNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
