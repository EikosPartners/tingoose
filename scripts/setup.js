const mkdirp = require('mkdirp'),
        npmAddScript = require('npm-add-script');

mkdirp('cache', (err) => {
    if (err) {
        console.error(err);
    }
});

// Add the tingoline cli as a script to the package.json.
npmAddScript({
    key: 'tingoline',
    value: 'node node_modules/tingoose/src/tingoLine.js',
    force: true
});

