// ---------------------------------------- BACKGROUND ----------------------------------------

const gradient = document.getElementById("grainient");

// Vérifie si l'utilisateur est sur mobile
if (window.innerWidth > 768 && gradient) {
    let isMouseMoving = false;
    let lastEvent = null;

    const moveGradient = () => {
        if (lastEvent) {
            const { pageX, pageY } = lastEvent;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            const mouseX = Math.round((pageX / winWidth) * 100);
            const mouseY = Math.round((pageY / winHeight) * 100);

            gradient.style.setProperty("--mouse-x", `${mouseX}%`);
            gradient.style.setProperty("--mouse-y", `${mouseY}%`);
            isMouseMoving = false;
        }
    };

    document.addEventListener("mousemove", event => {
        lastEvent = event;
        if (!isMouseMoving) {
            isMouseMoving = true;
            requestAnimationFrame(moveGradient);
        }
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

// async function changeLanguage(lang) {
//     try {
//         const response = await fetch(`/languages/${lang}.json`);
//         if (!response.ok) throw new Error(`Erreur réseau: ${response.status}`);

//         const data = await response.json();
//         applyTranslations(document.body, data);
//     } catch (error) {
//         console.error("Erreur lors du chargement de la langue :", error);
//     }
// }

// // 🔥 Fonction RÉCURSIVE qui applique les traductions en fonction de la hiérarchie du JSON
// function applyTranslations(element, data) {
//     if (!data || typeof data !== 'object') return;

//     Object.keys(data).forEach(key => {
//         const targetElements = element.querySelectorAll(`[data-translate="${key}"]`);
        
//         targetElements.forEach(el => {
//             if (typeof data[key] === "object") {
//                 applyTranslations(el, data[key]); // 🔄 Appel récursif si c'est un objet
//             } else {
//                 el.innerHTML = data[key]; // ✨ Remplacement du texte si c'est une chaîne
//             }
//         });
//     });
// }

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
