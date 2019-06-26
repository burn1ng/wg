import {isPlainObject as _isPlainObject} from 'lodash-es';
import $ from 'jquery';

export function get_int_from_str(string) {
    return parseInt(string.replace(/^\D+/g, '')) || null;
}

export function enter(obj, part, parts) {
    if (!(part in obj)) {
        throw new Error('Cannot find @ element: ' + parts.join('.'));
    }

    return obj[part];
}

export function deep(obj, parts) {
    let tmp = obj;

    for (let index = 0; index < parts.length; ++index) {
        tmp = enter(tmp, parts[index], parts);
    }

    return tmp;
}

export function is_promise(instance) {
    return instance instanceof Promise;
}

export function inspect(obj, key, value, finder) {
    if (!_isPlainObject(value)) {
        return finder(obj, key, value);
    }

    obj = value;

    Object.keys(obj).forEach(key => inspect(obj, key, obj[key], finder));
}

/**
 *
 * @param {Object}      initial_object
 * @param {function}    finder
 */
export function inspect_object(initial_object, finder) {
    inspect(initial_object, null, initial_object, finder);
}

export function invoke(context, fn, args) {
    /**
     *
     * @private
     * @param   {Object}            context
     * @param   {function|string}   fn
     * @param   {*}                 [args]
     * @returns {*}
     */
    function _invoke(context, fn, args) {
        context = context || null;

        if (args !== void 0) {
            args = [].slice.call(arguments, 2);
        }

        let _fn;

        if (typeof fn === 'function') {
            _fn = fn;
        } else if (typeof fn === 'string' && context) {
            _fn = context[fn];
        }

        if (_fn) {
            return args
                ? _fn.apply(context, args)
                : _fn.call(context);
        }
    }

    if (Array.isArray(context)) {
        return context.map((context) => {
            return _invoke(context, fn, args);
        });
    } else if (context instanceof $) {
        return context
            .map((index, context) => {
                return _invoke($(context), fn, args);
            })
            .get();
    } else {
        return _invoke(context, fn, args);
    }
}