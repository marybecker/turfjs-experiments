const fs = require("fs");
const turf = require("@turf/turf");
const chalk = require("chalk");


var file1   = __dirname + "/../project-files/wbk-ss-resample-site.geojson";
var file2   = __dirname + "/../project-files/ct-regional-basins.geojson";
var fileOut = __dirname + "/../project-files/WBK-basins-spatialJoin.geojson";

const promises = [
    readFromFile(file1),
    readFromFile(file2)
];

Promise.all(promises)
    .then(result => {
        points = result[0];
        polygons = result[1];
        console.log(turf.getType(points));
        console.log(turf.getType(polygons));

        var tagged = turf.tag(points, polygons, 'REGIONAL', 'REGIONAL');
        console.log(tagged);
        writeFile(tagged,fileOut)
    });

// help from https://stackoverflow.com/questions/58424336/reading-multiple-files-asynchronously-in-node-js
function readFromFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function writeFile(featureCollection,fileOut) {
    fs.writeFile(
        fileOut,
        JSON.stringify(featureCollection),
        "utf-8",
        err => {
            if (err) throw err;
            console.log(chalk.green("done writing file!"));
        }
    );
}




