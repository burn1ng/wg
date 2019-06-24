import View from '../../backbone-extensions/View';

import template from './template.html';
import './styles.scss';

export default class SelectionButtons extends View {
    render() {
        this.$el.append(template);
    }
}