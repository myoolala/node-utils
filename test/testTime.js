'use-strict'

const assert = require('assert');
const utils = require('../index.js');

describe('Testing Time folder', () => {
    describe('Testing the wait function', () => {
        const wait = utils.wait;

        it('should return a promise', () => {
            const timer = wait(1);
            assert.equal('object', typeof timer);
            assert.equal('function', typeof timer.then);
            return timer;
        });

        it('should resolve', async () => {
            const timer = wait(1);
            assert.strictEqual(undefined, await timer);
        });

        it('should not resolve immediately', (done) => {
            let isResolved = false;
            const timer = wait(10).then(() => {
                isResolved = true;
            });
            assert.strictEqual(false,  isResolved);

            setTimeout(() => {
                assert.strictEqual(false,  isResolved);
            }, 1);
            
            setTimeout(() => {
                assert.strictEqual(true,  isResolved);
                done();
            }, 15);
        });

        it('should let you reset the timer', (done) => {
            let isResolved = false;
            const timer = wait(10);
            timer.then(() => {
                isResolved = true;
            });
            assert.strictEqual(false,  isResolved);

            setTimeout(() => {
                assert.strictEqual(false,  isResolved);
            }, 1);

            setTimeout(() => {
                timer.refresh();
            }, 8);

            setTimeout(() => {
                assert.strictEqual(false,  isResolved);
            }, 15);
            
            setTimeout(() => {
                assert.strictEqual(true,  isResolved);
                done();
            }, 20);
        });

        it('should reject when the timer is cancelled', (done) => {
            let isResolved = false;
            const timer = wait(10);
            timer.then(() => {
                isResolved = true;
                done('Failed to reject');
            });
            
            setTimeout(() => {
                assert.strictEqual(false,  isResolved);
            }, 5);

            timer.clearWait();
            
            setTimeout(() => {
                assert.strictEqual(false,  isResolved);
            }, 15);
            
            setTimeout(() => {
                timer.catch(err => {
                    assert.strictEqual(false,  isResolved);
                    done();
                });
            }, 20);

        });
    });

    
    describe('Testing the waitAndPass function', () => {
        const waitAndPass = utils.waitAndPass;

        it('should return a function that returns a promise', () => {
            let timer = waitAndPass(1);
            assert.equal('function', typeof timer);
            timer = timer();
            assert.equal('object', typeof timer);
            assert.equal('function', typeof timer.then);
            return timer;
        });

        it('should resolve', () => {
            return waitAndPass(1)();
        });

        it('should resolve the information passed to it', async () => {
            assert.equal('data', await waitAndPass(1)('data'));
            const obj = {};
            assert.strictEqual(obj, await waitAndPass(1)(obj));
        })
    });
});