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
    constructor(selector, data) {
        this.data = data;
        this.root = document.querySelector(selector);
        this.lang = 'de';
        this.current = undefined;
    }

    open(inventoryNumber) {
        this.current = this.getData(inventoryNumber);

        this.root.className = this.root.className.replace(' singleview--visible', '');

        if (this.current === undefined) {
            return;
        }

        this.root.className += ' singleview--visible';
    }

    openWithUrl(url) {
        this.open(SingleView.getInventoryNumber(url));
    }

    close() {
        // delete all data
        // remove class
    }

    fillWithData(data) {

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
        de: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.de.json`, true)).items,
        en: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.en.json`, true)).items,
    };

    const singleview = new SingleView('.singleview', data);

    // get url hash
    // if null => put '#/' as url hash
    // if !null => open single view

    if (window.location.hash === '') {
        window.location.hash = '#/';
    } else {
        singleview.openWithUrl(window.location.hash);
    }

    window.addEventListener('hashchange', (event) => {
        singleview.openWithUrl(event.newURL);
    });

    console.log(data);
})();
