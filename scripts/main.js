// ---------------------------------------- BACKGROUND ----------------------------------------

const gradient = document.getElementById("grainient");

// Vérifier si l'élément existe et si la largeur d'écran est suffisante
if (gradient && window.innerWidth > 768) {
    let currentMouseX = 50;
    let currentMouseY = 50;
    let targetMouseX = 50;
    let targetMouseY = 50;
    let isActive = true; // Contrôle l'état de l'animation

    // Fonction d'interpolation pour lisser le mouvement
    const moveGradient = (timestamp) => {
        if (!isActive) return; // Arrêter si désactivé

        // Interpolation linéaire avec facteur de fluidité
        currentMouseX += (targetMouseX - currentMouseX) * 0.1; // Réduit pour moins de calculs
        currentMouseY += (targetMouseY - currentMouseY) * 0.1;

        // Mettre à jour les propriétés CSS uniquement si changement significatif
        if (Math.abs(currentMouseX - targetMouseX) > 0.1 || Math.abs(currentMouseY - targetMouseY) > 0.1) {
            gradient.style.setProperty("--mouse-x", `${currentMouseX}%`);
            gradient.style.setProperty("--mouse-y", `${currentMouseY}%`);
        }

        // Continuer l'animation
        if (isActive) {
            requestAnimationFrame(moveGradient);
        }
    };

    // Gestionnaire d'événements pour la souris
    const handleMouseMove = (event) => {
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        // Calculer les positions cibles
        targetMouseX = (event.pageX / winWidth) * 100;
        targetMouseY = (event.pageY / winHeight) * 100;
    };

    // Détection des appareils à faible performance
    const isLowPerformance = () => true;
    // () => {
    //     // Critères simples pour détecter les appareils à faible performance
    //     const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4; // Moins de 4GB
    //     const hasLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2; // 2 cœurs ou moins
    //     return hasLowMemory || hasLowCores;
    // };

    // Activer/désactiver l'animation selon performance
    if (!isLowPerformance()) {
        document.addEventListener("mousemove", handleMouseMove);
        requestAnimationFrame(moveGradient);
    } else {
        // Appliquer une position statique pour les appareils faibles
        gradient.style.setProperty("--mouse-x", "50%");
        gradient.style.setProperty("--mouse-y", "50%");
    }

    // Gérer le redimensionnement pour désactiver sur mobile
    window.addEventListener("resize", () => {
        if (window.innerWidth <= 768) {
            isActive = false;
            document.removeEventListener("mousemove", handleMouseMove);
            gradient.style.setProperty("--mouse-x", "50%");
            gradient.style.setProperty("--mouse-y", "50%");
        } else if (isActive === false && !isLowPerformance()) {
            isActive = true;
            document.addEventListener("mousemove", handleMouseMove);
            requestAnimationFrame(moveGradient);
        }
    });

    // Nettoyage lors du déchargement de la page
    window.addEventListener("unload", () => {
        isActive = false;
        document.removeEventListener("mousemove", handleMouseMove);
    });
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
