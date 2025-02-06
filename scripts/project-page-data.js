document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');
    const projectId = mainElement?.id;
  
    if (!projectId) {
      console.error('Aucun id de projet trouvé dans la balise <main>');
      return;
    }
  
    fetch('/gaww/projects/projects.json')
      .then(response => response.json())
      .then(data => {
        const project = data[projectId];
        if (!project) {
          console.error('Projet non trouvé dans le fichier JSON');
          return;
        }
  
        const { title, image, tags, date } = project;
  
        // Mise à jour du titre
        const projectTitle = document.querySelector('.project-title');
        if (projectTitle) projectTitle.textContent = title;
  
        // Mise à jour de l'image
        const projectImage = document.querySelector('.project-image');
        if (projectImage) {
          projectImage.src = image;
          projectImage.alt = title;
        }
  
        // Mise à jour des tags
        const projectTags = document.querySelector('.prtags');
        if (projectTags) {
          projectTags.innerHTML = tags.map(tag => `<span class="prtag">${tag}</span>`).join('');
        }
  
        // Mise à jour de la date
        const projectDate = document.querySelector('.date');
        if (projectDate) {
          const formattedDate = new Date(date).toLocaleDateString();
          projectDate.textContent = formattedDate;
          projectDate.dataset.date = date;
        }
  
        // Émission de l'événement personnalisé une fois les tags générés
        document.dispatchEvent(new Event('tagsGenerated'));
      })
      .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
  });
  
