import Collection from '../backbone-extensions/Collection';
import ElementModel from './ElementModel';

export default class ElementsCollection extends Collection {
    get model() {
        return ElementModel;
    }

    get_selected() {
        return this.models.filter(model => !!model.selected);
    }
}