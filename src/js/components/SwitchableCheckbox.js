import CheckboxBase from './CheckboxBase';

import './switchable_checkbox_styles.scss';

const COMPONENT_CSS = 'switchable-checkbox';
const THEMES = {
    BLOCK: `${COMPONENT_CSS}--block`
};

export default class SwitchableCheckbox extends CheckboxBase {
    static get THEMES() {
        return THEMES;
    }

    class_name() {
        let css = [COMPONENT_CSS];

        if (this._theme) {
            css.push(this._theme);
        }

        return css.join(' ');
    }

    _toggle_properties() {
        let is_checked = this.checked;

        let properties_to_set = this._props.reduce((memo, prop) => {
            memo[prop] = is_checked;

            return memo;
        }, {});

        this._model.set(properties_to_set);
    }

    static _get_events(props) {
        return props.reduce((memo, prop) => (memo + `change:${prop} `), '');
    }

    /**
     *
     * @param options
     * @param {String[]}    options.props
     * @param {Model}       options.model
     * @param {String[]}    [options.disabled_state_props]
     * @param {String}      [options.theme]
     */
    constructor(options) {
        super(options);

        this._props = options.props;
        this._model = options.model;

        this._theme = options.theme || '';
        this._disabled_state_props = options.disabled_state_props || [];

        this.listenTo(this._model, this.constructor._get_events(this._props), this._toggle_checked_state);

        if (this._disabled_state_props.length) {
            this.listenTo(
                this._model,
                this.constructor._get_events(this._disabled_state_props),
                this._toggle_disable_state
            );
        }

    }

    on_rendered() {
        this._toggle_checked_state();
        this._toggle_disable_state();
    }

    _toggle_checked_state() {
        this.checked = this._is_checked;
    }

    _toggle_disable_state() {
        this.disabled = this._is_disabled_state;
    }

    get _is_checked() {
        return this._props.some(prop => !!this._model.get(prop));
    }

    get _is_disabled_state() {
        return this._disabled_state_props.some(prop => !this._model.get(prop));
    }
}