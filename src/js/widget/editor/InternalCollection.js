import ICollection from '../ICollection';
import InternalModel from './InternalModel';

export default class InternalCollection extends ICollection {
    /**
     *
     * @param {ICollection} collection
     *
     * @return {InternalCollection}
     */
    static create_by_initial_collection(collection) {
        return new this(
            collection.models.map(model => new InternalModel(model)),
            collection
        );
    }

    get model() {
        return InternalModel;
    }

    /**
     *
     * @param {InternalModel[]}     internal_models
     * @param {ICollection}         initial_collection
     */
    constructor(internal_models, initial_collection) {
        super(internal_models);

        this._initial_collection = initial_collection;
    }

    apply_changes() {
        this._initial_collection.reset(
            this.models.map(model => {
                let attrs = Object.assign({}, model.attributes);
                delete attrs.active;

                return attrs;
            })
        );
    }
}