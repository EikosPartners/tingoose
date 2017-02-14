const fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Db = require('tingodb')().Db,
    moment = require('moment'),
    db = new Db(path.resolve(__dirname, '../cache'), {}),
    Watchpack = require('watchpack'),
    collectionDictionary = {},
    schemaDictionary = {};

require('./collectionMethods'); // return methods that dont return a cursor as a promise
require('./cursor'); // return cursor as a promise for defined functions

function _setwatch(name, location) {
    const wp = new Watchpack({
            aggregateTimeout: 1000,
            poll: true,
            ignored: /node_modules/
        }),
        _name = name,
        _location = location;
    wp.watch([], [_location], Date.now() - 10000);
    wp.on('change', (f) => {
        if (!Number(f)) { // temp fix for bug
            resetCollection(_name, _location);
        }
    });
}

function resetCollection(_name, _location) {
    const data = _getNewJSON(_location);
    schemaDictionary[_name].data = data;
    db.collection(_name).drop(() => loadCollections(schemaDictionary[_name]));
}

function _getNewJSON(location) {
    return JSON.parse(fs.readFileSync(location), 'utf8');
}

function _mutateData(collection) {
    const schema = collection.options.schema;
    Object.keys(schema).forEach((key) => {
        if (schema[key] === 'Date') {
            collection.data.forEach((d) => {
                d[key] = moment.utc(d[key]).toDate();
            });
        }
    });
}

function loadCollection(name, data, defaultDataPath) {
    let collection;
    db.collectionNames((err, colls) => {
        if (_.findIndex(colls, { name: `cache.${name}` }) === -1) {
            collection = db.collection(name);
            collection.insert(data, { w: 1 }, (error) => {
                console.log(error);
                return;
            });
        } else {
            collection = db.collection(name);
        }

        // collection.__proto__.find = find;

        if (!collectionDictionary[name]) {
            _setwatch(name, defaultDataPath);
        }

        collectionDictionary[name] = collection;
    });
}

function loadCollections(data) {
    const collections = !Array.isArray(data) ? [data] : data;

    collections.forEach((collection) => {
        let collectionData;
        const options = collection.options || {};
        db.collectionNames((err, cols) => {
            if (_.findIndex(cols, { name: `cache.${collection.name}` }) === -1) {
                collectionData = db.collection(collection.name);
                if (options.schema) {
                    _mutateData(collection);
                }
                collectionData.insert(collection.data || [], { w: 1 }, (error) => {
                    console.log(error);
                    return;
                });
            } else {
                collectionData = db.collection(collection.name);
            }

            if (!collectionDictionary[collection.name] && collection.defaultPath) {
                _setwatch(collection.name, collection.defaultPath);
            }
            collectionDictionary[collection.name] = collectionData;
            schemaDictionary[collection.name] = collection;
        });
    });
}

module.exports = {
    loadCollection,
    loadCollections,
    resetCollection,
    collection: collectionDictionary
};