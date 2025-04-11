// Script pour indexer automatiquement les images
document.addEventListener('DOMContentLoaded', () => {
    const mosaic = document.querySelector('.mosaic'); // Sélectionne le premier élément avec la classe .mosaic
    const imageCount = 21; // Nombre actuel d'images, ajustable

    // Vérifie que l'élément mosaic existe
    if (mosaic) {
        // Boucle pour générer les balises <img> pour chaque image
        for (let i = 1; i <= imageCount; i++) {
            const img = document.createElement('img');
            img.src = `/addons/images/pictures/webp/picture-${i}.webp`;
            img.alt = `Image ${i}`; // Texte alternatif personnalisable
            mosaic.appendChild(img);
        }
    } else {
        console.error("L'élément avec la classe 'mosaic' n'a pas été trouvé.");
    }
});