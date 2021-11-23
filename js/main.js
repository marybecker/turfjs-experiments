var map = L.map("map", {
    zoomSnap: 0.1,
    center: [41.46149799886257, -72.305173558562768],
    zoom: 12
});

// add a basemap of tiles
L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png",
    {
        maxZoom: 18,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
    }
).addTo(map);


// use D3 fetch to request data with async requests
const catchmentsData = d3.json('data/catchments-eightmile.geojson');
const flowlineData = d3.json('data/flowlines-eightmile.geojson');

// use Promise to wait until data is all loaded
Promise.all([catchmentsData,flowlineData]).then(drawMap);


// draw map function
function drawMap(data) {


    // Separate data
    const catchments = data[0];
    const flowline = data[1];
    console.log(flowline);

    //Draw Catchments
    L.geoJson(catchments, {
        style: function(feature, layer) {
            return {
                color: "white",
                fillColor: "#bdbdbd",
                fillOpacity: ".4",
                weight: 1
            };
        },
        onEachFeature(feature,layer){
            //Calculate Area on the fly and bind data to tooltip on hover over
            layer.on('mouseover', function () {

                var catchmentFeature = layer.toGeoJSON();
                var catchmentArea = (turf.area(catchmentFeature) / 1000000).toFixed(2);
                let tooltip = "Catchment Area (SqKm) " + catchmentArea.toLocaleString();
                //console.log(catchmentArea);

                this.bindTooltip(tooltip,{
                    sticky: true,
                    className: 'tooltip',
                });
                // highlight with darker fill

                this.setStyle({
                    fillOpacity: .8
                });
            });
            // on mousing off layer
            layer.on('mouseout', function () {
                // reset the layer style to its original fillOpacity
                this.setStyle({
                    fillOpacity: .4
                });
            });
        }
    }).addTo(map);

    var flow = L.geoJson(flowline, {
        style: function(feature, layer) {
            return {
                color: "navy",
                weight: 5
            };
        },
        onEachFeature(feature,layer){
            var flowlineFeature = layer.toGeoJSON();
            let options = {units: 'kilometers'};

            layer.on('mouseover',function(){
                let flowlineLength = turf.length(flowlineFeature, options);
                let tooltip = 'Length of Stream Segment (km) ' + flowlineLength.toLocaleString();
                this.bindTooltip(tooltip, {
                    sticky: true,
                    className: 'tooltip',
                });
            });
        }


    }).addTo(map);

    flow.on('click', function(e){
        var flowLayer = e.layer;
        var flowLayerGeoJson = flowLayer.toGeoJSON();
        const distance = 0.1;

        // if (flowPtsLine !== undefined){
        //     map.removeLayer(flowPtsLine);
        // }

        var flowPts = getAlong(flowLayerGeoJson,distance);
        var flowPtsLine = L.geoJson(flowPts).addTo(map);
        console.log(flowPtsLine);


    });

}

// Adds points along a line at a specified distance
function getAlong (line,distance){
    var length = turf.lineDistance(line, 'kilometers');
    var collection = [];
    for (let i = 1; i<= length / distance; i++){
        var alongFlowline = turf.along(line, i * distance, 'kilometers');
        collection.push(alongFlowline);
    }

    return turf.featureCollection(collection);
}


