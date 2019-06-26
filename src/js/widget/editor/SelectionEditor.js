import View from '../../backbone-extensions/View';
import SelectionSearch from './search/SelectionSearch';
import SelectionList from './list/SelectionList';
import InternalCollection from './InternalCollection';
import SelectionButtonsContainer from '../selection/SelectionButtonsContainer';
import MatchedCollection from './MatchedCollection';

import template from './template.html';
import './styles.scss';

export default class SelectionEditor extends View {
    /**
     *
     * @param {ICollection} initial_collection
     */
    constructor(initial_collection) {
        super();

        this._initial_collection = initial_collection;

        this._internal_collection = InternalCollection.create_by_initial_collection(initial_collection);
        this._matched_collection = new MatchedCollection(this._internal_collection);
    }

    class_name() {
        return 'selection-editor';
    }

    ui() {
        return {
            $close: '[js-close]',
            $save: '[js-save]',
            $cancel: '[js-cancel]'
        };
    }

    events() {
        return {
            'click @ui.$close': this.destroy,
            'click @ui.$save': this._handle_save_click,
            'click @ui.$cancel': this.destroy
        };
    }

    render() {
        this.$el.append(template());
    }

    subviewCreators() {
        let internal_collection = this._internal_collection;
        let matched_collection = this._matched_collection;

        return {
            'search'() {
                return new SelectionSearch({
                    internal_collection,
                    matched_collection
                });
            },
            'list'() {
                return new SelectionList(matched_collection)
            },
            'buttons'() {
                return new SelectionButtonsContainer(internal_collection);
            }
        };
    }

    _handle_save_click() {
        this.destroy();
        this._internal_collection.apply_changes();
    }
}