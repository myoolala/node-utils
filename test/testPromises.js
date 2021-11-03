'use-strict'

const assert = require('assert');
const utils = require('../index.js');

describe('Testing Promises folder', () => {
    describe('Testing the wrapper function', () => {
        const w = utils.wrapPromise;

        it('should return a promise', () => {
            assert.equal('object', typeof w(new Promise(() => {})));
        });

        it('should resolve to an array of 2 element', async () => {
            assert.equal('object', typeof (await w(Promise.resolve())));
            assert.equal(true, Array.isArray(await w(Promise.resolve())));
            assert.equal(2, (await w(Promise.resolve())).length);
        });

        it('should error to an array of 2 element', async () => {
            assert.equal('object', typeof (await w(Promise.reject())));
            assert.equal(true, Array.isArray(await w(Promise.reject())));
            assert.equal(2, (await w(Promise.reject())).length);
        });

        it('Should resolve non promise objects', async () => {
            assert.strictEqual(true, (await w(true))[1]);
            assert.strictEqual(false, (await w(false))[1]);
            assert.strictEqual(0, (await w(0))[1]);
            assert.strictEqual('', (await w(''))[1]);
            assert.strictEqual('object', typeof (await w({}))[1]);
            assert.strictEqual(null, (await w(null))[1]);
            assert.strictEqual(undefined, (await w(undefined))[1]);
            assert.strictEqual(undefined, (await w())[1]);
            assert.strictEqual(0, Object.keys((await w({}))[1]).length);
        });
        
        it('Should not error on non promise objects', async () => {
            assert.strictEqual(null, (await w(true))[0]);
            assert.strictEqual(null, (await w(false))[0]);
            assert.strictEqual(null, (await w(0))[0]);
            assert.strictEqual(null, (await w(''))[0]);
            assert.strictEqual(null, (await w(null))[0]);
            assert.strictEqual(null, (await w(undefined))[0]);
            assert.strictEqual(null, (await w())[0]);
        });

        it('should resolve a promise value', async () => {
            const prom = Promise.resolve('Test String!');

            assert.strictEqual(await prom, (await w(prom))[1]);
        });

        it('should propagate a promise rejection', async () => {
            const message = 'Test String!';
            let prom = Promise.reject(message);

            assert.strictEqual(message, (await w(prom))[0]);
            
            prom = Promise.reject(new Error(message));
            assert.strictEqual(message, (await w(prom))[0].message);
        });

        it('should handle an unresolved promise', async () => {
            const message = 'Test String!';
            let resolver;
            const prom = new Promise((resolve) => {
                resolver = resolve;
            });
            const testResponse = w(prom);
            resolver(message)

            assert.strictEqual(message, (await testResponse)[1]);
        });

        it('should handle an unrejected promise', async () => {
            const message = 'Test String!';
            let rejector;
            let prom = new Promise((resolve, reject) => {
                rejector = reject;
            });
            let testResponse = w(prom);
            rejector(message)

            assert.strictEqual(message, (await testResponse)[0]);

            prom = new Promise((resolve, reject) => {
                rejector = reject;
            });
            testResponse = w(prom);
            rejector(new Error(message))

            assert.strictEqual(message, (await testResponse)[0].message);
        });
    });
});