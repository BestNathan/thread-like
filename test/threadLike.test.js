const {ThreadLike} = require('../lib')

describe('test threadpool', () => {
    it('should run each job', done => {
        class MyThread extends ThreadLike {
            constructor(num) {
                super(num)
            }
        }
        let count = 0
        const total = 5
        const jobs = []
        for (const _ of new Array(total).fill(0)) {
            jobs.push(function () {
                count++
            })
        }

        new MyThread(2).run(jobs).then(() => {
            expect(count).toBe(total)
            done()
        })
    })

    it('should emit `done` when each job finished', done => {
        let count = 0
        const total = 5
        const jobs = []
        for (const _ of new Array(total).fill(0)) {
            jobs.push(function () {
            })
        }

        class MyThread extends ThreadLike {
            constructor(num) {
                super(num)
            }
            onDone() {
                count++
                if (count === total) {
                    done()
                }
            }
        }
        

        new MyThread(2).run(jobs)
    })

    it('should emit `done` when each job finished even throw', done => {
        let count = 0
        const total = 5
        const jobs = []
        for (const _ of new Array(total).fill(0)) {
            jobs.push(function () {
                return Promise.reject('1')
            })
        }

        class MyThread extends ThreadLike {
            constructor(num) {
                super(num)
            }
            onDone() {
                count++
                if (count === total) {
                    done()
                }
            }
        }
        

        new MyThread(2).run(jobs)
    })

    it('should emit `error` when each job throw', done => {
        let count = 0
        const total = 5
        const jobs = []
        for (const _ of new Array(total).fill(0)) {
            jobs.push(function () {
                return Promise.reject('1')
            })
        }

        class MyThread extends ThreadLike {
            constructor(num) {
                super(num)
            }
            onError() {
                count++
                if (count === total) {
                    done()
                }
            }
        }
        

        new MyThread(2).run(jobs)
    })

    it('should emit `drain` only with no job', done => {
        const total = 5
        const jobs = []
        for (const _ of new Array(total).fill(0)) {
            jobs.push(function () {
            })
        }

        class MyThread extends ThreadLike {
            constructor(num) {
                super(num)
            }
            onDrain() {
                done()
            }
        }
        

        new MyThread(2).run(jobs)
    })
})