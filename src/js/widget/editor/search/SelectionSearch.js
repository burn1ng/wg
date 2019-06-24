import View from '../../../backbone-extensions/View';

import template from './template.html';
import './styles.scss';

const FILTER_OPTIONS = [
    {
        id: null,
        title: 'Без фильтра'
    },
    {
        id: 1,
        title: 'Номер > 10'
    },
    {
        id: 2,
        title: 'Номер > 100'
    },
    {
        id: 3,
        title: 'Номер > 200'
    }
];

export default class SelectionSearch extends View {
    constructor({initial_collection, matched_collection}) {
        super();

        this._initial_collection = initial_collection;
        this._matched_collection = matched_collection;
    }

    class_name() {
        return 'selection-search';
    }

    render() {
        this.$el.append(template({
            filter_options: FILTER_OPTIONS
        }));
    }
}