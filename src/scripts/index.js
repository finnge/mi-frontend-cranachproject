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
    constructor(selector) {

    }

    switchArtefact() {
        
    }

    close() {

    }

    open() {

    }
}

(async () => {
    const data = {
        de: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.de.json`, true)).items,
        en: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.en.json`, true)).items,
    };

    const singleview = new SingleView('.singleview');

    console.log(data);
})();
