// Fonction pour charger le fichier JSON et rediriger vers un projet aléatoire
async function goToRandomProject() {
    try {
        const response = await fetch('/projects/projects.json');
        const projectsData = await response.json();

        // Filtrer uniquement les projets non verrouillés
        const unlockedProjects = Object.values(projectsData).filter(project => !project.locked);

        // Si aucun projet disponible
        if (unlockedProjects.length === 0) {
            console.warn('Aucun projet disponible');
            return;
        }

        // Choisir un projet au hasard
        const randomIndex = Math.floor(Math.random() * unlockedProjects.length);
        const fileName = unlockedProjects[randomIndex].file;

        console.log('Redirection vers :', fileName);
        window.location.href = fileName;
    } catch (error) {
        console.error('Erreur lors du chargement du fichier JSON:', error);
    }
}

