import View from '../../backbone-extensions/View';


export default class SelectionEditor extends View {
    constructor(collection) {
        super();

        //NOTE: dont' interact with initial collection;
        this._initial_selection_collection = collection;
        //TODO: build new collection with new models copies which will overwrite initial collection after APPLY button

        //TODO: should be fully destroyed after CANCEL button or 'X' link
    }

    class_name() {
        return 'selection-editor';
    }
}