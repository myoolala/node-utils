'use-strict'

module.exports = {
    wrapPromise: promise => {
        if (!promise || !promise.then)
            return Promise.resolve([null, promise]);

        return promise.then(response => {
            return [null, response];
        }, err => {
            return [err, null];
        });
    }
}