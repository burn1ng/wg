import View from '../../backbone-extensions/View';

import template from './template.html';
import './styles.scss';

export default class SelectionStatus extends View {
    constructor(collection) {
        super();

        this._selection_collection = collection;
    }

    class_name() {
        return 'selection-status';
    }

    ui() {
        return {
            $count: '[js-count]',
            $entity_name: '[js-entity-name]'
        };
    }

    render() {
        this.$el.append(template({
            count: this._count,
            entities_name: this._entities_name
        }))
    }

    on_rendered() {
        this.listenTo(this._selection_collection, 'change:selected', this._refresh_ui);
    }

    _refresh_ui() {
        this.ui.$count.html(this._count);
        this.ui.$entity_name.html(this._entities_name);
    }

    get _count() {
        return this._selection_collection.get_selected().length;
    }

    get _entities_name() {
        let count = this._selection_collection.length;
        let entity_name = 'элeмент';
        let string = '';

        switch (count) {
            case 0:
                string = `${entity_name}ов`;
                break;
            case 1:
                string = entity_name;
                break;
            case 2:
                string = `${entity_name}a`;
                break;

        }

        return `${string}`;
    }
}