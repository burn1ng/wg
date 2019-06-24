import View from '../../backbone-extensions/View';
import SelectionSearch from './search/SelectionSearch';
import SelectionList from './list/SelectionList';
import SelectionCollection from '../selection/SelectionCollection';
import SelectionButtons from '../selection/SelectionButtons';

import template from './template.html';
import './styles.scss';


export default class SelectionEditor extends View {
    constructor({initial_collection}) {
        super();

        this._initial_collection = initial_collection; //NOTE: dont' interact with initial collection;

        this._internal_collection = SelectionCollection.create_by_elements_collection(initial_collection);

        //TODO: build new collection with new models copies which will overwrite initial collection after APPLY button
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
        let matched_collection = {}; // TODO: build matched by initial
        //let selection_collection = SelectionCollection.create_by_elements_collection(this._initial_collection);

        return {
            'search'() {
                return new SelectionSearch({
                    initial_collection: this._initial_collection,
                    matched_collection
                });
            },
            'list'() {
                return new SelectionList({
                    matched_collection
                })
            },
            'buttons'() {
                return new SelectionButtons(this._internal_collection);
            }
        };
    }

    _handle_save_click() {
        //TODO: take initial_collection and reset its models by internal collection state
    }
}