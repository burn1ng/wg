import Collection from '../../backbone-extensions/Collection';
import ElementModel from '../ElementModel';

export default class SelectionCollection extends Collection {
    /**
     *
     * @param {ElementsCollection} collection
     * @return {SelectionCollection}
     */
    static create_by_elements_collection(collection) {
        return new this(
            collection.get_selected().map(model => new ElementModel(model.attributes)),
            collection
        );
    }

    constructor(element_models, initial_collection) {
        super(element_models);

        this._initial_collection = initial_collection;
    }

    get_selected() {
        return this.models.filter(model => !!model.selected);
    }
}