import View from '../../backbone-extensions/View';

import template from './template.html';
import './styles.scss';

export default class SelectionButtons extends View {
    class_name() {
        return 'selection-buttons';
    }

    events() {
        return {
            'click': '_test_button_click'
        }
    }


    render() {
        this.$el.append(template);
    }

    _test_button_click() {
        console.log('test button click!!')
    }
}