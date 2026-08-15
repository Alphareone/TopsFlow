(function initChangelogModule() {
  // Asegura la re-renderización de los iconos de Lucide cuando se inyecta el módulo
  if (window.lucide) {
    lucide.createIcons();
  }
})();