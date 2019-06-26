import Collection from '../../backbone-extensions/Collection';
import FILTER_OPTIONS from './const/FILTER_OPTIONS';
import {get_int_from_str} from '../../helpers/JsHelpers';

const MAX_ACTIVE_MODELS = 3;

export default class MatchedCollection extends Collection {
    comparator() {
        return 'title'; //no dependency from data order, collection always sorted
    }

    constructor(selection_collection) {
        super(
            (selection_collection && selection_collection.models) || null
        );

        this._selection_collection = selection_collection;

        if (this._selection_collection) {
            this.listenTo(this._selection_collection, 'change:selected', this._toggle_active_state);
            this._toggle_active_state();
        }
    }

    _toggle_active_state() {
        let selected_models = [];
        let not_selected_models = [];

        this._selection_collection.models.forEach(model => {
            if (model.selected) {
                selected_models.push(model);
            } else {
                not_selected_models.push(model)
            }
        });

        let condition = selected_models.length >= MAX_ACTIVE_MODELS;
        not_selected_models.forEach(model => model.active = !condition);
    }
}