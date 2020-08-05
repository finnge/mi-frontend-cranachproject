(() => {
    const langSelect = document.querySelector('.page-header__lang');
    const htmlElement = document.querySelector('html');

    langSelect.addEventListener('change', (event) => {
        const { value } = event.target.selectedOptions[0];

        htmlElement.setAttribute('lang', value);
    });

    
})();
