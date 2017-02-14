const mkdirp = require('mkdirp'),
        npmAddScript = require('npm-add-script');

mkdirp('cache', (err) => {
    if (err) {
        console.error(err);
    }
});

