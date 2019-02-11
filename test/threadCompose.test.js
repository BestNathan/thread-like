const {threadCompose} = require('..')

describe('test thread compose', () => {
    it('should success with ctx', done => {
        const context = {}
        const expectObj = {
            handler1: 1,
            handler2: 2,
            handler3: 3,
        }
        const handlers = []
        const ids = [1, 2, 3]
        for (const id of ids) {
            handlers.push((ctx, next) => {
                const key = `handler${id}`
                ctx[key] = expectObj[key]
                return next()
            })
        }

        const composed = threadCompose(context, ...handlers)

        Promise.resolve(composed()).then(() => {
            expect(context).toEqual(expectObj)
            done()
        })
    })
})