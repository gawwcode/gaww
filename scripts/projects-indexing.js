document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".catalog-content");

    fetch("/gaww/projects/projects.json")
        .then(response => response.json())
        .then(data => {
            for (const id in data) {
                if (!data.hasOwnProperty(id)) continue;
                
                const project = data[id];

                // Création de l'élément <a> (projet)
                const projectElement = document.createElement("a");
                projectElement.id = `pr${id}`;
                projectElement.className = "transition-1 project";
                projectElement.href = project.file + '.html';

                // Span pour la date
                const dateElement = document.createElement("span");
                dateElement.className = "prdate";
                dateElement.textContent = project.date;

                // Image principale
                const imgElement = document.createElement("img");
                imgElement.className = "prbg transition-1";
                imgElement.src = project.image;
                imgElement.alt = project.title;

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

                // Titre du projet
                const titleElement = document.createElement("h3");
                titleElement.className = "montserrat";
                titleElement.textContent = project.title;

                // Description du projet
                const descElement = document.createElement("p");
                descElement.className = "project-description transition-1";
                descElement.textContent = project.description;

                // Tags
                const tagsContainer = document.createElement("div");
                tagsContainer.className = "prtags";
                project.tags.forEach(tag => {
                    const tagElement = document.createElement("span");
                    tagElement.className = "prtag";
                    tagElement.textContent = tag;
                    // Assigner onclick pour appeler addTag en lui passant le texte du tag
                    tagElement.onclick = function() {
                        if (typeof addTag === "function") {
                            addTag(this.textContent);
                        }
                    };
                    tagsContainer.appendChild(tagElement);
                });
                

                // Ajout des éléments à la carte projet
                projectElement.appendChild(dateElement);
                projectElement.appendChild(imgElement);
                projectElement.appendChild(titleElement);
                projectElement.appendChild(descElement);
                projectElement.appendChild(tagsContainer);

                // Ajout de la carte au conteneur
                container.appendChild(projectElement);
            }

            // Émettre un événement personnalisé une fois les projets chargés
            const event = new Event("projectsLoaded");
            document.dispatchEvent(event);
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
  
