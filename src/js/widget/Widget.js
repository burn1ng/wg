import View from '../backbone-extensions/View';
import SelectionButtons from './selection/SelectionButtons';

import template from './template.html';
import './styles.scss';
import ElementsCollection from './ElementsCollection';

export default class Widget extends View {
    constructor({data}) {
        super();

        this._elements = new ElementsCollection(data);
    }

    class_name() {
        return 'widget';
    }

    ui() {
        return {
            $test: '[js-test]'
        };
    }

    events() {
        return {
            'click': '_test_click'
        };
    }

    render() {
        this.$el.html(
            template({test_var: 'Hello!!!'})
        )
    }

    on_rendered() {
        this.append(
            new SelectionButtons(),
            this.ui.$test
        )
    }

    _test_click(e) {
        console.log(e.target);
        console.log(e.currentTarget);
    }
}