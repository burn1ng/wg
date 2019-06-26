import Model from '../../backbone-extensions/Model';
import {get_int_from_str} from '../../helpers/JsHelpers';

export default class SelectionModel extends Model {
    defaults() {
        return {
            active: true
        };
    }

    constructor(initial_model) {
        super(initial_model.attributes);

        this._initial_model = initial_model;
    }

    get title() {
        return this._initial_model.title;
    }

    get active() {
        return this.get('active');
    }

    set active(val) {
        this.set('active', !!val);
    }

    get selected() {
        return this.get('selected')
    }

    set selected(val) {
        this.set('selected', !!val);
    }

    get count() {
        return get_int_from_str(this.title);
    }
}
