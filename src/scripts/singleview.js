const config = {
    baseURL: 'http://localhost:5500/',
    singleview: {
        root: 'singleview',
        bg: 'background',
        card: 'singleview__card',
    },
};

async function fetchData(apiURL, parseJSON = true) {
    const response = await fetch(apiURL);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    let data = null;
    if (parseJSON) {
        data = await response.json();
    } else {
        data = await response.text();
    }
    return data;
}

class SingleView {
    constructor(selector, data, template) {
        this.selector = selector;
        this.root = document.querySelector(`.${selector.root}`);
        this.bg = document.querySelector(`.${selector.bg}`);
        this.data = data;
        this.template = template;
        this.lang = 'de';
        this.current = undefined;
        this.prev = undefined;
        this.next = undefined;
        this.currentElement = undefined;

        this.init();
    }

    init() {
        this.bg.addEventListener('click', (event) => {
            event.stopPropagation();
            window.location.hash = '#/';
        });

        window.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowLeft') {
                if (this.prev !== undefined) {
                    window.location.hash = `#/${this.prev.inventoryNumber}/`;
                }
            } else if (event.code === 'ArrowRight') {
                if (this.next !== undefined) {
                    window.location.hash = `#/${this.next.inventoryNumber}/`;
                }
            } else if (event.code === 'Escape') {
                window.location.hash = '#/';
            }
        });
    }

    open(inventoryNumber) {
        this.current = this.getData(inventoryNumber);

        this.root.classList.remove(`${this.selector.root}--visible`);
        this.bg.classList.remove(`${this.selector.bg}--visible`);

        if (this.current === undefined) {
            this.currentElement = undefined;
            this.next = undefined;
            this.prev = undefined;
            return;
        }

        this.currentElement = document.querySelector(`.period-list__item[data-inventoryNumber="${inventoryNumber}"]`);
        this.prev = this.getData(this.currentElement.dataset.prev);
        this.next = this.getData(this.currentElement.dataset.next);

        this.root.classList.add(`${this.selector.root}--visible`);
        this.bg.classList.add(`${this.selector.bg}--visible`);

        this.fillWithData(this.current);
    }

    openWithUrl(url) {
        this.open(SingleView.getInventoryNumber(url));
    }

    fillWithData(data) {
        // eslint-disable-next-line no-undef
        const rendered = Mustache.render(this.template, {
            ...data,
            prev: {
                inventoryNumber: this.prev?.inventoryNumber,
                title: this.prev?.titles[0].title,
            },
            next: {
                inventoryNumber: this.next?.inventoryNumber,
                title: this.next?.titles[0].title,
            },
        });

        this.root.innerHTML = rendered;
    }

    getData(inventoryNumber) {
        return this.data[this.lang]?.find((el) => el.inventoryNumber === inventoryNumber);
    }

    static getInventoryNumber(url) {
        return url.replace(config.baseURL, '').replace('#', '').replace('/', '').replace('/', '');
    }
}

(async () => {
    const data = {
        de: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.de.json`)).items,
        en: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.en.json`)).items,
    };

    const template = await fetchData(`${config.baseURL}src/templates/singleview.mustache.html`, false);

    const singleview = new SingleView(config.singleview, data, template);

    if (window.location.hash === '') {
        window.location.hash = '#/';
    } else {
        singleview.openWithUrl(window.location.hash);
    }

    window.addEventListener('hashchange', (event) => {
        singleview.openWithUrl(event.newURL);
    });
})();
