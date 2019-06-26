import Collection from '../../backbone-extensions/Collection';
import FILTER_OPTIONS from './const/FILTER_OPTIONS';
import {get_int_from_str} from '../../helpers/JsHelpers';

export default class MatchedCollection extends Collection {
    /**
     * @param{String?} option_id
     * @return {SelectionModel[]}
     */
    filter_models(option_id) {
        let filter_id = parseInt(option_id);
        let filter_count = this._get_filter_count(filter_id);

        return this.filter(
            model => !filter_id || model.count > filter_count
        );
    }

    /**
     *
     * @param {Number} filter_id
     * @return {Number}
     */
    _get_filter_count(filter_id) {
        let option = FILTER_OPTIONS.find(item => item.id === filter_id);

        return get_int_from_str(option.title);
    }
}