$(document).ready(function() {
    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmxheXRydWUiLCJhIjoiY2pud3V2b2k0MDFybDNxcWw0cm13dmwwZiJ9.96Hi1GHh8GNtHaiMoRkq0w';

    var map = new mapboxgl.Map({
        container: 'map',
        center: [ 19.696058, 48.6737532 ],
        zoom: 7.15,
        minZoom: 6.75,
        style: 'mapbox://styles/flaytrue/cjpcl12fo22xq2snw85xbzsm3'
    });

    // load cycling routes
    $.get('/cyclingRoutes', function(data) {
        console.log(data);
        data.forEach((route) => {
            map.addLayer({
                "id": "route_" + route.name,
                "type": "line",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "Feature",
                        "properties": {},
                        "geometry": route.route
                    }
                },
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#FF1493",
                    "line-width": 2
                }
            });
        });
    });
});