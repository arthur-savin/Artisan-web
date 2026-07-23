/**
 * Soumission des formulaires vers l’endpoint serveur /api/form.php
 * À inclure sur les pages contenant des formulaires de contact.
 * Les formulaires doivent avoir l’attribut data-form-api="true".
 * Un champ honeypot (name="website") est ajouté automatiquement s’il est absent.
 */
(function () {
  'use strict';

  var API_ENDPOINT = '/api/form.php';
  var HONEYPOT_NAMES = ['website', 'company_website'];

  function ensureHoneypot(form) {
    var hasHoneypot = HONEYPOT_NAMES.some(function (n) { return form.elements[n]; });
    if (hasHoneypot) return;
    var input = document.createElement('input');
    input.type = 'text';
    input.name = HONEYPOT_NAMES[0];
    input.id = 'form-api-website';
    input.setAttribute('tabindex', '-1');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-hidden', 'true');
    input.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
    form.appendChild(input);
  }

  function getFormData(form) {
    var fd = new FormData(form);
    fd.set('formId', form.getAttribute('data-form-id') || form.id || 'unknown');
    fd.set('pageUrl', window.location.href);
    var modalTitle = document.getElementById('modalTitle');
    if (form.id === 'contactForm' && modalTitle) {
      var type = modalTitle.textContent.indexOf('devis') !== -1 ? 'devis' : 'appel';
      fd.set('requestType', type);
    }
    return new URLSearchParams(fd);
  }

  function showMessage(form, success, message) {
    var existing = form.querySelector('.form-api-message');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.className = 'form-api-message ' + (success ? 'form-api-success' : 'form-api-error');
    div.setAttribute('role', 'alert');
    div.textContent = message;
    div.style.marginTop = '1rem';
    div.style.padding = '0.75rem 1rem';
    div.style.borderRadius = '4px';
    div.style.fontSize = '0.95rem';
    if (success) {
      div.style.background = '#d4edda';
      div.style.color = '#155724';
      div.style.border = '1px solid #c3e6cb';
    } else {
      div.style.background = '#f8d7da';
      div.style.color = '#721c24';
      div.style.border = '1px solid #f5c6cb';
    }
    form.appendChild(div);
    if (success) form.reset();
  }

  function handleSubmit(e) {
    var form = e.target;
    var enabled = form.getAttribute('data-form-api') === 'true' || form.getAttribute('data-mailgun') === 'true';
    if (!enabled) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    var body = getFormData(form);

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })
      .then(function (res) {
        if (res.status === 204) {
          form.reset();
          var modal = document.getElementById('contactModal');
          if (modal && modal.classList) modal.classList.remove('active');
          return;
        }
        return res.json().then(function (data) {
          return { status: res.status, data: data };
        }).catch(function () {
          return { status: res.status, data: { message: 'Erreur serveur.' } };
        });
      })
      .then(function (result) {
        if (!result) return;
        var ok = result.status >= 200 && result.status < 300;
        var msg = (result.data && result.data.message) ? result.data.message : 'Une erreur est survenue.';
        showMessage(form, ok, msg);
        if (ok) {
          var modal = document.getElementById('contactModal');
          if (modal && modal.classList) modal.classList.remove('active');
        }
      })
      .catch(function () {
        showMessage(form, false, 'Impossible de contacter le serveur. Réessayez plus tard.');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
  }

  function init() {
    var forms = document.querySelectorAll('form[data-form-api="true"], form[data-mailgun="true"]');
    forms.forEach(function (form) {
      ensureHoneypot(form);
      form.addEventListener('submit', handleSubmit, true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
