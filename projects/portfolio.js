document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.mosaic');
    const folderPath = 'addons/images/pictures/webp/';
    const columnCount = 3; // Nombre de colonnes
    const gutter = 10; // Espace entre les colonnes
    const initialCount = 21; // Nombre initial d'images
  
    // Générer les images
    const images = [];
    for (let i = 1; i <= initialCount; i++) {
      const img = document.createElement('img');
      img.src = `${folderPath}picture-${i}.webp`;
      container.appendChild(img);
      images.push(img);
    }
  
    // Attendre que toutes les images soient chargées
    const promises = images.map(img => new Promise(resolve => {
      if (img.complete) resolve();
      else img.onload = resolve;
    }));
  
    Promise.all(promises).then(() => {
      // Calculer la disposition
      const columnWidth = 200; // Largeur des colonnes
      const columnHeights = Array(columnCount).fill(0);
      
      images.forEach(img => {
        const imgHeight = img.naturalHeight;
        let minColIndex = 0;
        let minHeight = Infinity;
        
        // Trouver la colonne la plus courte
        columnHeights.forEach((h, i) => {
          if (h < minHeight) {
            minHeight = h;
            minColIndex = i;
          }
        });
        
        // Positionner l'image
        const left = (columnWidth + gutter) * minColIndex;
        const top = columnHeights[minColIndex];
        img.style.left = `${left}px`;
        img.style.top = `${top}px`;
        
        // Mettre à jour la hauteur de la colonne
        columnHeights[minColIndex] += imgHeight + gutter;
      });
      
      // Ajuster la hauteur du conteneur
      container.style.height = `${Math.max(...columnHeights) - gutter}px`;
    });
  });