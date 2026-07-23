/**
 * Narration au scroll — focus central par Intersection Observer
 * (1 seule scène “nette” à la fois + progression discrète)
 */
(function () {
  "use strict";

  var SCENE_INNER = ".el-scene__inner";
  var FOCUSED = "is-focused";

  function initScrollFocus() {
    var inners = document.querySelectorAll(SCENE_INNER);
    if (!inners.length) return;

    // Bande centrale : ce qui entre dans cette zone « prend la main » visuellement
    var rootMargin = "-22% 0px -22% 0px";

    if (window.matchMedia("(max-width: 600px)").matches) {
      rootMargin = "-18% 0px -18% 0px";
    }

    /** Un seul bloc net à la fois : passage de témoin entre scènes */
    var ratios = new Map();
    inners.forEach(function (el) {
      ratios.set(el, 0);
    });

    function applySingleFocus() {
      var bestEl = null;
      var bestRatio = 0;
      ratios.forEach(function (ratio, el) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestEl = el;
        }
      });
      var threshold = 0.1;
      inners.forEach(function (el) {
        var on = bestEl === el && bestRatio >= threshold;
        el.classList.toggle(FOCUSED, on);
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          ratios.set(entry.target, entry.intersectionRatio);
        });
        applySingleFocus();
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.65, 0.8, 1],
      }
    );

    inners.forEach(function (el) {
      observer.observe(el);
    });

    window.requestAnimationFrame(function () {
      if (!document.querySelector("." + FOCUSED) && inners[0]) {
        inners[0].classList.add(FOCUSED);
      }
    });
  }

  function initAnchorCtas() {
    document.querySelectorAll("a[data-scroll-to]").forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = anchor.getAttribute("data-scroll-to");
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", "#" + id);
      });
    });
  }

  /**
   * Progression par étapes : une position par .el-scene (direct de #el-story-main),
   * même bande centrale que le focus. Le point se déplace en douceur (transition CSS).
   * Petite hystérésis sur le ratio d’intersection pour limiter les oscillations en limite de scène.
   */
  function initNarrativeProgress() {
    var bar = document.querySelector(".el-narrative-progress");
    var story = document.getElementById("el-story-main");
    if (!bar || !story) return;

    var scenes = story.querySelectorAll(":scope > .el-scene");
    if (!scenes.length) return;

    var count = scenes.length;
    var ratios = new Map();
    scenes.forEach(function (scene) {
      ratios.set(scene, 0);
    });

    var activeSceneIndex = 0;
    var HYST = 0.07;

    function stepPercent(index) {
      if (count <= 1) return 0;
      return (index / (count - 1)) * 100;
    }

    function applyDot(index) {
      var pct = stepPercent(index);
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;
      bar.style.setProperty("--el-dot-p", String(pct));
    }

    function pickActiveSceneIndex() {
      var bestIdx = 0;
      var bestRatio = -1;
      for (var i = 0; i < scenes.length; i++) {
        var scene = scenes[i];
        var r = ratios.get(scene) || 0;
        if (r > bestRatio) {
          bestRatio = r;
          bestIdx = i;
        }
      }
      if (bestIdx === activeSceneIndex) {
        return activeSceneIndex;
      }
      var currentR = ratios.get(scenes[activeSceneIndex]) || 0;
      if (bestRatio >= currentR + HYST) {
        activeSceneIndex = bestIdx;
      }
      return activeSceneIndex;
    }

    var rootMargin = "-22% 0px -22% 0px";
    if (window.matchMedia("(max-width: 600px)").matches) {
      rootMargin = "-18% 0px -18% 0px";
    }

    var progressObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          ratios.set(entry.target, entry.intersectionRatio);
        });
        applyDot(pickActiveSceneIndex());
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.65, 0.8, 1],
      }
    );

    scenes.forEach(function (scene) {
      progressObserver.observe(scene);
    });

    window.requestAnimationFrame(function () {
      activeSceneIndex = 0;
      applyDot(0);
    });
  }

  /** Header plus présent après un léger scroll (lisibilité). */
  function initHeaderScrollAffordance() {
    var header = document.querySelector(".aw-site-header");
    if (!header) return;

    var thresholdPx = 16;
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initScrollFocus();
      initAnchorCtas();
      initNarrativeProgress();
      initHeaderScrollAffordance();
    });
  } else {
    initScrollFocus();
    initAnchorCtas();
    initNarrativeProgress();
    initHeaderScrollAffordance();
  }
})();

