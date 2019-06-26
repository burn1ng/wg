import View from '../../../backbone-extensions/View';
import FILTER_OPTIONS from './../const/FILTER_OPTIONS';
import UIComponentState from './UIComponentState';
import SearchState from './SearchState';

import template from './template.html';
import './styles.scss';

export default class SelectionSearch extends View {
    /**
     *
     * @param {SelectionCollection} selection_collection
     * @param {MatchedCollection} matched_collection
     */
    constructor({selection_collection, matched_collection}) {
        super();

        this._selection_collection = selection_collection;
        this._matched_collection = matched_collection;

        this._input_state = new UIComponentState();
        this._select_state = new UIComponentState();
        this._search_state = new SearchState(selection_collection);
    }

    class_name() {
        return 'selection-search';
    }

    ui() {
        return {
            $search_input: '[js-search-input]',
            $select_filter: '[js-select-filter]'
        };
    }

    events() {
        return {
            'input @ui.$search_input': this._rebuild_matched,
            'change @ui.$select_filter': this._rebuild_matched
        }
    }

    render() {
        this.$el.append(template({
            filter_options: FILTER_OPTIONS
        }));
    }

    _rebuild_matched() {
        let filter_text = this.ui.$search_input.val().toLowerCase();
        let option_id = parseInt(this.ui.$select_filter.val());

        this._set_input_state(filter_text);
        this._set_select_state(option_id);

        this._matched_collection.reset(
            this._search_state.get_matched_models({
                filter_text,
                option_id,
                input_state: this._input_state.active,
                select_state: this._select_state.active
            })
        );
    }

    _set_input_state(filter_text) {
        this._input_state.active = !!filter_text;
    }

    _set_select_state(option_id) {
        this._select_state.active = (FILTER_OPTIONS.find(option => option.id === option_id).id !== 0);
    }
}