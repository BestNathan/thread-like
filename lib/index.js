const {ThreadPool, events} = require('./threadpool');
const compose = require('./compose');


class ThreadLike {
    constructor(maxThread){
        this.pool = new ThreadPool(maxThread)
        this.pool.on(events.ERROR, job => {
            if (typeof this.onError === 'function') {
                this.onError(job)
            }
        })
        this.pool.on(events.DRAIN, () => {
            if (typeof this.onDrain === 'function') {
                this.onDrain()
            }
        })
        this.pool.on(events.DONE, () => {
            if (typeof this.onDone === 'function') {
                this.onDone()
            }
        })
    }
    async run(jobs) {
        if (!Array.isArray(jobs)) {
            jobs = [jobs];
        }

        for (const job of jobs) {
            await this.pool.add(job);
        }
    }
}

function threadCompose(context, ...handlers) {
    const fn = compose([].concat(...handlers))

    function _threadComposed() {
        return Promise.resolve(fn(context))
            .then(() => context)
            .catch(err => {
                context.error = err
                return context
            })
    }

    _threadComposed.context = context
    return _threadComposed
}

module.exports = {
    ThreadLike,
    threadCompose,
};
