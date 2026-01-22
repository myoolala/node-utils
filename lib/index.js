'use-strict'
const toExport = {};

const dirs = [
    'logging',
    'promises',
    'time'
]

for (const dir of dirs) {
    if (!__filename.endsWith(dir))
        Object.assign(toExport, require(`./${dir}/index.js`));
}

module.exports = toExport;