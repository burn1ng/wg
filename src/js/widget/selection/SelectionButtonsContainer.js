import View from '../../backbone-extensions/View';
import SelectionButton from './button/SelectionButton';

import './styles.scss';

export default class SelectionButtonsContainer extends View {
    /**
     *
     * @param {ICollection} collection
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
            this.append_list(
                selected_models.map(
                    model => new SelectionButton(model)
                )
            );
        } else {
            this.$el.append('N/A');
        }
    }
}