import View from '../../backbone-extensions/View';

import template from './template.html';
import './styles.scss';

export default class SelectionStatus extends View {
    /**
     *
     * @param {ICollection} collection
     */
    constructor(collection) {
        super();

        this._initial_collection = collection;
        this._refresh_ui_debounce = this.debounced(this._refresh_ui);
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
        this.listenTo(this._initial_collection, 'change:selected', this._refresh_ui_debounce); /* avoids extra reflows */
        this.listenTo(this._initial_collection, 'reset', this._refresh_ui);
    }

    _refresh_ui() {
        this.ui.$count.html(this._count);
        this.ui.$entity_name.html(this._entities_name);
    }

    get _count() {
        return this._initial_collection.get_selected().length;
    }

    get _entities_name() {
        let entity_name = 'элeмент';

        switch (this._count) {
            case 0:
                return `${entity_name}ов`;
            case 1:
                return entity_name;
            case 2:
            case 3:
                return `${entity_name}a`;
            default:
                return '';

        }
    }
}