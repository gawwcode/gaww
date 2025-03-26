// Récupérer la phrase depuis l'API
document.getElementById('generateButton').addEventListener('click', async () => {
    try {
        // Afficher un indicateur de chargement
        document.getElementById('theme').textContent = "Loading...";

        // Appeler l'API PythonAnywhere
        const response = await fetch('https://gaww.pythonanywhere.com/generate-theme');
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Extraire les données JSON
        const data = await response.json();
        
        // Afficher la phrase
        document.getElementById('theme').textContent = data.theme;
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la génération du thème:', error);
        document.getElementById('theme').textContent = 'Erreur. Réessayez.';
    }
});