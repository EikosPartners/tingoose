const fs = require('fs'),
    path = require('path'),
    options = { collection: process.argv[2] },
    Db = require('tingodb')().Db,
    db = new Db(path.resolve(__dirname, '../cache'), {});


db.collection(options.collection).find({}).toArray((err, data) => {
    if (err) {
        console.error(`Collection exported failed --> ${err}`);
        process.exit(1);
        return;
    }

    data.forEach((obj) => {
        delete obj._id;
    });

    fs.writeFile(path.resolve(__dirname, '../cache/', `${options.collection}.json`),
        JSON.stringify(data, null, 4),
        'utf8',
        (error) => {
            if (error) {
                console.error(`Collection exported failed --> ${error}`);
                process.exit(1);
            }
            console.log('Collection exported successfully');
            process.exit(0);
        }
    );
});