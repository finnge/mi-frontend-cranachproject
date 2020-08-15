class Accordion {
    constructor(element, selector, startOpen = true) {
        this.selector = selector;
        this.root = element;
        this.header = this.root.querySelector(`.${this.selector.header}`);
        this.list = this.root.querySelector(`.${this.selector.list}`);
        this.icon = this.root.querySelector(`.${this.selector.icon}`);
        this.artefacts = this.list.querySelectorAll(`.${this.selector.list}__item`);
        this.isOpen = startOpen;

        this.lang = () => document.querySelector('html').getAttribute('lang');

        this.init();
    }

    init() {
        this.icon.addEventListener('click', () => {
            if (this.isOpen) this.close();
            else this.open();
        });

        // language
        /*document.querySelector('html').addEventListener('change', (event) => {
            this.artefacts.forEach((el) => {
                const newTitle = el.getAttribute(`data-title-${event.target.selectedOptions[0].value}`);

                const artefact = el.querySelector('.artefact');
                const artefactImage = el.querySelector('.artefact__image');

                artefact.setAttribute('title', newTitle);
                artefactImage.setAttribute('alt', newTitle);
            });
        });*/

        // colapse all
        document.getElementById(this.selector.collapse_all).addEventListener('change', (event) => {
            if (event.target.checked) {
                this.close();
            } else {
                this.open();
            }
        });
    }

    open() {
        this.list.classList.remove(`${this.selector.list}--minified`);
        this.icon.innerHTML = 'expand_less';
        this.isOpen = true;
    }

    close() {
        this.list.classList.add(`${this.selector.list}--minified`);
        this.icon.innerHTML = 'expand_more';
        this.isOpen = false;
    }
}

(() => {
    const config = {
        root: 'period',
        header: 'period-header',
        list: 'period-list',
        icon: 'period-header__icon',
        collapse_all: 'settings__collapse-all',
    };
    const periods = document.querySelectorAll(`.${config.root}`);
    const accs = [];

    const settingsElement = {
        collapseAll: document.getElementById(config.collapse_all),
        collapseAllLabel: document.querySelector(`label[for="${config.collapse_all}"]`),
    };

    periods.forEach((el) => {
        accs.push(new Accordion(el, config));
    });

    function checkForSmallViewport(vw) {
        if (vw <= 800) {
            accs.forEach((el) => {
                el.close();
            });
        } else {
            accs.forEach((el) => {
                el.open();
            });
        }
    }
    window.addEventListener('resize', () => {
        checkForSmallViewport(window.innerWidth);
    });
    checkForSmallViewport(window.innerWidth);

    settingsElement.collapseAll.addEventListener('change', (event) => {
        if (event.target.checked) {
            settingsElement.collapseAllLabel.innerHTML = 'unfold_more';
        } else {
            settingsElement.collapseAllLabel.innerHTML = 'unfold_less';
        }
    });
})();
