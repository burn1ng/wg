import ICollection from '../ICollection';
import SelectionModel from './SelectionModel';

export default class SelectionCollection extends ICollection {
    /**
     *
     * @param {ICollection} collection
     * @return {SelectionCollection}
     */
    static create_by_initial_collection(collection) {
        return new this(
            collection.models.map(model => new SelectionModel(model)),
            collection
        );
    }

    get model() {
        return SelectionModel;
    }

    constructor(selection_models, initial_collection) {
        super(selection_models);

        this._initial_collection = initial_collection;
    }

    /**
     *
     * @param {String?} filter_text
     * @returns {SelectionModel[]}
     */
    search(filter_text) {
        return this.filter(
            model => !filter_text || model.title.toLowerCase().includes(filter_text)
        );
    }
}