document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const isArticlePage = document.body.classList.contains('article-page');

  if (isArticlePage) return;

  const updateHeaderVisibility = function () {
    if (window.scrollY > 10) {
      header.classList.add('header-visible');
    } else {
      header.classList.remove('header-visible');
    }
  };

  // État initial au chargement
  updateHeaderVisibility();

  // Utilise la fonction throttle globale si elle existe déjà
  const onScroll =
    typeof throttle === 'function' ? throttle(updateHeaderVisibility, 50) : updateHeaderVisibility;

  window.addEventListener('scroll', onScroll, { passive: true });
});


