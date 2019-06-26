import ElementModel from './ElementModel';
import ICollection from './widget/ICollection';

export default class ElementsCollection extends ICollection {
    get model() {
        return ElementModel;
    }
}