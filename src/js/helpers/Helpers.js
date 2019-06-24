import svg_icon from './svg_icon.html';
import './icon_styles.scss';

import checkbox_template from './checkbox/checkbox.html';
import checkbox_icon from './checkbox/ch.svg';
import './checkbox/styles.scss';

export const HTMLHelpers = {
    svg_icon(icon = {}) {
        return svg_icon({
            glyph: icon.id,
            viewBox: icon.viewBox || '0 0 16 16',
            basic_class: 'icon'
        });
    },

    checkbox(options = {}) {
        return checkbox_template(
            Object.assign({
                svg_icon: this.svg_icon(checkbox_icon),
                title: '',
                label_css: '',
                tooltip: '',
                name: '',
                value: '',
                attrs: '',
                checked: false,
                disabled: false
            }, options)
        );
    }
};