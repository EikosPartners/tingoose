const tcursor = require('../node_modules/tingodb/lib/tcursor');

['toArray', 'count'].forEach((funcName) => {
    const func = tcursor.prototype[funcName];

    tcursor.prototype[funcName] = function (...args) {
        return new Promise((fulfill, reject) => {
            func.call(this, ...args, (err, data) => {
                if (err) {
                    console.log(funcName, err);
                    reject(err);
                }
                fulfill(data);
            });
        });
    };
});