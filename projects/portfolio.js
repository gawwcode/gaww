document.addEventListener('DOMContentLoaded', () => {
    const mosaic = document.querySelector('.mosaic');
    if (mosaic) {
        const imageCount = 21; // Nombre d'images dans picture/webp
        for (let i = 1; i <= imageCount; i++) {
            const img = document.createElement('img');
            img.src = `/addons/images/pictures/webp/picture-${i}.webp`;
            img.alt = `Image ${i}`;
            mosaic.appendChild(img);
        }
    } else {
        console.error("L'élément '.mosaic' n'a pas été trouvé.");
    }
});