export default class ButtonJoin {
    constructor(selector) {
        this.button = document.querySelector(selector);
    }

    setLink(url) {
        if (this.button) {
            this.button.href = url;
            this.button.textContent = 'Приєднатися до каналу';
            this.show();
        }
    }

    show() {
        if (this.button) {
            this.button.style.display = 'inline-block';
        }
    }

    hide() {
        if (this.button) {
            this.button.style.display = 'none';
        }
    }
}
