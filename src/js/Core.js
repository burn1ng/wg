import $ from 'jquery';
import Widget from './widget/Widget';
import ElementsCollection from './ElementsCollection';

const APP_CONTAINER_CSS = '#app';

export default class Core {
    static init() {
        return this._load_data()
            .then(
                data => {
                    let app_node = $(APP_CONTAINER_CSS);

                    data[0].selected = true;
                    data[1].selected = true;

                    let view = new Widget(
                        new ElementsCollection(data)
                    );
                    view.render();

                    app_node.append(view.$el);
                }
            );
    }

    static _load_data() {
        let data = [];

        for (let i = 1; i <= 300; i++) {
            data.push({
                title: `Элемент ${i}`
            });
        }

        return Promise.resolve(data);
    }
}