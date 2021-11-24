const fs = require("fs");
const csv2geojson = require("csv2geojson");
const chalk = require("chalk");

var file = __dirname + "/../project-files/WBK_StreamSurvey_Resample_Sites.csv";
var fileOut = __dirname + "/../project-files/wbk-ss-resample-site.geojson";

// read file as string
fs.readFile(file, 'utf-8', (err, csvString) => {

    if(err) throw err;

    // convert to GeoJSON
    csv2geojson.csv2geojson(csvString, {
        latfield: 'ylat',
        lonfield: 'xlong',
        delimiter: ','
    }, (err, geojson) => {

        if(err) throw err;

        console.log(geojson); // this is our geojson!

        // write file
        fs.writeFile(fileOut, JSON.stringify(geojson), 'utf-8', (err) => {

            if(err) throw err;

            console.log(chalk.blue('done writing file'));
        });
    })
});