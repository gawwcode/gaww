function copyCode(button) {
    // Trouver le bloc <code> dans le même conteneur que le bouton
    const codeBlock = button.closest('pre').querySelector('code');
    const text = codeBlock.innerText;

    // Copier dans le presse-papiers
    navigator.clipboard.writeText(text).then(() => {
      // Changer temporairement le texte du bouton pour indiquer que c'est copié
      button.textContent = 'Copied !';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000); // Revenir à "Copier" après 2 secondes
    }).catch(err => {
      console.error('Erreur lors de la copie :', err);
    });
  }