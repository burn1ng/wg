import Model from '../../../backbone-extensions/Model';
import MatchedCollection from '../MatchedCollection';

export default class FiltersStateModel extends Model {
    /**
     *
     * @param {SelectionCollection} selection_collection
     */
    constructor(selection_collection) {
        super();

        this._selection_collection = selection_collection;
    }

    /**
     *
     * @param {String} filter_text
     * @param {Number} option_id
     * @param {Boolean} input_state
     * @param {Boolean} select_state
     *
     * @return {SelectionModel[]}
     */
    get_matched_models({
        filter_text,
        option_id,
        input_state,
        select_state
    }) {
        let matched_collection = new MatchedCollection(this._selection_collection);
        let searched_models = matched_collection.search(filter_text);

        if (input_state) {
            matched_collection.reset(searched_models);
        } else {
            matched_collection.reset(this._selection_collection.models);
        }

        if (select_state) {
            matched_collection.reset(
                matched_collection.filter_models(option_id)
            )
        } else {
            matched_collection.reset(
                searched_models
            );
        }

        return matched_collection.models;
    }
}