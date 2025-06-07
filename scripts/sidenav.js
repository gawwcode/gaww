document.addEventListener("DOMContentLoaded", () => {
    const toc = document.getElementById("toc");
    const container = toc.querySelector(".sidenav-links-container");
    const headers = document.querySelectorAll("h2, h3");

    const closeBtn = document.querySelector(".sidenav-close");
    const toggle = document.querySelector(".sidenav-toggle");

    // Création des liens dans la nav
    headers.forEach((h, i) => {
        if (!h.id) {
            h.id = `section-${i}`;
        }
        const link = document.createElement("a");
        link.href = `#${h.id}`;
        link.textContent = h.textContent;

        const level = parseInt(h.tagName.substring(1));
        link.style.marginLeft = `${(level - 2) * 20}px`;

        container.appendChild(link);
    });

    const tocLinks = container.querySelectorAll('a');

    // Ouvre/ferme le menu
    toggle.addEventListener("click", () => {
        toc.classList.toggle("open");
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            toc.classList.remove("open");
        });
    }

    document.addEventListener("click", (e) => {
        const isClickInsideMenu = toc.contains(e.target);
        const isClickOnToggle = e.target.closest(".sidenav-toggle");
        if (!isClickInsideMenu && !isClickOnToggle) {
            toc.classList.remove("open");
        }
    });

    // Intersection Observer avec seuil bas pour activer tôt
    let activeId = null;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeId = entry.target.id;
                updateActiveLink(activeId);
            }
        });
    }, { threshold: 0.1 });

    headers.forEach(h => observer.observe(h));

    // Fallback scroll au cas où IntersectionObserver manque des cas
    window.addEventListener('scroll', () => {
        let current = null;
        headers.forEach(header => {
            const rect = header.getBoundingClientRect();
            if (rect.top <= 150) current = header;
        });
        if (current && current.id !== activeId) {
            activeId = current.id;
            updateActiveLink(activeId);
        }
    });

    function updateActiveLink(id) {
        tocLinks.forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
    }

    // Initial call
    updateActiveLink(headers[0]?.id || null);
});
