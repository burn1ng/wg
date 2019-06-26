import Model from './../backbone-extensions/Model';

/**
 * @interface
 */
export default class IModel extends Model {
    defaults() {
        throw new Error('Not implemented');
    }

    get title() {
        throw new Error('Not implemented');
    }

    get selected() {
        throw new Error('Not implemented');
    }

    set selected(val) {
        throw new Error('Not implemented');
    }
}