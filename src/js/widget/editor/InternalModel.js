import {get_int_from_str} from '../../helpers/JsHelpers';
import IModel from '../IModel';

export default class InternalModel extends IModel {
    /**
     *
     * @param {IModel} initial_model
     */
    constructor(initial_model) {
        super(initial_model.attributes);

        this._initial_model = initial_model;
    }

    defaults() {
        return {
            selected: false,
            active: true
        };
    }

    get title() {
        return this._initial_model.title;
    }

    get selected() {
        return this.get('selected')
    }

    set selected(val) {
        this.set('selected', !!val);
    }

    get active() {
        return this.get('active');
    }

    set active(val) {
        this.set('active', !!val);
    }

    get count() {
        return get_int_from_str(this.title);
    }
}
