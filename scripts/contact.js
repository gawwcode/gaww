window.onload = function() {
    // Reset the form fields when the page loads
    document.getElementById("contact-form").reset();
};

const form = document.getElementById('contact-form');

form.addEventListener('submit', function(e) {

    const hCaptcha = form.querySelector('textarea[name=h-captcha-response]').value;

    if (!hCaptcha) {
        e.preventDefault();
        alert("Please fill out captcha field")
        return
    }
});

document.getElementById("contact-form").addEventListener("submit", function (event) {
    const nameInput = document.querySelector('input[name="name"]');
    const fromNameInput = document.querySelector('input[name="from_name"]');

    // Vérification si le champ "name" contient au moins deux mots (prénom et nom)
    const fullName = nameInput.value.trim();
    const nameParts = fullName.split(' ');

    if (nameParts.length < 2) {
        alert('Please enter both a first and last name. Veuillez entrer à la fois un prénom et un nom.');
        event.preventDefault(); // Empêche la soumission du formulaire
    } else if (nameInput && fromNameInput) {
        fromNameInput.value = `${nameInput.value} on GAWW`;
    }
});


