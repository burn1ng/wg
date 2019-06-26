import Model from '../../../backbone-extensions/Model';
import SearchCollection from './SearchCollection.js';

export default class SearchState extends Model {
    /**
     *
     * @param {InternalCollection} internal_collection
     */
    constructor(internal_collection) {
        super();

        this._internal_collection = internal_collection;
    }

    /**
     *
     * @param {String} filter_text
     * @param {Number} option_id
     * @param {Boolean} input_state
     * @param {Boolean} select_state
     *
     * @return {InternalModel[]}
     */
    get_matched_models({
        filter_text,
        option_id,
        input_state,
        select_state
    }) {
        let search_collection = new SearchCollection(this._internal_collection);
        let searched_models = search_collection.search_models(filter_text);

        if (input_state) {
            search_collection.reset(searched_models);
        } else {
            search_collection.reset(this._internal_collection.models);
        }

        if (select_state) {
            search_collection.reset(
                search_collection.filter_models(option_id)
            )
        } else {
            search_collection.reset(
                searched_models
            );
        }

        return search_collection.models;
    }
}