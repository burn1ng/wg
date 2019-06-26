import Collection from './../backbone-extensions/Collection';

/**
 * @interface
 */
export default class ICollection extends Collection {
    get model() {
        throw new Error('Not implemented');
    }

    get_selected() {
        return this.models.filter(model => !!model.selected);
    }
}