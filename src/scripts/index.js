const config = {
    baseURL: 'http://localhost:5500/',
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
        this.root = document.querySelector(selector);
        this.data = data;
        this.template = template;
        this.lang = 'de';
        this.current = undefined;
    }

    open(inventoryNumber) {
        this.current = this.getData(inventoryNumber);

        this.root.classList.remove('singleview-container--visible');

        if (this.current === undefined) {
            return;
        }

        this.root.classList.add('singleview-container--visible');

        this.fillWithData(this.current);
    }

    openWithUrl(url) {
        this.open(SingleView.getInventoryNumber(url));
    }

    close() {
        // delete all data
        // remove class
    }

    fillWithData(data) {
        // eslint-disable-next-line no-undef
        const rendered = Mustache.render(this.template, data);

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

    const template = await fetchData(`${config.baseURL}src/templates/card.mustache.html`, false);

    const singleview = new SingleView('.singleview-container', data, template);

    if (window.location.hash === '') {
        window.location.hash = '#/';
    } else {
        singleview.openWithUrl(window.location.hash);
    }

    window.addEventListener('hashchange', (event) => {
        singleview.openWithUrl(event.newURL);
    });
})();
