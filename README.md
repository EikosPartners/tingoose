# Tingoose
A simple wrapper for tingodb.

## Example
```javascript
    const   data = require('./data.json'),
            path = require('path'),
            tingoose = require('tingoose'),
            collection = tingoose.collection;

    // Load data into tingoose.
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
                })
        });
    }

    findData('mydata')
        .then( (data) => {

        });

```

## Tingoline

This module also exposes a CLI for dumping the data stored into a json file.
When installed, a `tingoline` script will be added to your package.json.

### Usage
`npm run tingoline COLLECTION_NAME`