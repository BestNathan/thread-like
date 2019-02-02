const {ThreadLike} = require('./lib');

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        console.log(`${time/1000}s begin at ${new Date().toLocaleString()}`);
        if (time === 2000) {
            setTimeout(reject, time);
        } else {
            setTimeout(resolve, time);
        }
    });
}

class MyThread extends ThreadLike {
    constructor(num) {
        super(num)
    }
    onError(task) {
        console.log(String(task) + '  !!!error!!!');
    }
    onDrain() {
        console.log('drain');
    }
}

const arr = [1, 2, 3, 4, 5]
const jobs = []
for (const num of arr) {
    jobs.push(async function () {
        console.log(`running: ${num}`)
        await sleep(1000)
        console.log(`done: ${num}`);
    })
}

const t = new MyThread(2)
t.run(jobs).then(() => {
    console.log('done');
})
