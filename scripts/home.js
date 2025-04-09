document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll(".prs-grid-row");
    const items = document.querySelectorAll(".prs-item");
    const totalImages = 16;
    const factors = [0.05, 0.1, 0.2, 0.1, 0.05];
    let centerX = window.innerWidth / 2;
    let isMobile = window.matchMedia("(max-width: 768px)").matches; // Détection mobile

    // Configuration initiale
    const init = () => {
        // Chargement des images
        const loadPromises = Array.from(items).map((item, index) => {
            return new Promise(resolve => {
                const img = new Image();
                img.src = `/addons/images/pictures/webp/picture-${(index % totalImages) + 1}.webp`;
                img.onload = () => {
                    item.appendChild(img);
                    resolve();
                };
            });
        });

        // Activation de l'accélération matérielle uniquement sur desktop
        if (!isMobile) {
            rows.forEach(row => {
                row.style.willChange = 'transform';
                row.style.transform = 'translateZ(0)';
            });
        }

        return Promise.all(loadPromises);
    };

    // Animation desktop uniquement
    const animate = clientX => {
        if (isMobile) return; // Sortie immédiate sur mobile

        const deltaX = clientX - centerX;
        for (let i = 0; i < rows.length; i++) {
            rows[i].style.transform = `translateX(${deltaX * factors[i]}px)`;
        }
    };

    // Gestionnaire d'événements
    let ticking = false;
    const onMouseMove = e => {
        if (!ticking) {
            requestAnimationFrame(() => {
                animate(e.clientX);
                ticking = false;
            });
            ticking = true;
        }
    };

    // Démarrage
    init().then(() => {
        if (!isMobile) {
            document.addEventListener('mousemove', onMouseMove);
            window.addEventListener('resize', () => centerX = window.innerWidth / 2);
        }
    });
});
