var map = L.map("map", {
    zoomSnap: 0.1,
    center: [41.46149799886257, -72.305173558562768],
    zoom: 11
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
const bufferData = d3.json('data/flowlines01-ct-eightmile-buffered.geojson');
const pointData = d3.json('data/WBK-basins-spatialJoin.geojson');

// use Promise to wait until data is all loaded
Promise.all([bufferData,pointData]).then(drawMap);

// draw map function
function drawMap(data) {


    // Separate data
    const buffer = data[0];
    const points = data[1];
    console.log(points);


    //Draw Catchments
    L.geoJson(buffer, {
        style: function (feature, layer) {
            return {
                color: "white",
                fillColor: "#bdbdbd",
                fillOpacity: ".8",
                weight: 1
            };
        }
    }).addTo(map);

    L.geoJson(points,{
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng,);
        },
        style: function style(feature){
            return{
                radius: 8,
                fillColor: "#636363",
                color: "#20282e",
                weight: 2,
                opacity: 0.5,
                fillOpacity: 0.7
            };
        },
        onEachFeature(feature,layer){

            const props = layer.feature.properties;
            let tooltipInfo = `Site Name: ${props["locationName"]}</br>Regional Basin: ${props["REGIONAL"]}`;

            // bind a tooltip to layer with county-specific information
            layer.bindTooltip(tooltipInfo, {
                // sticky property so tooltip follows the mouse
                sticky: true,
                className: 'customTooltip'
            });

            // when mousing over a layer
            layer.on('mouseover', function () {

                // change the stroke color and bring that element to the front
                layer.setStyle({
                    color: '#ff6e00'
                }).bringToFront();
            });

            // on mousing off layer
            layer.on('mouseout', function () {

                // reset the layer style to its original stroke color
                layer.setStyle({
                    color: '#20282e'
                });
            });
        }
    }).addTo(map);

}