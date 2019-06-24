import CheckboxBase from './CheckboxBase';
import './switchable_checkbox_styles.scss';

export default class SwitchableCheckbox extends CheckboxBase {
    class_name() {
        return 'switchable-checkbox';
    }

    _toggle_properties() {
        let is_checked = this.checked;

        let properties_to_set = this._props.reduce((memo, prop) => {
            memo[prop] = is_checked;

            return memo;
        }, {});

        this._model.set(properties_to_set);
    }

    /**
     *
     * @param options
     * @param {String[]} options.props
     * @param {Model}    options.model
     */
    constructor(options) {
        super(options);

        this._props = options.props;
        this._model = options.model;

        this.listenTo(this._model, this._get_events(), this._toggle);
    }

    _get_events() {
        return this._props.reduce((memo, prop) => (memo + `change:${prop} `), '');
    }

    _toggle() {
        this.checked = this._is_enabled;
    }

    get _is_enabled() {
        return this._props.some(prop => !!this._model.get(prop));
    }

}