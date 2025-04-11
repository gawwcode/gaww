document.addEventListener('DOMContentLoaded', () => {
    const mosaic = document.querySelector('.mosaic-container');
    const imageCount = 21; // Nombre d'images
  
    // Initialisation des positions
    let currentRow = 0;
    let currentColumn = 0;
    let maxColumns = 0;
  
    // Fonction pour calculer le ratio d'aspect
    function getAspectRatio(image) {
      return image.naturalHeight / image.naturalWidth;
    }
  
    // Génère les images
    for (let i = 1; i <= imageCount; i++) {
      const img = new Image();
      img.src = `/addons/images/pictures/webp/picture-${i}.webp`;
      img.alt = `Image ${i}`;
  
      // Attends que l'image soit chargée pour calculer le ratio
      img.onload = () => {
        const aspectRatio = getAspectRatio(img);
        const columnSpan = 1; // Chaque image occupe 1 colonne
        const rowSpan = Math.ceil(aspectRatio * 2); // Calcul du nombre de lignes à occuper (ajuste le 2 pour ajuster)
  
        // Crée un conteneur pour l'image
        const container = document.createElement('div');
        container.className = 'mosaic-item';
        container.style.gridColumnStart = currentColumn + 1;
        container.style.gridColumnEnd = `span ${columnSpan}`;
        container.style.gridRowStart = currentRow + 1;
        container.style.gridRowEnd = `span ${rowSpan}`;
  
        // Ajuste les dimensions du conteneur pour respecter le ratio
        container.style.paddingTop = `${aspectRatio * 100}%`; // Maintient le ratio
  
        // Met à jour la position pour la prochaine image
        currentColumn += columnSpan;
        if (currentColumn >= maxColumns) {
          // Recalcule le nombre de colonnes actuel
          const computedColumns = getComputedStyle(mosaic).gridTemplateColumns.split(' ').length;
          maxColumns = computedColumns;
          currentColumn = 0;
          currentRow += rowSpan;
        }
  
        // Ajoute l'image dans son conteneur
        container.appendChild(img);
        mosaic.appendChild(container);
      };
    }
  });