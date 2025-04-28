// JavaScript pour gérer la lightbox
document.addEventListener('DOMContentLoaded', () => {
    const mediaElements = document.querySelectorAll('.art-column img, .art-column video');
    const lightbox = document.querySelector('.lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const closeBtn = document.querySelector('.lightbox-close');

    // Ouvre la lightbox avec fade-in
    mediaElements.forEach(media => {
        media.addEventListener('click', () => {
            // Vide le contenu précédent
            lightboxContent.innerHTML = '';

            // Vérifie si c'est une image ou une vidéo
            if (media.tagName === 'IMG') {
                const img = document.createElement('img');
                img.src = media.src;
                img.alt = media.alt || 'Enlarged media';
                lightboxContent.appendChild(img);
            } else if (media.tagName === 'VIDEO') {
                const video = document.createElement('video');
                video.src = media.src;
                video.controls = true; // Active les contrôles
                video.autoplay = true; // Lecture automatique
                video.loop = true; // Boucle infinie
                lightboxContent.appendChild(video);
            }

            // Affiche la lightbox
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 0); // Déclenche fade-in
        });
    });

    // Ferme la lightbox avec fade-out
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxContent.innerHTML = ''; // Vide le contenu après fermeture
        }, 300); // Correspond à la durée de la transition CSS
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