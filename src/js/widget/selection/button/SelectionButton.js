import View from '../../../backbone-extensions/View';

import template from './template.html';
import './styles.scss';

export default class SelectionButton extends View {
    constructor({model, collection}) {
        super();

        this._model = model;
        this._collection = collection;
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
        this._collection.remove(this._model);
    }
}