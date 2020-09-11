const languageEvent = new Event('langchange');
const inventoryNumberEvent = new Event('artefactchange');

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

function isHashConform(hash) {
    const pattern = /#\/[a-z]{2}\/([\w]+\/)?/;

    return pattern.test(hash);
}

Object.defineProperty(window.location, 'language', {
    get: () => {
        const language = window.location.hash.match(/(?<=#\/)[a-z]{2}(?=\/)/);

        return language === null ? null : language[0];
    },
    set: (language) => {
        const { inventoryNumber } = window.location;
        window.location.hash = `#/${(language === null) ? '' : `${language}/`}${(inventoryNumber === null) ? '' : `${inventoryNumber}/`}`;

        window.dispatchEvent(languageEvent);
    },
});

Object.defineProperty(window.location, 'inventoryNumber', {
    get: () => {
        const inventoryNumber = window.location.hash.match(/(?<=#\/[a-z]{2}\/)([\w-]+)?(?=\/)/);

        return inventoryNumber === null ? null : inventoryNumber[0];
    },
    set: (inventoryNumber) => {
        const { language } = window.location;
        window.location.hash = `#/${(language === null) ? '' : `${language}/`}${(!inventoryNumber) ? '' : `${inventoryNumber}/`}`;

        window.dispatchEvent(inventoryNumberEvent);
    },
});

const config = {
    baseURL: './',
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
        preview_size: 'settings__preview-size',
    },
    langChooser: {
        root: 'lang-chooser',
        bg: 'background',
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

    window.addEventListener('hashchange', () => {
        window.dispatchEvent(languageEvent);
        window.dispatchEvent(inventoryNumberEvent);
    });

    /**
     * Single-View
     */
    // eslint-disable-next-line no-undef
    const singleview = new SingleView(
        config.singleview,
        config.baseURL,
        data,
        template.singleview,
    );
    singleview?.open(window.location.inventoryNumber);
    window.addEventListener('artefactchange', () => {
        singleview?.open(window.location.inventoryNumber);
    });

    /**
     * Periods
     */
    const periods = document.querySelectorAll(`.${config.accordion.root}`);
    const accs = [];
    const collapseAll = {
        self: document.getElementById(config.accordion.collapse_all),
        label: document.querySelector(`label[for="${config.accordion.collapse_all}"]`),
    };

    periods.forEach((el) => {
        // eslint-disable-next-line no-undef
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

    collapseAll.self.addEventListener('change', (event) => {
        if (event.target.checked) {
            collapseAll.label.innerHTML = 'unfold_more';
        } else {
            collapseAll.label.innerHTML = 'unfold_less';
        }
    });

    /**
     * Language
     */
    const htmlElement = document.querySelector('html');
    const langSelect = document.getElementById('settings__language');
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-unused-vars
    const langChooser = new LangChooser(config.langChooser);

    langSelect.addEventListener('change', (event) => {
        const { value } = event.target.selectedOptions[0];
        window.location.language = value;
    });

    function onLangChange() {
        htmlElement.setAttribute('lang', window.location.language);
        langSelect.value = window.location.language;
    }

    window.addEventListener('langchange', () => {
        onLangChange();
    });
    onLangChange();

    /**
     * Menu
     */
    const menuSwitcher = document.querySelector('.page-header__settings');
    const header = document.querySelector('.page-header');

    menuSwitcher.addEventListener('click', () => {
        header.classList.toggle('page-header--open');

        if (header.classList.contains('page-header--open')) {
            menuSwitcher.innerHTML = 'close';
        } else {
            menuSwitcher.innerHTML = 'menu';
        }
    });
})();
