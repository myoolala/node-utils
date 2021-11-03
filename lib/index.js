'use-strict'
const fs = require('fs');

const toExport = {};

const dirs = fs.readdirSync(__dirname);

for (const dir of dirs) {
    console.log(dir, __filename)
    if (!__filename.endsWith(dir))
        Object.assign(toExport, require(`./${dir}/index.js`));
}

module.exports = toExport;