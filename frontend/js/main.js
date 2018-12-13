$(document).ready(function() {
    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmxheXRydWUiLCJhIjoiY2pud3V2b2k0MDFybDNxcWw0cm13dmwwZiJ9.96Hi1GHh8GNtHaiMoRkq0w';

    var map = new mapboxgl.Map({
        container: 'map',
        center: [ 19.696058, 48.6737532 ],
        zoom: 7.15,
        minZoom: 6.75,
        style: 'mapbox://styles/flaytrue/cjpcl12fo22xq2snw85xbzsm3?optimize=true'
    });

    // load cycling routes
    $.get('/api/cyclingRoutes', data => {
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
                    "line-color": randomColor({ luminosity: 'dark' }),
                    "line-width": 3
                }
            });

            // get actual weather points for each route
            $.get('/api/weatherPoints/' + route.fid, data => {
                data.forEach(point => {
                    var element = document.createElement('div');

                    switch(point.type) {
                        case 'START':
                            element.className = 'marker-start';
                            break;
                        case 'FINISH':
                            element.className = 'marker-finish';
                            break;
                        default:
                            element.className = 'marker-weather';
                    }

                    new mapboxgl.Marker(element)
                        .setLngLat(point.data.coordinates)
                        .setPopup(
                            new mapboxgl.Popup({ offset: 25 })
                                .setHTML(
                                    `<h4>${point.type} milestone</h4><p><b>Route:</b> ${route.name}</p>
                                    <p><b>Length:</b> ${route.length.toFixed(2)} km</p>
                                    <img alt="weather-icon" src="/assets/icons/${point.data.weather.icon}.png"/>
                                    <p><b>Temperature:</b> ${point.data.weather.temperature} °C</p>
                                    <p><b>Humidity:</b> ${point.data.weather.humidity} %</p>
                                    <p><b>Pressure:</b> ${point.data.weather.pressure} HpA</p>
                                    `
                                )
                        )
                        .addTo(map);
                });

                $('#loading').hide();
            });
        });
    });
});