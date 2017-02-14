const tcoll = require('../node_modules/tingodb/lib/tcoll');

['findOne', 'update', 'remove', 'findAndModify'].forEach((funcName) => {
    const func = tcoll.prototype[funcName];

    tcoll.prototype[funcName] = function (...args) {
        return new Promise((fulfill, reject) => {
            func.call(this, ...args, (err, data) => {
                if (err) { reject(err); }
                fulfill(data);
            });
        });
    };
});