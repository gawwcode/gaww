document.addEventListener("DOMContentLoaded", function() {
    // Charger le fichier menu.html et l'injecter dans le body
    fetch('/html/menu.html')
        .then(response => response.text())  // Lire le contenu du fichier
        .then(data => {
            // Insérer directement le contenu du menu au début du body
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => console.error("Erreur de chargement du menu:", error));
});
