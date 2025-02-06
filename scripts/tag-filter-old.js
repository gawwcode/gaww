// Filtrage et suggestions de tags
document.addEventListener('projectsLoaded', async () => {
    const inputField = document.querySelector('.tag-input');
    const tagList = document.querySelector('.tag-list');
    const suggestion = document.querySelector('.tag-suggestion');
    let activeTags = [];
    let allTags = {};

    // Chargement des styles des tags
    try {
        const response = await fetch('/projects/tags.json');
        if (response.ok) {
            allTags = await response.json();
        } else {
            console.error('Erreur lors du chargement de tags.json');
        }
    } catch (error) {
        console.error('Erreur de chargement du fichier JSON:', error);
    }

    // Normalisation des tags
    const normalize = (str) => {
        return str.toLowerCase()
            .trim()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprime les accents
            .replace(/\s+/g, '-');
    };

    // Gestion de l'input
    inputField.addEventListener('input', (e) => {
        const input = normalize(e.target.value);

        // Ne proposer une suggestion que si l'utilisateur a écrit quelque chose
        if (input.trim() === '') {
            suggestion.textContent = ''; 
            suggestion.style.display = 'none'; // Masquer la suggestion si l'input est vide
            return;
        }

        // Trouver le premier tag correspondant à l'entrée
        const match = Object.keys(allTags).find(tag => normalize(tag).startsWith(input));

        // Affichage de la suggestion ou masquage si aucune correspondance
        if (match) {
            suggestion.textContent = match; // Afficher la suggestion
            suggestion.style.display = 'block'; // Afficher le conteneur de suggestion
        } else {
            suggestion.textContent = '';
            suggestion.style.display = 'none'; // Masquer si aucune correspondance
        }
    });

    // Ajout de tag avec Enter
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = inputField.value.trim();

            // Si une suggestion est présente, on l'ajoute
            if (suggestion.textContent) {
                addTag(suggestion.textContent);
            } else if (value) { // Sinon on ajoute ce que l'utilisateur a écrit
                addTag(value);
            }
        }
    });

    // Suppression de tag avec Backspace
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && inputField.value === '') {
            activeTags.pop();
            updateTags();
        }
    });

    // Retirer le gestionnaire de clic sur la suggestion
    // suggestion.removeEventListener('click', ...); // Pas besoin de cela, car la suggestion n'est pas cliquable

    function addTag(tag) {
        const normalized = normalize(tag);
        if (!activeTags.includes(normalized)) {
            activeTags.push(normalized);
            updateTags();
        }
        inputField.value = '';
        suggestion.textContent = '';
        suggestion.style.display = 'none'; // Masquer la suggestion après l'ajout du tag
    }

    function removeTag(index) {
        activeTags.splice(index, 1);
        updateTags();
    }

    function updateTags() {
        // Mise à jour de l'affichage des tags avec les classes CSS correctes
        tagList.innerHTML = activeTags.map((tag, i) => {
            const tagClass = allTags[tag] || ''; // Récupérer la classe CSS associée
            return `
                <li class="prtag ${tagClass}">
                    ${tag}
                    <span class="remove-tag" onclick="this.parentElement.dispatchEvent(new Event('removeTag'))">✕</span>
                </li>
            `;
        }).join('');

        // Gestion des événements de suppression
        tagList.querySelectorAll('.prtag').forEach((item, i) => {
            item.addEventListener('removeTag', () => removeTag(i));
        });

        filterProjects();
    }

    function filterProjects() {
        document.querySelectorAll('.project').forEach(project => {
            const projectTags = [...project.querySelectorAll('.prtag')]
                .map(t => normalize(t.textContent));
            
            const hasAllTags = activeTags.every(t => projectTags.includes(t));
            project.style.display = hasAllTags ? 'flex' : 'none';
        });
    }

    window.addTag = function(tag) {
        const normalized = normalize(tag);
        if (!activeTags.includes(normalized)) {
            activeTags.push(normalized);
            updateTags();
        }
        inputField.value = '';
        suggestion.textContent = '';
        suggestion.style.display = 'none';
    };
});
