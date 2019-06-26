import View from '../backbone-extensions/View';
import SelectionButtonsContainer from './selection/SelectionButtonsContainer';
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
        this._editor = null;
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

    subviewCreators() {
        return {
            'status'() {
                return new SelectionStatus(this._initial_collection);
            },
            'buttons'() {
                return new SelectionButtonsContainer(this._initial_collection);
            }
        };
    }

    _toggle_selection_editor() {
        if (this._editor && !this._editor.is_destroyed) {
            this._editor.destroy();
            this._editor = null;
        } else {
            this._editor = new SelectionEditor(this._initial_collection);
            this.append(this._editor);
        }
    }
}