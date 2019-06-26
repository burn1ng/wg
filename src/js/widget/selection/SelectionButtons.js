import View from '../../backbone-extensions/View';
import SelectionButton from './button/SelectionButton';

import './styles.scss';

export default class SelectionButtons extends View {
    /**
     *
     * @param {Collection} collection
     */
    constructor(collection) {
        super();

        this._collection = collection;
        this.listenTo(this._collection, 'change:selected reset', this._recreate);
    }

    class_name() {
        return 'selection-buttons';
    }

    on_rendered() {
        this._recreate();
    }

    _recreate() {
        this.empty();

        let selected_models = this._collection.get_selected();

        if (selected_models.length) {
            let views = selected_models.map(
                (model) => new SelectionButton({model})
            );

            this.append_list(views);
        } else {
            this.$el.append('N/A');
        }
    }
}