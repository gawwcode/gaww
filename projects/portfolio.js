document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.mosaic');
    const imageCount = 21;
  
    function initializeMasonry() {
      new Masonry(container, {
        itemSelector: '.mosaic-item',
        columnWidth: '.mosaic-item', // Largeur des colonnes basée sur les items
        gutter: 0, // Espacement entre les items réduit
        fitWidth: true // Ajuste la largeur du conteneur
      });
    }
  
    let loadedImages = 0;
  
    for (let i = 1; i <= imageCount; i++) {
      const item = document.createElement('div');
      item.className = 'mosaic-item';
  
      const img = document.createElement('img');
      img.src = `/addons/images/pictures/webp/picture-${i}.webp`;
      img.alt = `Image ${i}`;
      img.onload = () => {
        loadedImages++;
        item.appendChild(img);
        container.appendChild(item);
  
        if (loadedImages === imageCount) {
          initializeMasonry();
        }
      };
  
      img.onerror = () => {
        console.error(`Erreur de chargement de l'image ${i}`);
        loadedImages++;
        if (loadedImages === imageCount) {
          initializeMasonry();
        }
      };
    }
  });