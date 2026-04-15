/**
 * Envoi du formulaire « Maquette gratuite » vers l’API PHP (JSON).
 */
(function () {
  "use strict";

  function byId(id) {
    return document.getElementById(id);
  }

  function showFeedback(el, type, text) {
    if (!el) return;
    el.hidden = false;
    el.textContent = text;
    el.className =
      "aw-maquette__feedback aw-maquette__feedback--" +
      type +
      " is-visible";
    el.setAttribute("aria-hidden", "false");
  }

  function hideFeedback(el) {
    if (!el) return;
    el.hidden = true;
    el.textContent = "";
    el.className = "aw-maquette__feedback";
    el.setAttribute("aria-hidden", "true");
  }

  function msgForError(code) {
    var map = {
      invalid_contact:
        "Merci de vérifier votre prénom, nom, métier et e-mail.",
      consent_required:
        "Cochez la case pour que nous puissions vous recontacter.",
      invalid_besoin: "Choisissez une option pour votre besoin principal.",
      server:
        "Un souci technique est survenu. Réessayez dans un instant ou écrivez-nous par e-mail.",
    };
    return map[code] || map.server;
  }

  function init() {
    var form = byId("maquette-form");
    var feedback = byId("maquette-feedback");
    var submitBtn = byId("mq-submit");
    if (!form || !feedback) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideFeedback(feedback);

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var url =
        form.getAttribute("data-submit-url") || "../api/submit-maquette.php";
      var fd = new FormData(form);

      submitBtn.disabled = true;

      fetch(url, {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
        },
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (r) {
          if (r.ok && r.data && r.data.ok) {
            showFeedback(
              feedback,
              "ok",
              "C'est bien reçu. Nous revenons vers vous très bientôt avec la suite."
            );
            form.reset();
            var intro = byId("form-intro");
            if (intro) intro.setAttribute("hidden", "true");
          } else {
            var err =
              r.data && r.data.error
                ? msgForError(r.data.error)
                : msgForError("server");
            showFeedback(feedback, "err", err);
          }
        })
        .catch(function () {
          showFeedback(feedback, "err", msgForError("server"));
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
