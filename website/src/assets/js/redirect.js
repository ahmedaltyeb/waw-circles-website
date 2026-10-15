// Root "/" language redirect. Arabic is the default; a language the visitor chose earlier (saved by main.js) wins.
// Without JavaScript the page's <noscript> meta refresh sends the visitor to /ar/ and the two links remain usable.
(function () {
  var target = 'ar/';
  try { if (localStorage.getItem('waw-lang') === 'en') target = 'en/'; } catch (e) { /* storage unavailable: keep default */ }
  location.replace(target);
})();
