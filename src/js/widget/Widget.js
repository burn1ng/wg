import View from '../backbone-extensions/View';
import Selection from './selection/Selection';
import SelectionCollection from './selection/SelectionCollection';
import SelectionStatus from './status/SelectionStatus';
import SelectionEditor from './editor/SelectionEditor';

import template from './template.html';
import './styles.scss';


export default class Widget extends View {
    /**
     *
     * @param {ElementsCollection} collection
     */
    constructor(collection) {
        super();

        this._initial_collection = collection;
        this._selection_collection = SelectionCollection.create_by_elements_collection(this._initial_collection);

        // for QA
        window.initial = this._initial_collection;
        window.selection = this._selection_collection;
    }

    class_name() {
        return 'widget';
    }

    ui() {
        return {
            $change_btn: '[js-change]'
        };
    }

    events() {
        return {
            'click @ui.$change_btn': this._render_selection_edit
        }
    }

    render() {
        this.$el.html(template());
    }

    subviewCreators() {
        let collection = this._selection_collection;

        return {
            'selection-status'() {
                return new SelectionStatus(collection);
            },
            'selection'() {
                return new Selection(collection);
            }
        };
    }

    _render_selection_edit() {
        this.append(
            new SelectionEditor(this._initial_collection)
        );
    }
}