function getTemplate(select, data = [], placeholder = 'Placeholder по умолчанию', selectedId) {

    let items = data.map(function (item) {
        let cls = '';
        if (item.id == selectedId) {
            cls = 'selected';
        }
        return `<li class="smv-select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>`;
    });

    return `<div class="smv-select">   
                ${select.outerHTML}
                <div class="smv-select__backdrop" data-type="backdrop"></div>
                <div class="smv-select__input" data-type="input">
                    <span class="smv-select__placeholder">${placeholder}</span>
                    <svg class="smv-select__arrow" xmlns="http://www.w3.org/2000/svg" width="284.929px" height="284.929px" viewBox="0 0 284.929 284.929">
                        <path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441
    \t\t            L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082
                        c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
    \t\t            c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
                    </svg>
                </div>
                <div class="smv-select__dropdown">
                    <ul class="smv-select__list">
                        ${items.join('')}
                    </ul>
                </div>
            </div>`
}

class Select {

    constructor(selector, options) {
        this.$select = document.querySelector(selector);
        this.options = options;
        this.selectedId = options.selectedId;
        this.selectedValue = options.selectedValue;
        this.#parse();
        this.#render(selector);
        this.#setup();
    }

    #parse() {
        if (!this.options.data) {

            this.options.data = Array.apply(null, this.$select.options).map((el) => {
                return {id: el.index, value: el.value}
            });
        }
    }

    #render(selector) {
        const {placeholder, data, selectedId} = this.options
        let parent = this.$select.parentNode;
        parent.innerHTML = getTemplate(this.$select, data, placeholder, selectedId);
        this.$main = parent.querySelector('.smv-select');
        this.$select = this.$main.querySelector(selector);
        this.$placeholder = this.$main.querySelector('.smv-select__placeholder');
        if (selectedId){
            this.select(selectedId);
        }
    }

    #setup() {
        this.clickHandler = this.clickHandler.bind(this);
        this.$main.addEventListener('click', this.clickHandler);

        this.focusHandler = this.focusHandler.bind(this);
        this.$main.addEventListener('focusin', this.focusHandler);
        this.$main.addEventListener('focusout', this.focusHandler);

        this.changeHandler = this.changeHandler.bind(this);
        this.$main.addEventListener('change', this.changeHandler);
    }

    clickHandler(e) {

        let {type, id} = e.target.dataset;

        switch (type) {
            case 'input':
                this.toggle();
                break;
            case 'item':
                this.select(id);
            case 'backdrop':
                this.close();
                break;
        }
    }

    focusHandler(e){
        this[e.type]();
    }

    changeHandler(e){
        this.selectedValue = e.target.value;
        this.select(this.getByValue.id);
    }

    get isOpen() {
        return this.$main.classList.contains('open');
    }

    get current() {
        return this.options.data.find(item=>item.id == this.selectedId);
    }

    get getByValue(){
        return this.options.data.find(item=>item.value == this.selectedValue);
    }

    toggle() {
        if(this.isOpen){
            this.close();
        } else{
            this.open();
        }
    }

    open() {
        this.$main.classList.add('open');
        this.focusin();
    }

    close() {
        this.$main.classList.remove('open');
        this.focusout();
    }

    select(id) {
        this.selectedId = id;
        let {value} = this.current;
        this.$placeholder.textContent = value;
        this.$select.value = value;
        this.$main.querySelector('.selected').classList.remove('selected');
        this.$main.querySelector(`[data-id="${id}"]`).classList.add('selected');
        this.close();

        this.options.onSelect = this.options.onSelect.bind(this);
        this.options.onSelect ? this.options.onSelect() : null
    }

    focusin(){
        this.$main.classList.add('focus');
    }

    focusout(){
        this.$main.classList.remove('focus');
    }

}