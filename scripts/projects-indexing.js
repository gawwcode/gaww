document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".catalog-content");

    fetch("/projects/projects.json")
        .then(response => response.json())
        .then(data => {
            // Charge le fichier de langue (exemple en anglais)
            fetch("/languages/en.json")
                .then(resp => resp.json())
                .then(translations => {
                    // Avant la boucle for (juste après avoir récupéré "data")
                    const sortedProjects = Object.entries(data).sort(([, a], [, b]) => {
                        // Trie du plus récent au plus ancien
                        return new Date(b.date) - new Date(a.date);
                    });

                    // Puis boucle sur sortedProjects
                    for (const [id, project] of sortedProjects) {
                        // Création de l'élément <a> (projet)
                        const projectElement = document.createElement("a");
                        projectElement.id = `pr${id}`;
                        projectElement.className = "transition-1 project";
                        projectElement.setAttribute('data-translation-key', key);

                        // On remet le href même pour les projets locked
                        projectElement.href = project.file;

                        // On retire toute désactivation du pointer-events ou du clic
                        if (project.locked) {
                            projectElement.classList.add("locked");
                            // Ne pas ajouter pointer-events: none ni event.preventDefault()
                        }

                        // Span pour la date
                        if (project.date) {
                            const dateEl = document.createElement("span");
                            dateEl.className = "prdate";
                            dateEl.textContent = project.date;
                            projectElement.appendChild(dateEl);
                        }

                        // Image principale
                        if (project.image) {
                            const imgElement = document.createElement("img");
                            imgElement.className = "prbg transition-1";
                            imgElement.src = project.image;
                            imgElement.alt = translations["projects-catalog"]?.[key] || project.title;
                            projectElement.appendChild(imgElement);
                        }

                        // Vérification si le projet est verrouillé
                        if (project.locked) {
                            const lockedDiv = document.createElement("div");
                            lockedDiv.className = "prlocked";
                            lockedDiv.innerHTML = `
        <svg class="transition-1" fill="rgba(255, 255, 255, 0.1)" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
            <g><path d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85 S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15 s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25 C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"/></g>
        </svg>`;
                            projectElement.appendChild(lockedDiv);
                        }

                        // Titre du projet (avec traduction)
                        const titleElement = document.createElement("h3");
                        titleElement.className = "montserrat project-title";
                        const key = project.translationKey;
                        titleElement.textContent = translations["projects-catalog"]?.[key] || project.title;

                        // Description du projet (avec traduction)
                        const descElement = document.createElement("p");
                        descElement.className = "project-description transition-1";
                        descElement.textContent = translations["projects-descriptions"]?.[key] || project.description;

                        // Tags
                        const tagsContainer = document.createElement("div");
                        tagsContainer.className = "prtags";
                        project.tags.forEach(tag => {
                            const tagEl = document.createElement("span");
                            tagEl.className = "prtag " + (tag.toLowerCase() + "tag"); // ex: "Book" => "booktag"
                            tagEl.textContent = tag;
                            tagsContainer.appendChild(tagEl);
                        });
                        projectElement.appendChild(tagsContainer);

                        // Ajout des éléments à la carte projet
                        projectElement.appendChild(imgElement);      // image
projectElement.appendChild(titleElement);    // titre
projectElement.appendChild(descElement);     // description
projectElement.appendChild(tagsContainer);   // tags

                        // Ajout de la carte au conteneur
                        container.appendChild(projectElement);
                    }

                    // Émettre un événement personnalisé une fois les projets chargés
                    const event = new Event("projectsLoaded");
                    document.dispatchEvent(event);
                });
        })
        .catch(error => console.error("Erreur lors du chargement des projets :", error));
});

document.addEventListener("DOMContentLoaded", function() {
    const catalogContainer = document.querySelector(".catalog-content");
    
    // On écoute les clics sur le container en phase capture
    catalogContainer.addEventListener("click", function(event) {
      // On vérifie si l'élément cliqué (ou l'un de ses parents) correspond à un tag dans une carte projet
      const clickedTag = event.target.closest("a.project .prtag");
      
      if (clickedTag) {
        // On intercepte le clic avant qu'il n'atteigne le <a> parent
        event.preventDefault();
        event.stopPropagation();
        
        console.log("Tag de projet cliqué :", clickedTag.textContent);
        
        // Appelle la fonction addTag si elle existe
        if (typeof addTag === "function") {
          addTag(clickedTag.textContent);
        }
      }
    }, true); // true pour utiliser la phase de capture
  });

// Ajoute cette fonction globale
window.renderProjects = function(lang = 'en') {
    const container = document.querySelector(".catalog-content");
    container.innerHTML = ""; // Vide le catalogue

    fetch(`/languages/${lang}.json`)
        .then(resp => resp.json())
        .then(translations => {
            fetch("/projects/projects.json")
                .then(response => response.json())
                .then(data => {
                    // Avant la boucle for (juste après avoir récupéré "data")
                    const sortedProjects = Object.entries(data).sort(([, a], [, b]) => new Date(b.date) - new Date(a.date));
                    for (const [id, project] of sortedProjects) {
                        const key = project.translationKey;
                        const projectElement = document.createElement("a");
                        projectElement.className = "transition-1 project";
                        projectElement.setAttribute('data-translation-key', key);

                        // On remet le href même pour les projets locked
                        projectElement.href = project.file;

                        // On retire toute désactivation du pointer-events ou du clic
                        if (project.locked) {
                            projectElement.classList.add("locked");
                            // Ne pas ajouter pointer-events: none ni event.preventDefault()
                        }

                        // Image
                        if (project.image) {
                            const imgElement = document.createElement("img");
                            imgElement.className = "prbg transition-1";
                            imgElement.src = project.image;
                            imgElement.alt = translations["projects-catalog"]?.[key] || project.title;
                            projectElement.appendChild(imgElement);
                        }

                        // prlocked
                        if (project.locked) {
                            const lockedDiv = document.createElement("div");
                            lockedDiv.className = "prlocked";
                            lockedDiv.innerHTML = `
        <svg class="transition-1" fill="rgba(255, 255, 255, 0.1)" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
            <g><path d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85 S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15 s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25 C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"/></g>
        </svg>`;
                            projectElement.appendChild(lockedDiv);
                        }

                        // Date
                        if (project.date) {
                            const dateEl = document.createElement("span");
                            dateEl.className = "prdate";
                            dateEl.textContent = project.date;
                            projectElement.appendChild(dateEl);
                        }

                        // Titre
                        const titleElement = document.createElement("h3");
                        titleElement.className = "montserrat project-title";
                        titleElement.textContent = translations["projects-catalog"]?.[key] || project.title;

                        // Description
                        const descElement = document.createElement("p");
                        descElement.className = "project-description transition-1";
                        descElement.textContent = translations["projects-descriptions"]?.[key] || project.description;

                        // Tags
                        const tagsContainer = document.createElement("div");
                        tagsContainer.className = "prtags";
                        if (project.tags) {
                            project.tags.forEach(tag => {
                                const tagEl = document.createElement("span");
                                tagEl.className = "prtag " + (tag.toLowerCase() + "tag");
                                tagEl.textContent = tag;
                                tagsContainer.appendChild(tagEl);
                            });
                        }
                        projectElement.appendChild(titleElement);
                        projectElement.appendChild(descElement);
                        projectElement.appendChild(tagsContainer);

                        container.appendChild(projectElement);
                    }

                    // À la fin de renderProjects ou après la boucle d'ajout
                    document.dispatchEvent(new Event("projectsLoaded"));
                });
        });
};

window.updateProjectTranslations = function(lang = 'en') {
    fetch(`/languages/${lang}.json`)
        .then(resp => resp.json())
        .then(translations => {
            document.querySelectorAll('.project').forEach(projectEl => {
                const key = projectEl.getAttribute('data-translation-key');
                const titleEl = projectEl.querySelector('h3');
                const descEl = projectEl.querySelector('.project-description');
                if (titleEl && key) {
                    titleEl.textContent = translations["projects-catalog"]?.[key] || titleEl.textContent;
                }
                if (descEl && key) {
                    descEl.textContent = translations["projects-descriptions"]?.[key] || descEl.textContent;
                }
            });
        });
};

// Exemple de détection de langue
const userLang = navigator.language.startsWith('fr') ? 'fr' : 'en';

// Génère les projets dans la bonne langue au chargement
if (window.renderProjects) window.renderProjects(userLang);

