// JavaScript pour gérer la lightbox
document.addEventListener('DOMContentLoaded', () => {
    const mediaElements = document.querySelectorAll('.lightbox-media');
    const lightbox = document.querySelector('.lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxTimelapse = document.querySelector('.lightbox-timelapse');
    const closeBtn = document.querySelector('.lightbox-close');

    mediaElements.forEach(media => {
        media.addEventListener('click', () => {
            lightboxContent.innerHTML = '';

            // Ajoute l'image ou la vidéo
            if (media.tagName === 'IMG') {
                const img = document.createElement('img');
                // Prefer the full-quality original if available (data-original), fall back to current src
                img.src = media.dataset.original || media.src;
                img.alt = media.alt || 'Enlarged media';
                lightboxContent.appendChild(img);
            } else if (media.tagName === 'VIDEO') {
                const video = document.createElement('video');
                video.src = media.src;
                video.controls = true;
                video.autoplay = true;
                video.loop = true;
                lightboxContent.appendChild(video);
            }

            // Gère l'affichage du lien timelapse
            if (lightboxTimelapse) {
                const timelapse = media.getAttribute('data-timelapse');
                if (timelapse) {
                    lightboxTimelapse.style.display = 'flex';
                    lightboxTimelapse.href = timelapse;
                    lightboxTimelapse.setAttribute('target', '_blank');
                    lightboxTimelapse.setAttribute('rel', 'noopener noreferrer');
                } else {
                    lightboxTimelapse.style.display = 'none';
                    lightboxTimelapse.removeAttribute('href');
                    lightboxTimelapse.removeAttribute('target');
                    lightboxTimelapse.removeAttribute('rel');
                }
            }

            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 0);
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxContent.innerHTML = '';
            if (lightboxTimelapse) {
                lightboxTimelapse.style.display = 'none';
                lightboxTimelapse.removeAttribute('href');
                lightboxTimelapse.removeAttribute('target');
                lightboxTimelapse.removeAttribute('rel');
            }
        }, 300);
    };

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
});