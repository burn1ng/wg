import Collection from '../../backbone-extensions/Collection';

const MAX_ACTIVE_MODELS = 3;

export default class MatchedCollection extends Collection {
    comparator() {
        return 'title'; //no dependency from data order
    }

    constructor(internal_collection) {
        super(internal_collection.models);

        this._internal_collection = internal_collection;
        this._toggle_active_state();

        this.listenTo(this._internal_collection, 'change:selected', this._toggle_active_state);
    }

    _toggle_active_state() {
        let selected_models = [];
        let not_selected_models = [];

        this._internal_collection.models.forEach(model => {
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