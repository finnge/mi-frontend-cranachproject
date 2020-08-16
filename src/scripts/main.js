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

Object.defineProperty(window.location, 'language', {
    get: () => {
        const language = window.location.hash.match(/(?<=#\/)[a-z]{2}(?=\/)/);

        return language === null ? null : language[0];
    },
    set: (language) => {
        window.location.hash = `#/${language}/${window.location.inventoryNumber}/`;
    },
});

Object.defineProperty(window.location, 'inventoryNumber', {
    get: () => {
        const inventoryNumber = window.location.hash.match(/(?<=#\/[a-z]{2}\/)([\w-]+)?/);

        return inventoryNumber === null ? null : inventoryNumber[0];
    },
    set: (inventoryNumber) => {
        window.location.hash = `#/${window.location.language}/${inventoryNumber}/`;
    },
});

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

/**
 * Main-Routine
 */
(async () => {
    const data = {
        de: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.de.json`)).items,
        en: (await fetchData(`${config.baseURL}src/data/cda-paintings-v2.en.json`)).items,
    };

    const template = {
        singleview: await fetchData(`${config.baseURL}src/templates/singleview.mustache.html`, false),
    };

    /**
     * Defaults
     */
    if (window.location.language === null) {
        window.location.language = 'de';
    }

    /**
     * Single-View
     */
    // eslint-disable-next-line no-undef
    const singleview = new SingleView(
        config.singleview,
        config.baseURL,
        window.location.language,
        data,
        template.singleview,
    );
    singleview?.open(window.location.inventoryNumber);
    window.addEventListener('hashchange', () => {
        singleview?.open(window.location.inventoryNumber);
    });

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
        // eslint-disable-next-line no-undef
        accs.push(new Accordion(el, config.accordion, config.language));
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

    settingsElement?.collapseAll?.addEventListener('change', (event) => {
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
        config.language(value);
    });
})();


/**
 * - [ ] check if url fits norm => go to basic (could be smarter)
 * - [ ] Ask for languge if hash is not to norm
 * - [ ] url is home for language => extract language from url / change language from url
 * - [ ] ID is home for singleview => extract ID from url / change ID from URL
 * - [ ] change DOM from hash change => only with language (event)
 * - [ ] change select element from hash value (event)
 */