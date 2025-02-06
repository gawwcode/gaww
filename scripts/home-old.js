document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll(".prs-grid-row");
    const items = document.querySelectorAll(".prs-item");
    const totalImages = 10;
    const baseOpacity = 0.2, maxOpacity = 1, maxDistance = 300;
    const factors = [0.05, 0.1, 0.2, 0.1, 0.05];

    // Stocker les indices déjà utilisés pour éviter les doublons adjacents
    const grid = Array.from(rows, () => []);
    
    items.forEach((item, index) => {
        const row = Math.floor(index / 7);
        const col = index % 7;
        let imgIndex;

        do {
            imgIndex = Math.floor(Math.random() * totalImages) + 1;
        } while (
            (grid[row]?.[col - 1] === imgIndex) || // Vérifie à gauche
            (grid[row - 1]?.[col] === imgIndex)    // Vérifie au-dessus
        );

        grid[row][col] = imgIndex; // Stocke l'index validé

        const img = new Image();
        img.src = `/addons/images/pictures/webp/picture-${imgIndex}.webp`;
        img.alt = `Image ${imgIndex}`;
        item.appendChild(img);
        item.style.opacity = baseOpacity;
    });

    document.addEventListener("mousemove", ({ clientX, clientY }) => {
        const centerX = window.innerWidth / 2;
        const deltaX = clientX - centerX;

        rows.forEach((row, i) => row.style.transform = `translateX(${deltaX * factors[i]}px)`);

        items.forEach(item => {
            const { left, top, width, height } = item.getBoundingClientRect();
            const distance = Math.hypot(clientX - (left + width / 2), clientY - (top + height / 2));
            item.style.opacity = baseOpacity + (maxOpacity - baseOpacity) * (1 - Math.min(distance / maxDistance, 1));
        });
    });
});
