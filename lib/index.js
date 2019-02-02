const {ThreadPool, events} = require('./threadpool');


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

module.exports = {
    ThreadLike
};
