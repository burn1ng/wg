import View from '../../backbone-extensions/View';
import SelectionButton from './button/SelectionButton';

import './styles.scss';

export default class Selection extends View {
    /**
     *
     * @param {SelectionCollection} collection
     */
    constructor(collection) {
        super();

        this._collection = collection;
        this.listenTo(this._collection, 'update', this._recreate);
    }

    class_name() {
        return 'selection';
    }

    on_rendered() {
        this._recreate();
    }

    _recreate() {
        this.empty();

        let views = this._collection.map(
            (model) => new SelectionButton({model, collection: this._collection})
        );

        this.append_list(views);
    }
}