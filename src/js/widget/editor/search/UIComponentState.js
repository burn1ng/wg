import Model from '../../../backbone-extensions/Model';

export default class UIComponentState extends Model {
    defaults() {
        return {
            active: false
        };
    }

    get active() {
        return this.get('active');
    }

    set active(val) {
        this.set('active', !!val);
    }
}