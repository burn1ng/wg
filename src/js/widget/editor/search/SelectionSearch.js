import View from '../../../backbone-extensions/View';
import FILTER_OPTIONS from './../const/FILTER_OPTIONS';

import template from './template.html';
import './styles.scss';

export default class SelectionSearch extends View {
    constructor({selection_collection, matched_collection}) {
        super();

        this._selection_collection = selection_collection;
        this._matched_collection = matched_collection;
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
            'change @ui.$select_filter': this._rebuild_by_filter
        }
    }

    render() {
        this.$el.append(template({
            filter_options: FILTER_OPTIONS
        }));
    }

    _rebuild_matched() {
        let filter_text = this.ui.$search_input.val().toLowerCase();

        this._matched_collection.reset(
            this._selection_collection.search(filter_text)
        );
    }

    _rebuild_by_filter() {
        let option_id = this.ui.$select_filter.val();

        this._matched_collection.reset(
            this._matched_collection.filter_models(option_id) // matched collection
        );
    }
}