'use strict'
/**
 * Expose compositor.
 */
module.exports = compose
/**
 * Compose `handler` returning
 * a fully valid handler comprised
 * of all those which are passed.
 *
 * @param {Array} handler
 * @return {Function}
 * @api public
 */
function compose(handler) {
    if (!Array.isArray(handler)) throw new TypeError('handler stack must be an array!')
    for (const fn of handler) {
        if (typeof fn !== 'function') throw new TypeError('handler must be composed of functions!')
    }
    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */
    return function(context, next) {
        // last called handler #
        let index = -1
        return dispatch(0)
        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = handler[i]
            if (i === handler.length) fn = next
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}