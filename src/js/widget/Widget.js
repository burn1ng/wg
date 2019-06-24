import View from '../backbone-extensions/View';
import SelectionButtons from './selection/SelectionButtons';

import template from './template.html';
import './styles.scss';

export default class Widget extends View {
    constructor({data}) {
        super();

        this._data = data;
        console.log(this._data);
    }

    ui() {
        return {
            $test: '[js-test]'
        };
    }

    render() {
        this.$el.html(
            template(
                {
                    test_var: 'Hello!!!'
                }
            )
        )
    }

    onRendered() {
        this.append(
            new SelectionButtons(),
            this.ui.$test
        )
    }
}