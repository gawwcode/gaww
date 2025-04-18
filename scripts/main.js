// ---------------------------------------- BACKGROUND ----------------------------------------

const gradient = document.getElementById("grainient");

const isLowPerformanceDevice = () => {
    const cores = navigator.hardwareConcurrency || 2; // Valeur par défaut si non disponible
    const memory = navigator.deviceMemory || 4; // Mémoire en Go (par défaut 4 si non disponible)
    return cores <= 2 || memory <= 2; // Considérer les appareils avec 2 cœurs ou 2 Go de RAM comme peu performants
};

if (!isLowPerformanceDevice() && window.innerWidth > 768 && gradient) {
    let lastEvent = null;
    let throttleTimeout;
    let currentMouseX = 50; // Valeur initiale
    let currentMouseY = 50;

    const moveGradient = () => {
        if (lastEvent) {
            const { pageX, pageY } = lastEvent;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            const targetMouseX = Math.round((pageX / winWidth) * 100);
            const targetMouseY = Math.round((pageY / winHeight) * 100);

            // Interpolation linéaire
            currentMouseX += (targetMouseX - currentMouseX) * 0.1; // Ajuster le facteur (0.1 pour un lissage plus lent)
            currentMouseY += (targetMouseY - currentMouseY) * 0.1;

            gradient.style.setProperty("--mouse-x", `${currentMouseX}%`);
            gradient.style.setProperty("--mouse-y", `${currentMouseY}%`);
        }
    };

    const throttledMouseMove = (event) => {
        lastEvent = event;
        if (!throttleTimeout) {
            throttleTimeout = setTimeout(() => {
                requestAnimationFrame(moveGradient);
                throttleTimeout = null; // Réinitialiser le throttle
            }, 100); // Mettre à jour toutes les 100ms (10 FPS)
        }
    };

    const stopGradientEffect = () => {
        document.removeEventListener("mousemove", throttledMouseMove);
        console.log("Gradient désactivé après une période d'inactivité.");
    };

    let inactivityTimeout = setTimeout(stopGradientEffect, 5000); // Désactiver après 5 secondes d'inactivité

    document.addEventListener("mousemove", (event) => {
        clearTimeout(inactivityTimeout); // Réinitialiser le timer d'inactivité
        inactivityTimeout = setTimeout(stopGradientEffect, 5000);
        throttledMouseMove(event);
    });
} else {
    console.log("Gradient désactivé pour cet appareil en raison de performances limitées.");
}

// ---------------------------------------- LOADING ----------------------------------------

window.addEventListener("load", () => {
    document.getElementById("loading").remove();
});

// ---------------------------------------- MENU ----------------------------------------

// -------------------- MENU - OVERLAY --------------------

document.addEventListener('DOMContentLoaded', () => {
    const navBtnWrapper = document.querySelector('.nav-btn-wrapper');
    const navBtn = document.querySelector('.nav-btn');
    const overlay = document.querySelector('.overlay');
    const menulinks = document.querySelectorAll('.menulink');

    navBtnWrapper.addEventListener('click', () => {
        const isOpen = navBtn.classList.toggle('nav-btn-open');

        navBtn.classList.toggle('nav-btn-close', !isOpen);
        overlay.classList.toggle('hidden', !isOpen);
        overlay.classList.toggle('h-0px', !isOpen);
        overlay.classList.toggle('h-100vh', isOpen);

        menulinks.forEach(link => link.classList.toggle('hidden', !isOpen));
    });
});

// -------------------- MENU - LANGUAGE - DROPDOWN --------------------

var dropdowncontent = document.querySelector('.language-dropcontent');

function dropdown() {
    dropdowncontent.classList.toggle('ld-open');
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.language-dropbtn')) {
        var dropdowns = document.getElementsByClassName("language-dropcontent");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('ld-open')) {
                openDropdown.classList.remove('ld-open');
            }
        }
    }
}

// ---------------------------------------- LANGUAGE ----------------------------------------

// -------------------- LANGUAGE - TRANSLATION --------------------

async function changeLanguage(lang) {
    try {
        const response = await fetch(`/languages/${lang}.json`);
        if (!response.ok) throw new Error(`Erreur réseau: ${response.status}`);

        const data = await response.json();
        applyTranslations(document.body, data);
    } catch (error) {
        console.error("Erreur lors du chargement de la langue :", error);
    }
}

// Fonction qui applique les traductions
function applyTranslations(element, data, parentKey = '') {
    if (!data || typeof data !== 'object') return;

    Object.keys(data).forEach(key => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key; // Crée la clé complète (avec hiérarchie si elle existe)

        // Si la clé est un objet, on appelle la fonction récursivement
        if (typeof data[key] === 'object') {
            applyTranslations(element, data[key], fullKey);
        } else {
            // Chercher les éléments avec l'attribut `data-translate`
            const targetElements = element.querySelectorAll(`[data-translate="${fullKey}"]`);
            targetElements.forEach(el => {
                el.innerHTML = data[key]; // Remplacer le texte
            });

            // Chercher les éléments avec l'attribut `data-translate-placeholder`
            const placeholderElements = element.querySelectorAll(`[data-translate-placeholder="${fullKey}"]`);
            placeholderElements.forEach(el => {
                el.placeholder = data[key]; // Remplacer le placeholder
            });
        }
    });
}

// Fonction pour détecter la langue du navigateur et appliquer la traduction ------------------------ WIP -----------------------------
function initializeLanguage() {
    const browserLanguage = navigator.language || navigator.userLanguage;
    console.log("Langue du navigateur détectée :", browserLanguage);
    const langCode = browserLanguage.split('-')[0]; // Prendre seulement le code de langue (ex: 'fr' de 'fr-FR')
    console.log("Code de langue extrait :", langCode);
    changeLanguage(langCode);
}

// Appeler initializeLanguage lors du chargement de la page
document.addEventListener('DOMContentLoaded', initializeLanguage);
