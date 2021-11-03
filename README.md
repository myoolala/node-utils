# node-utils
Generic node utils I wish I had in apps when developing various apps

## Functions
### wait
Wraps the set timeout function and returns a promise that resolves when the timeout finishes.
```
wait(1000).then(() => console.log('Done!'));
```
### waitAndPass
Wraps the wait function and returns a function that returns promise that resolves when the timeout finishes with the information passed to the wrapper function.
```
waitAndPass(1000)('Done!').then((data) => console.log(data));
Done!
```
The main intention is to allow for chaining in promises more cleanly
```
https.get(dataUrl)
.then(waitAndPass(500))
.then(render)
```
### wrapPromise
Wraps the promise passed to it such that it always resolves to an array in a similar manner to the old callbacks
```
let [err, data] = await wrapPromise(Promise.resolve('Done!'));
```
```
let [err, data] = await wrapPromise(Promise.reject('Done!'));
```
## Tests
Clone, npm install && npm run test
