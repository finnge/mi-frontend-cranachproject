/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const Mustache = require('mustache');
const fs = require('fs');

const config = {
    path: {
        templates: (file) => `src/templates/${file}.mustache.html`,
        data: (file) => `src/data/${file}.json`,
    },
};

(async () => {
    const origData = {
        de: JSON.parse(fs.readFileSync(config.path.data('cda-paintings-v2.de'))).items,
        en: JSON.parse(fs.readFileSync(config.path.data('cda-paintings-v2.en'))).items,
    };

    console.log('✔︎ [1/7] retrieved data');

    // merging the languages
    const mergedData = [];

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

        artefact.period = artefactDE.dating.begin;

        artefact.de = artefactDE;
        artefact.en = artefactEN;

        mergedData.push(artefact);
    });

    console.log('✔︎ [2/7] merge languages');

    const filterdData = mergedData.filter(
        (artefact) => artefact.images !== null && artefact.images.infos.maxDimensions.width !== 0
    );

    console.log('✔︎ [3/7] tested artefacts');

    // sort
    filterdData.sort((a, b) => {
        let i = 0;

        while (a.sortingNumber[i] !== undefined || b.sortingNumber[i] !== undefined) {
            if (a.sortingNumber[i] > b.sortingNumber[i]) {
                return 1;
            }
            if (a.sortingNumber[i] < b.sortingNumber[i]) {
                return -1;
            }

            i += 1;
        }

        if (a.sortingNumber[i] === undefined && b.sortingNumber[i] !== undefined) {
            return 1;
        }
        if (a.sortingNumber[i] !== undefined && b.sortingNumber[i] === undefined) {
            return -1;
        }
        return 0;
    });

    console.log('✔︎ [4/7] sort artefacts');

    // prev, next
    filterdData.forEach((artefact, index) => {
        try {
            filterdData[index].prev = (index === 0)
                ? filterdData[filterdData.length - 1].inventoryNumber
                : filterdData[index - 1].inventoryNumber;
            filterdData[index].next = (index === (filterdData.length - 1))
                ? filterdData[0].inventoryNumber
                : filterdData[index + 1].inventoryNumber;
        } catch (e) {
            console.log(`Fehler bei prev, next: ${index}`);
        }
    });

    console.log('✔︎ [5/7] group');

    // group in periods
    const periods = [];
    filterdData.forEach((artefact) => {
        const periodIndex = periods.findIndex((el) => el.period === artefact.period);

        if (periodIndex < 0) {
            periods.push({
                period: artefact.period,
                artefacts: [artefact],
            });
        } else {
            periods[periodIndex].artefacts.push(artefact);
        }
    });

    console.log('✔︎ [6/7] create periods');

    // templating
    const template = {
        index: fs.readFileSync(config.path.templates('index')).toString(),
    };

    const output = Mustache.render(template.index, { periods });

    // printing
    fs.writeFileSync('index.html', output);

    console.log('✔︎ [7/7] create file');
})();
