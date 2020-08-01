class Accordion {
    constructor(element, selector, startOpen = true) {
        this.selector = selector;
        this.root = element;
        this.header = this.root.querySelector(`.${this.selector.header}`);
        this.list = this.root.querySelector(`.${this.selector.list}`);
        this.icon = this.root.querySelector(`.${this.selector.icon}`);
        this.isOpen = startOpen;

        this.init();
    }

    init() {
        this.icon.addEventListener('click', () => {
            if (this.isOpen) this.close();
            else this.open();
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
    };
    const periods = document.querySelectorAll(`.${config.root}`);
    const accs = [];

    periods.forEach((el) => {
        accs.push(new Accordion(el, config));
    });
})();
