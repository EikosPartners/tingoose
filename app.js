const express = require('express'),
        http = require('http'),
        data = require('./data.json'),
        path = require('path'),
        tingoose = require('./src/tingoose'),
        collection = tingoose.collection;

tingoose.loadCollections([
    {
        name: 'mydata',
        data: data,
        defaultPath: path.resolve(__dirname, './data.json')
    }
]);

function findData(dataName) {
    return new Promise( (resolve, reject) => {
        collection[dataName]
            .find()
            .toArray()
            .then( (results) => {
                resolve(results);
            })
            .catch( (err) => {
                reject(err);
            });
    });
}

let app = express();

app.get('/', (req, res) => {
    findData('mydata')
        .then( data => {
            res.send(data);
        });
});

let server = http.createServer(app);
server.listen('9001', () => {
    console.log('server running on port 9001..');
});

module.exports = app;
