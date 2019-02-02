const Events = require('events').EventEmitter;
const Promise = require('bluebird');

function wrapTask(task) {
    if (typeof task === 'function') {
        return task()
    }

    return task
}

const events = {
    INNER_DONE: 'inner_done',
    DONE: 'done',
    DRAIN: 'drain',
    ERROR: 'error',
}

class ThreadPool extends Events {
    constructor(max) {
        super()
        // max concurrency
        this.max = max
        // init count
        this.count = 0
    }
    _avaliable() {
        return this.max > this.count
    }
    _wait() {
        this.shouldDrain = false
        return new Promise((resolve) => {
            this.on(events.INNER_DONE, resolve)
        });
    }
    add(task) {
        this.shouldDrain = true
        if (!this._avaliable()) {
            return this._wait().then(() => this.add(task))
        }

        // current count add 1
        this.count ++

        // remove inner done handler for not leak memory
        this.removeAllListeners(events.INNER_DONE)

        // process
        Promise.resolve(wrapTask(task)).catch(() => {
            // if error emit current task
            this.emit(events.ERROR, task)
        }).finally(() => {
            // emit inner done
            this.emit(events.INNER_DONE)
            // finally emit done
            this.emit(events.DONE)

            // current count reduce 1
            this.count--

            // if there is no tasks emit drain
            if (this.count === 0 && this.shouldDrain) {
                this.emit(events.DRAIN)
            }
        })
    }
}

module.exports = {
    ThreadPool,
    events,
}