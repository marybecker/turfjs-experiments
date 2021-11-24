const fs = require("fs");
const turf = require("@turf/turf");
const chalk = require("chalk");

var file = __dirname + "/../project-files/truncated-flowlines01-ct-eightmile.geojson";
var fileOut = __dirname + "/../project-files/flowlines01-ct-eightmile-buffered.geojson";
var bufferRadius = 0.2;

fs.readFile(file, "utf8", (err, data) => {
    if (err) throw err;
    // parse the incoming GeoJSON text
    const streams = JSON.parse(data);
    createBuffer(streams,fileOut,bufferRadius);
});

// Create a specified radius (meters) buffer around streams, then dissolve into one feature
function createBuffer(streams,fileOut,bufferRadius){
    let streamBuffer = turf.buffer(streams, bufferRadius, {units:'kilometers'});
    var dissolvedBuffer = turf.dissolve(streamBuffer);
    let streamBufferSimplify = turf.truncate(dissolvedBuffer,{
       precision: 5
    });
    writeBuffer(streamBufferSimplify,fileOut);
}

function writeBuffer(bufferLayer,fileOut) {
    fs.writeFile(
        fileOut,
        JSON.stringify(bufferLayer),
        "utf-8",
        err => {
            if (err) throw err;
            console.log(chalk.green("done writing file!"));
        }
    );
}