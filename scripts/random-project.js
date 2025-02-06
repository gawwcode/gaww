// Fonction pour charger le fichier JSON et rediriger vers un projet aléatoire
async function goToRandomProject() {
    try {
        // Charger le fichier JSON
        const response = await fetch('/gaww/projects/projects.json');
        const projectsData = await response.json();

        // Récupérer un ID au hasard dans le JSON
        const projectIds = Object.keys(projectsData);
        const randomIndex = Math.floor(Math.random() * projectIds.length);
        const randomProjectId = projectIds[randomIndex];

        // Extraire la page à partir de l'attribut "file"
        const fileName = projectsData[randomProjectId].file;

        // Rediriger vers la page HTML correspondante
        window.location.href = '/projects/' + fileName + '.html';
    } catch (error) {
        console.error('Erreur lors du chargement du fichier JSON:', error);
    }
}
