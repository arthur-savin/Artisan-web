/**
 * Bandeau consentement cookies RGPD
 * - Affiche le bandeau tant qu'aucun choix (accepter / refuser) n'est enregistré
 * - Ne charge Google Analytics qu'après acceptation
 * - Anonymisation IP activée pour GA4
 */
(function () {
  var STORAGE_KEY = 'cookie_consent';
  var GA_ID = 'G-PRB0NF2M9Y';

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function loadGoogleAnalytics() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
  }

  function hideBanner() {
    var banner = document.getElementById('cookieConsentBanner');
    if (banner) {
      banner.classList.remove('cookie-consent-visible');
      banner.setAttribute('aria-hidden', 'true');
    }
  }

  function showBanner() {
    var banner = document.getElementById('cookieConsentBanner');
    if (banner) {
      banner.classList.add('cookie-consent-visible');
      banner.setAttribute('aria-hidden', 'false');
    }
  }

  function init() {
    var consent = getConsent();
    if (consent === 'accepted') {
      loadGoogleAnalytics();
      hideBanner();
      return;
    }
    if (consent === 'refused') {
      hideBanner();
      return;
    }
    showBanner();

    var acceptBtn = document.getElementById('cookieConsentAccept');
    var refuseBtn = document.getElementById('cookieConsentRefuse');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setConsent('accepted');
        loadGoogleAnalytics();
        hideBanner();
      });
    }
    if (refuseBtn) {
      refuseBtn.addEventListener('click', function () {
        setConsent('refused');
        hideBanner();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
