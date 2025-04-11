document.addEventListener('DOMContentLoaded', () => {
    const mosaic = document.querySelector('.mosaic');
    if (mosaic) {
        const imageCount = 21; // Nombre d'images dans picture/webp
        let currentRow = 0;
        let currentColumn = 0;

        for (let i = 1; i <= imageCount; i++) {
            const img = new Image();
            img.src = `/addons/images/pictures/webp/picture-${i}.webp`;
            img.alt = `Image ${i}`;

            img.onload = () => {
                // Calculer la position de l'image
                const rowSpan = Math.ceil(img.naturalHeight / img.naturalWidth);
                const columnSpan = 1;

                // Ajouter des propriétés CSS pour la position
                img.style.gridRowStart = currentRow + 1;
                img.style.gridColumnStart = currentColumn + 1;
                img.style.gridRowEnd = `span ${rowSpan}`;
                img.style.gridColumnEnd = `span ${columnSpan}`;

                // Mettre à jour la position pour la prochaine image
                currentColumn += columnSpan;
                if (currentColumn >= getComputedStyle(mosaic).gridTemplateColumns.split(' ').length) {
                    currentColumn = 0;
                    currentRow += rowSpan;
                }

                mosaic.appendChild(img);
            };
        }
    } else {
        console.error("L'élément '.mosaic' n'a pas été trouvé.");
    }
});