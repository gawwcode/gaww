// Réinitialisation du formulaire au chargement de la page
window.onload = function() {
    document.getElementById("contact-form").reset();
};

// Sélection des éléments
const form = document.getElementById('contact-form');
const result = document.getElementById('result'); // Assure-toi que cet élément existe dans ton HTML

// Écouteur d'événement pour la soumission
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche la soumission par défaut

    // Vérification du hCaptcha
    const hCaptcha = form.querySelector('textarea[name=h-captcha-response]').value;
    if (!hCaptcha) {
        alert("Please fill out the captcha field");
        return;
    }

    // Vérification du nom complet
    const nameInput = document.querySelector('input[name="name"]');
    const fullName = nameInput.value.trim();
    const nameParts = fullName.split(' ');
    if (nameParts.length < 2) {
        alert('Please enter both a first and last name. Veuillez entrer à la fois un prénom et un nom.');
        return;
    }

    // Si les vérifications passent, définir from_name
    const fromNameInput = document.querySelector('input[name="from_name"]');
    if (fromNameInput) {
        fromNameInput.value = `${nameInput.value} on GAWW`;
    }

    // Préparer les données pour l’envoi
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    result.innerHTML = "Please wait...";

    // Envoyer les données à l’API de web3forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            result.innerHTML = json.message; // Message de succès
            result.classList.add("result-success");
        } else {
            console.log(response);
            result.innerHTML = json.message; // Message d’erreur
            result.classList.add("result-fail");
        }
    })
    .catch(error => {
        console.log(error);
        result.innerHTML = "Something went wrong!";
        result.classList.add("result-danger");
    })
    .then(function() {
        form.reset(); // Réinitialise le formulaire
        setTimeout(() => {
            result.style.display = "none"; // Cache le message après 3 secondes
        }, 3000);
    });
});