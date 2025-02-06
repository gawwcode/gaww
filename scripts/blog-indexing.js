document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".catalog-content");
    if (!container) return;
  
    try {
      const response = await fetch("/blog/blog.json");
      if (!response.ok) throw new Error("Erreur réseau");
      const data = await response.json();
  
      const fragment = document.createDocumentFragment();
  
      Object.entries(data).forEach(([id, project]) => {
        // Création de l'élément projet <a>
        const projectElement = document.createElement("a");
        projectElement.id = `pr${id}`;
        projectElement.className = "transition-1 project";
        projectElement.href = `${project.file}.html`;
  
        // Date
        const dateElement = document.createElement("span");
        dateElement.className = "prdate";
        dateElement.textContent = project.date;
  
        // Image principale
        const imgElement = document.createElement("img");
        imgElement.className = "prbg transition-1";
        imgElement.src = project.image;
        imgElement.alt = project.title;
  
        // Si le projet est verrouillé
        if (project.locked) {
          const lockedDiv = document.createElement("div");
          lockedDiv.className = "prlocked";
          lockedDiv.innerHTML = `
            <svg class="transition-1" fill="rgba(255, 255, 255, 0.1)" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
              <g>
                <path d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15 s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"/>
              </g>
            </svg>`;
          projectElement.appendChild(lockedDiv);
        }
  
        // Titre
        const titleElement = document.createElement("h3");
        titleElement.className = "montserrat";
        titleElement.textContent = project.title;
  
        // Description
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
          // Ajout d'un écouteur pour l'ajout de tag
          tagElement.addEventListener("click", e => {
            // On intercepte pour éviter la navigation vers le projet
            e.preventDefault();
            e.stopPropagation();
            if (typeof addTag === "function") addTag(tag);
          });
          tagsContainer.appendChild(tagElement);
        });
  
        // Assemblage de la carte projet
        projectElement.append(dateElement, imgElement, titleElement, descElement, tagsContainer);
        fragment.appendChild(projectElement);
      });
  
      container.appendChild(fragment);
      document.dispatchEvent(new Event("projectsLoaded"));
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
    }
  });
  
  // Gestion complémentaire via event delegation sur le container (phase capture)
  document.addEventListener("DOMContentLoaded", () => {
    const catalogContainer = document.querySelector(".catalog-content");
    if (!catalogContainer) return;
  
    catalogContainer.addEventListener("click", event => {
      const clickedTag = event.target.closest("a.project .prtag");
      if (clickedTag) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Tag de projet cliqué :", clickedTag.textContent);
        if (typeof addTag === "function") addTag(clickedTag.textContent);
      }
    }, true);
  });
  