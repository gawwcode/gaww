// Script pour indexer automatiquement les images
document.addEventListener('DOMContentLoaded', () => {
    const mosaic = document.getElementsByClassName('.mosaic');
    const imageCount = 21; // Nombre actuel d'images, à ajuster si besoin

    // Boucle pour générer les balises <img> pour chaque image
    for (let i = 1; i <= imageCount; i++) {
        const img = document.createElement('img');
        img.src = `/addons/images/pictures/webp/picture-${i}.webp`;
        img.alt = `Image ${i}`; // Texte alternatif personnalisable
        mosaic.appendChild(img);
    }
});