document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".prs-item");
    if (!items.length) return;

    const imagePaths = Array.from({ length: 55 }, (_, i) => 
        `/addons/images/pictures/webp/picture-${i + 1}.webp`
    );

    const shuffledPaths = [...imagePaths].sort(() => Math.random() - 0.5);

    items.forEach((item, index) => {
        const img = document.createElement("img");
        // keep original image files in addons; let client resizer produce smaller versions when appropriate
        const original = shuffledPaths[index % shuffledPaths.length];
        img.dataset.src = original;
        img.dataset.original = original; // keep a reference to the full-quality image for lightbox
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        img.setAttribute('data-auto-resize', 'true');
        img.setAttribute('data-quality', '0.6');
        img.setAttribute('data-maxwidth', '1000');
        // lightweight placeholder while real image is generated/loaded
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="14"><rect width="100%" height="100%" fill="%23e9e9e9"/></svg>';
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        item.appendChild(img);
        item.style.opacity = '0.2';
    });

    // --- Grid mouse-driven sliding + opacity (works even if images not loaded) ---
    const rows = document.querySelectorAll(".prs-grid-row");
    if (rows.length) {
        const baseOpacity = 0.2, maxOpacity = 1, maxDistance = 300;
        // Parallax factors per row; fallback to small factor if mismatch
        const factors = [0.05, 0.1, 0.2, 0.1, 0.05];

        document.addEventListener("mousemove", ({ clientX, clientY }) => {
            const centerX = window.innerWidth / 2;
            const deltaX = clientX - centerX;

            rows.forEach((row, i) => {
                const f = factors[i] !== undefined ? factors[i] : 0.08;
                row.style.transform = `translateX(${deltaX * f}px)`;
            });

            items.forEach(item => {
                const rect = item.getBoundingClientRect();
                const distance = Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2));
                const opacity = baseOpacity + (maxOpacity - baseOpacity) * (1 - Math.min(distance / maxDistance, 1));
                item.style.opacity = opacity.toString();
            });
        });
    }
});
