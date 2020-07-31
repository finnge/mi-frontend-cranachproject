(() => {
    const langSelect = document.querySelector('.page-header__lang');
    const htmlElement = document.querySelector('html');

    langSelect.addEventListener('change', (event) => {
        const { selectedIndex } = event.target;
        const { value } = event.target[selectedIndex];

        htmlElement.setAttribute('lang', value);
    });
})();
