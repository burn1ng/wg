import View from '../../../backbone-extensions/View';

import './styles.scss';
import SwitchableCheckbox from '../../../components/SwitchableCheckbox';

const COMPONENT_CSS = 'selection-list';

export default class SelectionList extends View {
    constructor({matched_collection}) {
        super();

        this._matched_collection = matched_collection;
        this.listenTo(this._matched_collection, 'reset', this._recreate_list)
    }

    class_name() {
        return COMPONENT_CSS;
    }

    on_rendered() {
        this._build_list();
    }

    _build_list() {
        let views = this._matched_collection.models.map(
            model => new SwitchableCheckbox({
                props: ['selected'],
                model,
                disabled_state_props: ['active'],
                label_css: `${COMPONENT_CSS}__item`,
                theme: SwitchableCheckbox.THEMES.BLOCK,
                title: model.title
            })
        );

        this.append_list(views);
    }

    _recreate_list() {
        this.empty();
        this._build_list();
    }
}