import View from '../backbone-extensions/View';
import SelectionButtons from './selection/SelectionButtons';
import SelectionStatus from './status/SelectionStatus';
import SelectionEditor from './editor/SelectionEditor';

import template from './template.html';
import './styles.scss';


export default class Widget extends View {
    /**
     *
     * @param {ICollection} collection
     */
    constructor(collection) {
        super();

        this._initial_collection = collection;
        this._editor_window = null;

        this.listenTo(this._initial_collection, 'reset', this._toggle_selection_editor);

        // for QA
        window.initial = this._initial_collection;
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
            'mousedown @ui.$change_btn': this._toggle_selection_editor
        }
    }

    render() {
        this.$el.html(template());
    }

    on_rendered() {
        // temporary for development
        this._toggle_selection_editor();
    }

    subviewCreators() {
        return {
            'status'() {
                return new SelectionStatus(this._initial_collection);
            },
            'buttons'() {
                return new SelectionButtons(this._initial_collection);
            }
        };
    }

    _toggle_selection_editor() {
        if (this._editor_window) {
            this._editor_window.destroy();
            this._editor_window = null;
        } else {
            this._editor_window = new SelectionEditor(this._initial_collection);
            this.append(this._editor_window);
        }
    }
}