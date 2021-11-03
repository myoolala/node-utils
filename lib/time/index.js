'use-strict'

const wait = (timeInMs) => {
    let timer;
    let reject;
    const toReturn = new Promise((resolve, rej) => {
        timer = setTimeout(resolve, timeInMs);
        reject = rej;
    })
    toReturn.refresh = () => {
        timer.refresh();
        return toReturn;
    };
    toReturn.clearWait = () => {
        clearTimeout(timer);
        reject();
    }
    return toReturn;
};

const waitAndPass = (timeInMs) => {
    return (data) => wait(timeInMs).then(() => data);
}

module.exports = {
    wait,
    waitAndPass
}