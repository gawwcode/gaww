// JavaScript pour gérer la lightbox
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.project-content img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    // Ouvre la lightbox avec fade-in
    images.forEach(image => {
        image.addEventListener('click', () => {
            lightboxImg.src = image.src;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 0); // Déclenche fade-in
        });
    });

    // Ferme la ışıkbox avec fade-out
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => lightbox.style.display = 'none', 0); // Attend la fin du fade-out
    };

    // Ferme avec clic sur la croix ou en dehors
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            closeLightbox();
        }
    });

    // Ferme avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
});