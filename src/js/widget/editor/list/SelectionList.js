import View from '../../../backbone-extensions/View';

import './styles.scss';

export default class SelectionList extends View {
    constructor({matched_collection}) {
        super();

        this._matched_collection = matched_collection;
    }

    class_name() {
        return 'selection-list';
    }
}