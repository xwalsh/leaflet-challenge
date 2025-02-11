// All Earthquakes for past day
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(earthquakeURL).then(response => {
    console.log(response);
    processEarthquakeData(response.features);
});

function processEarthquakeData(earthquakeDetails) {

    const earthquakeLayer = L.geoJSON(earthquakeDetails, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
        },
        pointToLayer: (feature, latlng) => {
            const magnitude = feature.properties.mag;
            return L.circleMarker(latlng, {
                radius: magnitude * 5,
                fillColor: determineColor(magnitude),
                fillOpacity: 0.7,
                weight: 0.5
            });
        }
    });

    initializeMap(earthquakeLayer);
}

function determineColor(magnitude) {
    return magnitude <= 1 ? "#84fd6c" :
           magnitude <= 2 ? "#bfd16e" :
           magnitude <= 3 ? "#ddbf5c" :
           magnitude <= 4 ? "#e79b37" :
           magnitude <= 5 ? "#ec7141" : "#f82720";
}

function initializeMap(earthquakeLayer) {
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const topoLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', { layers: 'TOPO-WMS' });

    const grayscaleLayer = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: 'YnpQEhRDopnhG3NFNlYUwXCpK50fR3yagyHj5MwZJKWU0gnuq4iYH7xJ49UjNWaC'
    });

    const baseLayers = {
        "Street Map": streetLayer,
        "Topographic Map": topoLayer,
        "Grayscale Map": grayscaleLayer
    };

    const overlayLayers = { Earthquakes: earthquakeLayer };

    const mapInstance = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetLayer, earthquakeLayer]
    });

    L.control.layers(baseLayers, overlayLayers).addTo(mapInstance);
}
