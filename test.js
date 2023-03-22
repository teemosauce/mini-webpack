
function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

async function run() {
    [1, 2, 3, 4, 5].forEach(async t => {
        await delay(t * 500)
    })
    console.log(1)
}

run()