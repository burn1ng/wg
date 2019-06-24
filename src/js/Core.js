import $ from 'jquery';
import Widget from './widget/Widget';

const APP_CONTAINER_CSS = '#app';

export default class Core {
    static init() {
        return this._load_data()
            .then(
                data => {
                    let app_node = $(APP_CONTAINER_CSS);
                    let view = new Widget({data});
                    view.render();

                    app_node.append(view.$el);
                }
            );
    }

    static _load_data() {
        let data = [];

        for (let i = 1; i <= 10; i++) {
            data.push({
                title: `Элемент ${i}`
            });
        }

        return Promise.resolve(data);
    }
}