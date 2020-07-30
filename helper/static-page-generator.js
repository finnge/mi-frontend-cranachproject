/* eslint-disable no-param-reassign */
const mustache = require('mustache');
const fs = require('fs');

const config = {
    path: {
        templates: (file) => `src/assets/templates/${file}.mustache.html`,
        data: (file) => `src/data/${file}.json`,
    },
};

const origData = {
    de: JSON.parse(fs.readFileSync(config.path.data('cda-paintings-v2.de'))).items,
    en: JSON.parse(fs.readFileSync(config.path.data('cda-paintings-v2.en'))).items,
};

// merging the languages
const periods = [];

origData.de.forEach((artefactDE) => {
    const artefactEN = origData.en.find((el) => el.objectId === artefactDE.objectId);

    // Create single artefact
    const artefact = {};

    const singleKeys = [
        'objectName',
        'objectId',
        'inventoryNumber',
        'sortingNumber',
        'isBestOf',
        'images',
    ];

    singleKeys.forEach((key) => {
        artefact[key] = artefactDE[key];

        delete artefactDE[key];
        delete artefactEN[key];
    });

    artefact.sortingNumber = artefact.sortingNumber.split('-');

    artefact.de = artefactDE;
    artefact.en = artefactEN;

    // add to period
    const periodIndex = periods.findIndex((el) => el.period === artefact.sortingNumber[0]);

    if (periodIndex < 0) {
        periods.push({
            period: artefact.sortingNumber[0],
            artefacts: [artefact],
        });
    } else {
        periods[periodIndex].artefacts.push(artefact);
    }
});

console.log(periods);
