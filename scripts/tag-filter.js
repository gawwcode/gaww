document.addEventListener('projectsLoaded', async () => {
    const inputField = document.querySelector('.tag-input');
    const tagList = document.querySelector('.tag-list');
    const suggestion = document.querySelector('.tag-suggestion');
    const activeTags = [];
    let allTags = {};
  
    // Chargement du fichier JSON contenant les styles de tags
    try {
      const response = await fetch('/gaww/projects/tags.json');
      if (response.ok) {
        allTags = await response.json();
      } else {
        console.error('Erreur lors du chargement de tags.json');
      }
    } catch (error) {
      console.error('Erreur de chargement du fichier JSON:', error);
    }
  
    // Fonction de normalisation des tags
    const normalize = str =>
      str.toLowerCase().trim()
         .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
         .replace(/\s+/g, '-');
  
    // Gestion de l'input : suggestion de tag
    inputField.addEventListener('input', (e) => {
      const input = normalize(e.target.value);
      if (!input) {
        suggestion.textContent = '';
        suggestion.style.display = 'none';
        return;
      }
      // Recherche du premier tag dont la version normalisée commence par l'input
      const match = Object.keys(allTags).find(tag => normalize(tag).startsWith(input));
      if (match) {
        suggestion.textContent = match;
        suggestion.style.display = 'block';
      } else {
        suggestion.textContent = '';
        suggestion.style.display = 'none';
      }
    });
  
    // Ajout de tag lors de l'appui sur Enter
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = inputField.value.trim();
        if (suggestion.textContent) {
          addTag(suggestion.textContent);
        } else if (value) {
          addTag(value);
        }
      }
    });
  
    // Suppression du dernier tag avec Backspace lorsque l'input est vide
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && inputField.value === '') {
        activeTags.pop();
        updateTags();
      }
    });
  
    // Utilisation de l'event delegation pour gérer la suppression des tags
    tagList.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-tag')) {
        const li = e.target.closest('li.prtag');
        if (li) {
          const index = Number(li.dataset.index);
          removeTag(index);
        }
      }
    });
  
    // Ajout d'un tag s'il n'est pas déjà présent
    function addTag(tag) {
      const normalized = normalize(tag);
      if (!activeTags.includes(normalized)) {
        activeTags.push(normalized);
        updateTags();
      }
      inputField.value = '';
      suggestion.textContent = '';
      suggestion.style.display = 'none';
    }
  
    function removeTag(index) {
      activeTags.splice(index, 1);
      updateTags();
    }
  
    // Mise à jour de l'affichage des tags et filtrage des projets
    function updateTags() {
      tagList.innerHTML = activeTags
        .map((tag, i) => {
          const tagClass = allTags[tag] || '';
          return `<li class="prtag ${tagClass}" data-index="${i}">
                    ${tag}
                    <span class="remove-tag">✕</span>
                  </li>`;
        })
        .join('');
      filterProjects();
    }
  
    // Filtrage des projets en fonction des tags actifs
    function filterProjects() {
      document.querySelectorAll('.project').forEach(project => {
        const projectTags = Array.from(project.querySelectorAll('.prtag'))
                                  .map(t => normalize(t.textContent));
        const hasAllTags = activeTags.every(t => projectTags.includes(t));
        project.style.display = hasAllTags ? 'flex' : 'none';
      });
    }
  
    // Exposer la fonction addTag globalement
    window.addTag = addTag;
  });
  
