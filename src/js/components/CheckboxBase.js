import View from '../backbone-extensions/View';
import {HTMLHelpers} from '../helpers/html/HTMLHelpers';

export default class CheckboxBase extends View {
    class_name() {
        throw new Error('Not implemented');
    }

    _toggle_properties() {
        throw new Error('Not implemented');
    }

    constructor(options) {
        super(options);

        this._options = Object.assign({
            title: '',
            label_css: '',
            tooltip: '',
            name: '',
            value: '',
            attrs: '',
            checked: false,
            disabled: false
        }, options);
    }

    ui() {
        return {
            $input: '[js-input]'
        };
    }

    events() {
        return {
            'click @ui.$input': '_toggle_properties'
        };
    }

    render() {
        this.$el.append(
            HTMLHelpers.checkbox(this._options)
        );
    }

    get checked() {
        return this.ui.$input[0].checked;
    }

    set checked(value) {
        let input = this.ui.$input;

        if (this.checked !== value) {
            input.prop('checked', value);
            input.change();
        }
    }

    get disabled() {
        return this.ui.$input[0].disabled;
    }

    set disabled(value) {
        let input = this.ui.$input;

        if (this.disabled !== value) {
            input.prop('disabled', value);
        }
    }
}