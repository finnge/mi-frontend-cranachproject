// eslint-disable-next-line no-unused-vars
class SingleView {
    constructor(selector, baseURL, data, template) {
        this.selector = selector;
        this.root = document.querySelector(`.${selector.root}`);
        this.bg = document.querySelector(`.${selector.bg}`);
        this.data = data;
        this.template = template;
        this.baseURL = baseURL;
        this.current = undefined;
        this.prev = undefined;
        this.next = undefined;
        this.currentElement = undefined;

        this.init();
    }

    init() {
        this.bg.addEventListener('click', () => {
            if (window.location.language) {
                window.location.inventoryNumber = null;
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowLeft') {
                if (this.prev !== undefined) {
                    window.location.inventoryNumber = this.prev.inventoryNumber;
                }
            } else if (event.code === 'ArrowRight') {
                if (this.next !== undefined) {
                    window.location.inventoryNumber = this.next.inventoryNumber;
                }
            } else if (event.code === 'Escape') {
                window.location.inventoryNumber = null;
            }
        });
    }

    open(inventoryNumber) {
        this.current = this.getData(inventoryNumber);

        if (!this.current) {
            this.currentElement = undefined;
            this.next = undefined;
            this.prev = undefined;
            this.root.classList.remove(`${this.selector.root}--visible`);
            this.bg.classList.remove(`${this.selector.bg}--visible`);
            return;
        }

        this.currentElement = document.querySelector(`.period-list__item[data-inventoryNumber="${inventoryNumber}"]`);
        this.prev = this.getData(this.currentElement.dataset.prev);
        this.next = this.getData(this.currentElement.dataset.next);

        this.root.classList.add(`${this.selector.root}--visible`);
        this.bg.classList.add(`${this.selector.bg}--visible`);

        this.fillWithData(this.current);
    }

    fillWithData(data) {
        const { language } = window.location;

        function replaceReferences(string) {
            return string.replace(/\[(.)+\]/, '<span class="singleview__text--cite">$&</span>');
        }

        function getTranslation(key, lang) {
            if (lang === 'de') {
                switch (key) {
                case 'title':
                    return 'Alternative Titel';
                case 'inventoryNumber':
                    return 'ID';
                case 'dimensions':
                    return 'Maße';
                case 'repository':
                    return 'Eigentümer';
                case 'owner':
                    return 'Besitzer';
                case 'location':
                    return 'Ort';
                case 'involvedPersons':
                    return 'Zuschreibungen';
                default:
                    return '';
                }
            } else if (lang === 'en') {
                switch (key) {
                case 'title':
                    return 'Alternative Titles';
                case 'inventoryNumber':
                    return 'ID';
                case 'dimensions':
                    return 'Dimensions';
                case 'repository':
                    return 'Repository';
                case 'owner':
                    return 'Owner';
                case 'location':
                    return 'Locations';
                case 'involvedPersons':
                    return 'Involved Persons';
                default:
                    return '';
                }
            }
            return '';
        }

        const metaTable = [
            {
                key: getTranslation('title', language),
                value: () => {
                    let tmp = '';

                    data.titles.forEach((e, i) => {
                        if (i === 0) return;

                        tmp += (i === 1) ? '' : ', ';
                        tmp += e.title;
                        tmp += (!e.remarks) ? '' : ` ${e.remarks}`;
                    });

                    return tmp;
                },
            },
            {
                key: getTranslation('involvedPersons', language),
                value: () => {
                    let tmp = '';

                    data.involvedPersons.forEach((e, i) => {
                        if (i === 0) return;

                        tmp += (i === 1) ? '' : ', ';
                        tmp += e.name;
                        tmp += (!e.remarks) ? '' : ` ${e.remarks}`;
                    });

                    return tmp;
                },
            },
            {
                key: getTranslation('dimensions', language),
                value: replaceReferences(data.dimensions),
            }, {
                key: getTranslation('inventoryNumber', language),
                value: replaceReferences(data.inventoryNumber),
            }, {
                key: getTranslation('repository', language),
                value: replaceReferences(data.repository),
            }, {
                key: getTranslation('owner', language),
                value: replaceReferences(data.owner),
            }, {
                key: getTranslation('location', language),
                value: replaceReferences(data.owner),
            },
        ];

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
            language,
            metaTable,
        });

        this.root.innerHTML = replaceReferences(rendered);
    }

    getData(inventoryNumber) {
        return this.data[window.location.language]?.find(
            (el) => el.inventoryNumber === inventoryNumber,
        );
    }
}
