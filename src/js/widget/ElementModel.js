import Model from '../backbone-extensions/Model';

export default class ElementModel extends Model {
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