// tags.js
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 1. Charge tags.json
        const tagsResponse = await fetch('/projects/tags.json');
        const tagClasses = await tagsResponse.json();

        // 2. Fonction pour styliser les tags
        const applyTagStyles = () => {
            const tagElements = document.querySelectorAll('.prtag');
            tagElements.forEach(tagElement => {
                const tagText = tagElement.textContent.trim();
                const tagClass = tagClasses[tagText];
                if (tagClass) {
                    tagElement.classList.add(tagClass);
                }
            });
        };

        // 3. Applique les styles IMMÉDIATEMENT (au cas où les tags existent déjà)
        applyTagStyles();

        // 4. Écoute les événements pour les tags générés ultérieurement
        document.addEventListener('projectsLoaded', applyTagStyles);
        document.addEventListener('tagsGenerated', applyTagStyles);

    } catch (error) {
        console.error('Erreur lors du chargement des styles des tags :', error);
    }
});
