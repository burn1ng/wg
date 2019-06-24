import Collection from '../../backbone-extensions/Collection';

export default class SelectionCollection extends Collection {
    /**
     *
     * @param {ElementsCollection} collection
     * @return {SelectionCollection}
     */
    static create_by_elements_collection(collection) {
        return new this(
            collection.models.filter(model => !!model.selected),
            collection
        );
    }

    constructor(element_models, initial_collection) {
        super(element_models);

        this._initial_collection = initial_collection;
    }
}