// ---------------------------------------------------------------------------------------- dropdown sort menu

var dropdownsortmenu = document.querySelector('.sortmenu');
var sortmenubutton = document.querySelector('.sort-menu-btn');

// Fonction pour ouvrir et fermer le menu
function dropdownsort() {
    dropdownsortmenu.classList.toggle('sortmenu-deployed');
}

// Fonction pour fermer le menu si un clic se fait en dehors
function closeDropdownIfClickedOutside(event) {
    if (!dropdownsortmenu.contains(event.target) && !sortmenubutton.contains(event.target)) {
        dropdownsortmenu.classList.remove('sortmenu-deployed');
    }
}

// ------------------------------------------------------------------------ dropdown sort menu functions

// Ajouter un événement au document pour fermer le menu quand on clique en dehors
document.addEventListener('click', closeDropdownIfClickedOutside);


// Fonction pour trier les projets par date
function sortProjectsByDate(order) {
    const projects = document.querySelectorAll('.project');
    const projectArray = Array.from(projects);

    // Trier les projets en deux groupes : avec date et sans date
    const projectsWithDate = projectArray.filter(project => {
        const dateElement = project.querySelector('.prdate');
        return dateElement && dateElement.textContent.trim() !== '';
    });

    const projectsWithoutDate = projectArray.filter(project => {
        const dateElement = project.querySelector('.prdate');
        return !dateElement || dateElement.textContent.trim() === '';
    });

    // Trier les projets avec une date
    projectsWithDate.sort((a, b) => {
        const dateA = new Date(a.querySelector('.prdate').textContent.trim());
        const dateB = new Date(b.querySelector('.prdate').textContent.trim());

        // Vérifier si les dates sont valides
        if (isNaN(dateA) || isNaN(dateB)) {
            console.error("Erreur : Une ou plusieurs dates sont invalides.");
            return 0; // Ne pas effectuer de tri si les dates sont invalides
        }

        // Tri selon l'ordre spécifié (ascendant ou descendant)
        if (order === 'asc') {
            return dateA - dateB; // Tri par date la plus ancienne en premier
        } else {
            return dateB - dateA; // Tri par date la plus récente en premier
        }
    });

    // Réorganiser les projets dans le DOM
    const catalogContent = document.querySelector('.catalog-content');
    // D'abord les projets avec une date, puis ceux sans date
    [...projectsWithDate, ...projectsWithoutDate].forEach(project => catalogContent.appendChild(project));
}

// Fonction pour trier les projets par ordre alphabétique
function sortProjectsAlphabetically(order) {
    const projects = document.querySelectorAll('.project');
    const projectArray = Array.from(projects);

    // Trier les projets par ordre alphabétique basé sur le titre (h3)
    projectArray.sort((a, b) => {
        const titleA = a.querySelector('h3')?.textContent.trim().toLowerCase();
        const titleB = b.querySelector('h3')?.textContent.trim().toLowerCase();

        if (!titleA || !titleB) {
            console.warn("Titre non trouvé dans un ou plusieurs projets.");
            return 0; // Ignorez les projets sans titre
        }

        // Tri selon l'ordre spécifié (A-Z ou Z-A)
        if (order === 'asc') {
            return titleA.localeCompare(titleB); // A-Z
        } else {
            return titleB.localeCompare(titleA); // Z-A
        }
    });

    // Réorganiser les projets dans le DOM
    const catalogContent = document.querySelector('.catalog-content');
    projectArray.forEach(project => catalogContent.appendChild(project));
}

// Fonction pour gérer les clics dans le menu déroulant
document.querySelectorAll('.sortmenu a').forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le lien de rediriger

        // Désactiver les autres tris avant d'appliquer le nouveau critère
        document.querySelectorAll('.sortmenu a').forEach(link => link.classList.remove('active'));

        // Ajouter la classe 'active' à l'élément sélectionné
        option.classList.add('active');

        // Vérifier quel critère de tri est sélectionné et appliquer le tri correspondant
        const sortType = option.getAttribute('data-sort');
        if (sortType === 'newest') {
            sortProjectsByDate('desc'); // Trier par date, la plus récente en premier
        } else if (sortType === 'oldest') {
            sortProjectsByDate('asc'); // Trier par date, la plus ancienne en premier
        } else if (sortType === 'alphabetical-1') {
            sortProjectsAlphabetically('asc'); // Tri A-Z
        } else if (sortType === 'alphabetical-2') {
            sortProjectsAlphabetically('desc'); // Tri Z-A
        }
    });
});

// ------------------------------------------------------------------------ SEARCH INPUT + SUGGESTION FINALLLLLL


document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner les éléments correctement
    const searchInput = document.querySelector('.search-projects-input');
    const suggestionDiv = document.querySelector('.search-suggestion');
    let projects = Array.from(document.querySelectorAll(".project"));
    let projectNames = Array.from(projects).map(project => project.querySelector('h3')?.textContent.toLowerCase() || '');

    // Réinitialiser les projets et les noms de projets après le chargement dynamique
    document.addEventListener('projectsLoaded', () => {
        projects = Array.from(document.querySelectorAll(".project"));
        projectNames = Array.from(projects).map(project => project.querySelector('h3')?.textContent.toLowerCase() || '');
    });

    // Fonction pour filtrer et afficher la suggestion
    function showProjectSuggestion(query) {
        // Si l'input est vide, retirer la suggestion
        if (!query) {
            suggestionDiv.innerHTML = "";
            suggestionDiv.style.display = "none"; // Cacher les suggestions
            return;
        }

        // Trouver le premier projet dont le nom commence par la saisie
        const matchingProjects = projectNames.filter(projectName => projectName.startsWith(query.toLowerCase()));

        // Si une suggestion est trouvée, on affiche la première suggestion uniquement
        if (matchingProjects.length > 0) {
            suggestionDiv.innerHTML = `<div class="suggestion-item">${matchingProjects[0]}</div>`;
            suggestionDiv.style.display = "block"; // Afficher le div de suggestion
        } else {
            suggestionDiv.innerHTML = "";
            suggestionDiv.style.display = "none"; // Cacher les suggestions si aucune correspondance
        }
    }

    // Fonction de filtrage des projets en fonction du texte saisi
    function filterProjectsByName() {
        const searchQuery = searchInput.value.toLowerCase();
        projects.forEach(project => {
            const projectName = project.querySelector('h3')?.textContent.toLowerCase();
            if (projectName && projectName.includes(searchQuery)) {
                project.style.display = ''; // Affiche le projet
            } else {
                project.style.display = 'none'; // Masque le projet
            }
        });
    }

    // Écouter les événements de saisie dans le champ de recherche pour la suggestion
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value;
        showProjectSuggestion(query); // Afficher les suggestions en fonction de l'input
        filterProjectsByName(); // Filtrer les projets
    });

    // Ajouter un événement pour gérer la sélection d'une suggestion
    suggestionDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('suggestion-item')) {
            searchInput.value = event.target.textContent; // Remplacer la saisie par la suggestion
            showProjectSuggestion(''); // Masquer les suggestions
            filterProjectsByName(); // Re-filtrer les projets après sélection de la suggestion
        }
    });

    // Ajouter l'événement pour gérer l'appui sur "Entrée" (autocomplétion avec la première suggestion)
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            const firstSuggestion = suggestionDiv.querySelector('.suggestion-item');
            if (firstSuggestion) {
                searchInput.value = firstSuggestion.textContent; // Remplacer par la première suggestion
                showProjectSuggestion(''); // Masquer les suggestions
                filterProjectsByName(); // Re-filtrer les projets
            }
        }
    });
});