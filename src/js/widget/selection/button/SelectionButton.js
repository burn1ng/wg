import View from '../../../backbone-extensions/View';

import template from './template.html';
import './styles.scss';

export default class SelectionButton extends View {
    /**
     *
     * @param {IModel}   model
     */
    constructor(model) {
        super();

        this._model = model;
    }

    ui() {
        return {
            $remove: '[js-remove]'
        };
    }

    events() {
        return {
            'click @ui.$remove': this._handle_selection_remove
        };
    }

    class_name() {
        return 'selection-button';
    }

    tag_name() {
        return 'button';
    }

    render() {
        this.$el.append(template({
            title: this._model.title
        }))
    }

    _handle_selection_remove() {
        this._model.selected = false;
    }
}