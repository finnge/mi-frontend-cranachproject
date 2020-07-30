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
const data = [];

origData.de.forEach((artefactDE, index) => {
    const artefactEN = origData.en.find((el) => el.objectId === artefactDE.objectId);
    const artefact = {};

    artefact.objectName = artefactDE.objectName;
    artefact.objectId = artefactDE.objectId;
    artefact.inventoryNumber = artefactDE.inventoryNumber;
    artefact.sortingNumber = artefactDE.sortingNumber;
    artefact.isBestOf = artefactDE.isBestOf;
    artefact.images = artefactDE.images;
    artefact.period = artefactDE.dating.begin;

    data.push(artefact);
});

console.log(data);