import View from '../../../backbone-extensions/View';

import './styles.scss';
import SwitchableCheckbox from '../../../components/SwitchableCheckbox';

export default class SelectionList extends View {
    constructor({matched_collection}) {
        super();

        this._matched_collection = matched_collection;
    }

    class_name() {
        return 'selection-list';
    }

    on_rendered() {
        let views = this._matched_collection.models.map(
            model => new SwitchableCheckbox({
                props: ['selected'],
                model,
                title: model.title,
                checked: !!model.selected
            })
        );

        this.append_list(views);
    }
}