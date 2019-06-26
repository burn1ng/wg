import IModel from './widget/IModel';

export default class ElementModel extends IModel {
    defaults() {
        return {
            selected: false
        };
    }

    get title() {
        return this.get('title');
    }

    get selected() {
        return this.get('selected');
    }

    set selected(val) {
        this.set('selected', !!val);
    }
}