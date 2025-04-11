document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.mosaic');
  const imageCount = 21; // Nombre d'images

  // Fonction pour initialiser Masonry après le chargement des images
  function initializeMasonry() {
    new Masonry(container, {
      itemSelector: '.mosaic-item',
      columnWidth: '.mosaic-item',
      gutter: 10,
      fitWidth: true
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

      // Initialiser Masonry une fois toutes les images chargées
      if (loadedImages === imageCount) {
        initializeMasonry();
      }
    };

    // Gérer les erreurs de chargement d'images
    img.onerror = () => {
      console.error(`Erreur de chargement de l'image picture-${i}.webp`);
      loadedImages++;
      if (loadedImages === imageCount) {
        initializeMasonry();
      }
    };
  }
});