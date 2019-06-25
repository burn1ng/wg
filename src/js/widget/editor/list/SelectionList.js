import View from '../../../backbone-extensions/View';

import './styles.scss';
import SwitchableCheckbox from '../../../components/SwitchableCheckbox';

const COMPONENT_CSS = 'selection-list';

export default class SelectionList extends View {
    constructor({matched_collection}) {
        super();

        this._matched_collection = matched_collection;
    }

    class_name() {
        return COMPONENT_CSS;
    }

    on_rendered() {
        let views = this._matched_collection.models.map(
            model => new SwitchableCheckbox({
                props: ['selected'],
                model,
                label_css: `${COMPONENT_CSS}__item`,
                theme: SwitchableCheckbox.THEMES.BLOCK,
                title: model.title
            })
        );

        this.append_list(views);
    }
}