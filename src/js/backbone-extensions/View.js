import Backbone from './../plugins/backbone';
import $ from 'jquery';
import {
    each as _each,
    cloneDeep as _cloneDeep,
    result as _result,
    isFunction as _isFunction,
    debounce as _debounce
} from 'lodash-es';
import {
    invoke,
    is_promise,
    deep,
    inspect_object
} from './../helpers/JsHelpers';

const VIEW_ID_ATTR = `view-id`;
const UI_REGEXP = /(@[^\s^,]+(\.[^\s^,]+)*)/g;
const STANDARD_DEBOUNCE = 100;
const DIRECTIVES_SELECTORS = {
    UI: '[ui]',
    SUBVIEW: '[data-subview]'
};

export default Backbone.View.extend({
    preinitialize(props) {
        this.rendered = false;

        // extend this with options variables
        let new_key;
        let self = this;
        _each(props, function (value, key) {
            new_key = (key[0] !== '_')
                ? '_' + key
                : key;

            self[new_key] = value;
        });

        this._initialize_variables();
        this._redefine_methods();
    },

    className() {
        return invoke(this, 'class_name');
    },

    onRendered() {
        return invoke(this, 'on_rendered');
    },

    tagName() {
        return invoke(this, 'tag_name') || 'div';
    },

    /**
     * Append subview to selector
     *
     * @param   {View}          view
     * @param   {string|jQuery} [selector=this.$el]
     * @param   {*}             [attributes=null]   DOM attributes
     * @param   {boolean}             [append_to_dom=true]
     * @returns {View|Promise<View|*>}
     */
    append(view, selector, attributes, append_to_dom = true) {
        return this._insert_new_subview(view, selector, 'append', attributes, append_to_dom);
    },

    append_list(views, selector = this.$el, append_to_dom = true) {
        let document_fragment = $(document.createDocumentFragment());

        views.forEach(view => {
            view.render();
            this._register_subview(view);
            document_fragment.append(view.$el);
        });

        if (append_to_dom) {
            selector.append(document_fragment);
            this._show_subviews(views);
        }
    },

    /**
     * Remove subviews and clear DOM
     */
    empty() {
        this.remove_subviews();
        this.$el.empty();
    },

    /**
     * Iterate each subview
     * @param callback
     * @param [context=this]
     */
    each_subview(callback, context) {
        context = context || this;

        _each(this.subviews, function () {
            return callback.apply(context, arguments);
        });
    },

    /**
     * Get subview by id
     * @param id
     * @returns {*}
     */
    get_subview(id) {
        return this.subviews && this.subviews[id];
    },

    /**
     * @description Destroy view with subviews and detach DOM node
     *
     * Note: View will still exist as cached object
     * to support self-rendering on any events/triggers
     */
    destroy() {
        this.remove();
        this.is_destroyed = true;

        if (this.parent_view) {
            this.parent_view.each_subview((subview, index) => {
                if (subview === this) {
                    delete this.parent_view.subviews[index];
                    return false;
                }
            });
        }
    },

    debounced(method, debounce = STANDARD_DEBOUNCE) {
        return _debounce(
            (...args) => method.call(this, ...args),
            debounce
        );
    },

    /**
     * Removes all subviews and cleans up references in this.subviews.
     */
    remove_subviews() {
        if (this.subviews) {
            Object.keys(this.subviews).forEach(subview_id =>
                this._remove_subview(subview_id)
            );
            delete this.subviews;
        }
    },

    /**
     * Insert subview to specific selector and save it into cache.
     *
     * @private
     * @param   {View}          view
     * @param   {string|jQuery} [selector=this.$el]
     * @param   {string}        jquery_action       Append/before/etc.
     * @param   {*}             [attributes=null]   DOM attributes
     * @param   {boolean}             [append_to_dom=true]
     * @returns {View|Promise<View|*>}
     */
    _insert_new_subview(view, selector, jquery_action, attributes, append_to_dom = true) {
        view.parent_view = this;

        let container;
        if (!selector) {
            container = this.$el;
        } else if (typeof selector === 'string') {
            container = this.$(selector);
        } else {
            container = selector;
        }

        if (attributes) {
            view.$el.attr(attributes);
        }

        let result = null;
        if (!view.rendered) {
            result = view.render();
        }

        if (append_to_dom) {
            container[jquery_action](view.$el);
        }

        this._register_subview(view);
        if (append_to_dom) {
            this._show_subviews(view);
        }

        return result || this;
    },

    _register_subview(view) {
        if (!view) {
            return;
        }

        let id = view.id || view.cid;
        view.parent_view = this;
        this.subviews = this.subviews || {};
        this.subviews[id] = view;
    },

    _initialize_variables() {
        this.parent_view = null;

        this.ui = _cloneDeep(_result(this, 'ui') || {});
        this.children_ui = Object.assign({}, _result(this, 'children_ui'));
        this.ui_selectors = _cloneDeep(this.ui);
        this.children_ui_selectors = Object.assign({}, this.children_ui);
    },

    /**
     * Redefine "render" and "remove" functions to work with subviews
     * @private
     */
    _redefine_methods() {
        const original_render_method = this.render;
        const original_remove_method = this.remove;
        const original_delegateEvents_method = this.delegateEvents;

        /**
         *
         * @returns {View|Promise.<View|*>}
         */
        this.render = function () {
            this._pre_render();

            const result = original_render_method.apply(this, arguments);

            return is_promise(result)
                ? result.then(result => this._process_render_result(result))
                : this._process_render_result(result);
        };

        /**
         *
         * @returns {View}
         */
        this.remove = function () {
            this.__$_is_shown = false;
            this.remove_subviews();
            if (this.destructor) {
                this.destructor();
            }

            this.trigger('destructor');
            original_remove_method.call(this);
            this.trigger('destructed');

            return this;
        };

        /**
         *
         * @returns {*}
         */
        this.delegateEvents = function () {
            original_delegateEvents_method.apply(this);
            this._delegate_children_events();
            return this;
        };
    },

    /**
     * Detach each subviews, so that they do not loose their DOM events when
     * we re-render the contents of this view's DOM element.
     * @private
     */
    _pre_render() {
        if (!this.subviews) {
            this.subviews = {};
        }
        _each(this.subviews, subview => subview.$el.detach());
        /*if (this.on_hover_init) {
            this.$el.one('mouseenter', () => this.on_hover_init());
        }*/
    },

    /**
     *
     * @param   {*} result
     * @returns {*}
     */
    _process_render_result(result) {
        this._fill_ui_in_strings_from_ui_directive_of_$element();
        this._fill_events_by_ui();
        this._fill_events_by_ui('children_events', this.children_ui_selectors);
        this.delegateEvents();
        let on_rendered = this._post_render();

        if (is_promise(on_rendered)) {
            return on_rendered.then(() => {
                return result;
            });
        }

        return result === undefined
            ? this
            : result;
    },

    /**
     *
     * @private
     */
    _fill_ui_in_strings_from_ui_directive_of_$element() {
        const ui_in_strings = this.ui_selectors;

        this.$(DIRECTIVES_SELECTORS.UI).each(
            /**
             *
             * @param {number}  index
             * @param {Element} element
             */
            (index, element) => {
                const name = element.getAttribute('ui');
                const ui_selector = `[ui="${name}"]`;

                if (name in ui_in_strings && ui_selector !== ui_in_strings[name]) {
                    console.warn(`UI name ${name} already used. Will be redefined`);
                }

                ui_in_strings[name] = ui_selector;
            }
        );
    },

    /**
     * @description
     * Changes @ui patterns to real .querySelector selector.
     * Also provided changing of "ui" directive to attribute equivalent '[ui="some-ui-name"]'
     *
     * For example:
     * ui:
     *     $button: '[some-selector-attribute]',
     *     $button1: '.some-selector-class'
     *
     * events:
     *     'click @ui.$button': '_do_smt',
     *     'click @ui.$button1': '_do_smt1'
     *
     * "events" will be changed to:
     *
     * events:
     *     'click [some-selector-attribute]': '_do_smt',
     *     'click .some-selector-class': '_do_smt1'
     *
     *
     * For "ui" attribute it will be change to [ui="some-ui-name"]:
     *
     * in html:
     * <div ui="some-ui-name"></div>
     *
     * in view javascript file:
     * events: 'click @ui.some-ui-name': '_do_smt'
     * changed to:
     * events: 'click [ui="some-ui-name"]': '_do_smt'
     *
     * @protected
     */
    _fill_events_by_ui(events_filed = 'events', ui_selectors = this.ui_selectors) {
        const original_events = this[events_filed];
        const events = typeof original_events === 'function'
            ? original_events.call(this)
            : original_events;

        if (!events) {
            return;
        }

        Object.keys(events).forEach(key => {
            const patterns = key.match(UI_REGEXP);

            if (!patterns) {
                return;
            }

            try {
                events[patterns.reduce(
                    (new_key, pattern) => new_key.replace(
                        pattern,
                        deep(
                            {ui: ui_selectors},
                            pattern.substring(1).split('.')
                        )
                    ),
                    key
                )] = events[key];
            } catch (search_error) {
                console.warn(search_error);
            }

            delete events[key];
        });

        this[events_filed] = events;
    },

    _delegate_children_events() {
        let events = Object.assign({}, _result(this, 'children_events'));

        if (!events) {
            return this;
        }
        for (let key in events) {
            let match = key.match(/^(\S+)\s*(.*)$/);

            if (!match[2]) {
                match[2] = `[${VIEW_ID_ATTR}]`;
            }

            if (match[2].charAt(0) === '>') {
                match[2] = match[2].substr(1).trim();
            }

            this.delegate(match[1], match[2], (event) => {
                let child_view = this._get_children_view_to_process_event(event);
                if (!child_view) {
                    return;
                }
                let method = events[key];
                if (!_isFunction(method)) {
                    method = child_view[events[key]];
                }
                if (!method) {
                    return;
                }
                method.call(child_view, event);
            });
        }
        return this;
    },

    _get_children_view_to_process_event(event) {
        if (!this.subviews) {
            return;
        }

        let child_event_element = event.currentTarget;
        let child_top_item;

        if (child_event_element.hasAttribute(VIEW_ID_ATTR)) {
            child_top_item = child_event_element;
        } else {
            child_top_item = child_event_element.closest(`[${VIEW_ID_ATTR}]`);
        }

        if (!child_top_item) {
            return;
        }

        let child_id = child_top_item.getAttribute(VIEW_ID_ATTR);
        if (!child_id) {
            return;
        }

        let children_views = this.children_views || {};
        let child_view = this.subviews[child_id] || children_views[child_id];
        if (!child_view) {
            return;
        }

        return child_view;
    },

    /**
     * Runs after render functions.
     * Creates subviews from DOM "data-subview" elements.
     * @private
     */
    _post_render() {
        const subview_to_render = [];

        // Support subviewCreators as both objects and functions.
        if (typeof this.subviewCreators === 'function') {
            this.subviewCreators = _result(this, 'subviewCreators');
        } else if (!this.subviewCreators) {
            this.subviewCreators = {};
        }

        this.$el.attr(VIEW_ID_ATTR, this.cid);
        this.$(DIRECTIVES_SELECTORS.SUBVIEW).each((index, element) => {
            const $placeholder = $(element);
            const subview_name = $placeholder.data('subview');

            let new_subview;

            // create new subview
            if (this.subviews[subview_name] === undefined) {
                new_subview = this._create_subview(subview_name);
                // subview creators can return null to indicate that the subview should not be created
                if (new_subview === null) {
                    return;
                }
                this.subviews[subview_name] = new_subview;
                new_subview.parent_view = this;
            } else {
                // render subview from cache
                new_subview = this.subviews[subview_name];
            }

            subview_to_render.push(new_subview);
            $placeholder.replaceWith(new_subview.$el);
        });

        subview_to_render.forEach(subview => subview.render());

        this._fill_ui();
        this.rendered = true;
        let on_rendered = invoke(this, 'onRendered');
        invoke(this, 'onSubviewsRendered');

        this._show_subviews(subview_to_render);

        return on_rendered;
    },

    /**
     *
     * @param {View|Array.<View>} subviews
     */
    _show_subviews(subviews) {
        let _onShow = this.onShow;

        if (!Array.isArray(subviews)) {
            subviews = [subviews];
        }

        if (this.__$_is_shown) {
            subviews.forEach(subview => {
                if (!subview.__$_is_shown) {
                    subview.__$_is_shown = true;
                    subview.onShow && subview.onShow();
                }
            });
        } else {
            this.onShow = () => {
                this.__$_is_shown = true;
                _onShow && _onShow.call(this);

                subviews.forEach(subview => {
                    if (!subview.__$_is_shown) {
                        if (!subview.is_destroyed && subview.onShow) {
                            subview.onShow();
                        }
                    }
                });
            };
        }
    },

    /**
     * Return a new subview instance.
     * @param {String} subview_name - subview name
     * @returns {*} - View object
     * @private
     */
    _create_subview(subview_name) {
        let subview_creator = this.subviewCreators[subview_name];

        if (subview_creator === undefined) {
            throw new Error('Can not find subview creator for subview named: ' + subview_name);
        }

        return subview_creator.apply(this);
    },

    _fill_ui() {
        const ui_in_strings = this.ui_selectors;

        this.ui = this.rendered
            ? Object.assign(this.ui, ui_in_strings)
            : Object.assign({}, this.ui_selectors, this.ui);

        inspect_object(this.ui, (root, key, value) => {
            if (typeof value === 'string') {
                root[key] = this.$(value);
            }
        });
    },

    _remove_subview(id) {
        const subview_to_remove = this.get_subview(id);

        if (!subview_to_remove) {
            return false;
        }

        subview_to_remove.destroy();
        delete this.subviews[id];

        return true;
    },
});