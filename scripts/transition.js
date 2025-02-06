document.addEventListener("DOMContentLoaded", () => {
  const mainEl = document.querySelector("main");
  
  // Initialisation de la transition
  if (mainEl) mainEl.classList.add("fade-in");

  // Vérifie si le lien mène à une nouvelle page
  const isPageChange = link => {
      const currentPath = window.location.pathname;
      const linkPath = new URL(link.href).pathname;
      
      return link.hostname === window.location.hostname && // Même domaine
          linkPath !== currentPath && // Chemin différent
          !link.hash && // Pas d'ancre
          link.target !== '_blank' && // Pas d'ouverture nouvel onglet
          link.download === ''; // Pas de lien de téléchargement
  };

  // Gestionnaire de clic optimisé
  const handleLinkClick = e => {
      const link = e.currentTarget;
      
      if (isPageChange(link)) {
          e.preventDefault();
          mainEl?.classList.add("fade-out");
          
          mainEl?.addEventListener('animationend', () => {
              window.location.href = link.href;
          }, { once: true });
      }
      // Sinon, laisser le comportement par défaut
  };

  // Appliquer uniquement aux liens concernés
  document.querySelectorAll('a').forEach(link => {
      if (isPageChange(link)) {
          link.addEventListener('click', handleLinkClick);
      }
  });
});