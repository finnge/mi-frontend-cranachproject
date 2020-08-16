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

/**
 * Main-Routine
 */
(async () => {
    const config = {
        baseURL: 'http://localhost:5500/',
        singleview: {
            root: 'singleview',
            bg: 'background',
            card: 'singleview__card',
        },
        accordion: {
            root: 'period',
            header: 'period-header',
            list: 'period-list',
            icon: 'period-header__icon',
            collapse_all: 'settings__collapse-all',
        },
    };

    const data = {
        de: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.de.json`)).items,
        en: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.en.json`)).items,
    };

    const template = {
        singleview: await fetchData(`${config.baseURL}src/templates/singleview.mustache.html`, false),
    };

    /**
     * Single-View
     */
    const singleview = new SingleView(config.singleview, config.baseURL, data, template.singleview);
    window.addEventListener('hashchange', (event) => {
        singleview?.openWithUrl(event.newURL);
    });
    if (window.location.hash === '') {
        window.location.hash = '#/';
    } else {
        singleview?.openWithUrl(window.location.hash);
    }

    /**
     * Periods
     */
    const periods = document.querySelectorAll(`.${config.root}`);
    const accs = [];
    const settingsElement = {
        collapseAll: document.getElementById(config.collapse_all),
        collapseAllLabel: document.querySelector(`label[for="${config.collapse_all}"]`),
    };

    periods.forEach((el) => {
        accs.push(new Accordion(el, config.accordion));
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

    settingsElement?.collapseAll.addEventListener('change', (event) => {
        if (event.target.checked) {
            settingsElement.collapseAllLabel.innerHTML = 'unfold_more';
        } else {
            settingsElement.collapseAllLabel.innerHTML = 'unfold_less';
        }
    });

    /**
     * Language
     */
    const langSelect = document.querySelector('.page-header__lang');
    const htmlElement = document.querySelector('html');

    langSelect?.addEventListener('change', (event) => {
        const { value } = event.target.selectedOptions[0];

        htmlElement?.setAttribute('lang', value);
    });
})();
