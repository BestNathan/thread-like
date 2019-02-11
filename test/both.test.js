const {threadCompose, ThreadLike} = require('..')

describe('both test', () => {
    it('should success', done => {
        let count = 0
        const total = 3

        class MyThread extends ThreadLike {
            constructor() {
                super(total)
            }
            onDone() {
                count++
                if (count === total) {
                    done()
                }
            }
        }

        const ids = Object.keys(new Array(total).fill(0)).map(n => +n)
        const jobs = []
        for (const id of ids) {
            const context = {}
            const err = new Error('test error')
            const handler = (ctx, n) => {
                ctx.handler = id
                return n()
            }
            const errHandler = (ctx, n) => {
                throw err
            }
            const fn = threadCompose(context, handler, errHandler)

            jobs.push(function () {
                return fn().then(ctx => {
                    try {
                        expect(ctx).toHaveProperty('handler', id)
                        expect(ctx).toHaveProperty('error', err)
                    } catch (error) {
                        done(error)
                    }
                })
            })
        }

        new MyThread().run(jobs)
    })
})