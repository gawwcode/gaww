function copyCode(button) {
    // Trouver le conteneur parent
    const container = button.closest('.code-wrapper');
    // Puis trouver le bloc <code> à l’intérieur de ce conteneur
    const codeBlock = container.querySelector('code');
    const text = codeBlock.innerText;

    // Copier dans le presse-papiers
    navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied !';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    }).catch(err => {
        console.error('Erreur lors de la copie :', err);
    });
}