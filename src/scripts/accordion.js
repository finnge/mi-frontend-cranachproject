const config = {
    baseURL: 'http://localhost:5500/',
    accordion: {
        root: 'period',
        header: 'period-header',
        list: 'period-list',
        icon: 'period-header__icon',
    },
};

class Accordion {
    constructor(element, selector, state = 'open') {
        this.selector = selector;
        this.root = element;
        this.header = this.root.querySelector(`.${this.selector.header}`);
        this.list = this.root.querySelector(`.${this.selector.list}`);
        this.icon = this.root.querySelector(`.${this.selector.icon}`);
        this.state = state;
    }

    init() {
        this.icon.addEventListener('click', () => {
            if (this.state === 'open') this.close();
            else if (this.state === 'close') this.open();
        });
    }

    open() {
        this.list.classList.remove(`${this.selector.list}--minified`);
        this.icon.innerHTML = 'expand_less';
    }

    close() {
        this.list.classList.add(`${this.selector.list}--minified`);
        this.icon.innerHTML = 'expand_more';
    }
}

(() => {

})();
