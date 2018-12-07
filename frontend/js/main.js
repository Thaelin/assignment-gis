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
    $.get('/api/cyclingRoutes', function(data) {
        console.log(data);
        data.forEach((route) => {
            // add map markers
            var startEl = document.createElement('div');
            var finishEl = document.createElement('div');
            startEl.className = 'marker-start';
            finishEl.className = 'marker-finish';

            new mapboxgl.Marker(startEl).setLngLat(route.route.coordinates[0][0]).addTo(map);
            new mapboxgl.Marker(finishEl).setLngLat(route.route.coordinates[0][route.route.coordinates[0].length - 1]).addTo(map);

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
                    "line-color": randomColor(),
                    "line-width": 2
                }
            });
        });
    });
});