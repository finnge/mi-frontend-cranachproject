// eslint-disable-next-line no-unused-vars
class LangChooser {
    constructor(selector) {
        this.selector = selector;
        this.root = document.querySelector(`.${selector.root}`);

        this.init();
    }

    init() {
        window.addEventListener('langchange', () => {
            this.onLangChange();
        });
        this.onLangChange();
    }

    onLangChange() {
        if (!window.location.language) {
            this.open();
        }
        else {
            this.close();
        }
    }

    open() {
        this.root.classList.add(`${this.selector.root}--visible`);
        console.log(this.root.classList);
    }

    close() {
        this.root.classList.remove(`${this.selector.root}--visible`);
        console.log(this.root.classList);
    }
}
