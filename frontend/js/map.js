var map;

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('.') + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

function mapInit(data) {
    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmxheXRydWUiLCJhIjoiY2pud3V2b2k0MDFybDNxcWw0cm13dmwwZiJ9.96Hi1GHh8GNtHaiMoRkq0w';

    map = new mapboxgl.Map({
        container: 'map',
        center: [ 19.696058, 48.6737532 ],
        zoom: 7.15,
        style: 'mapbox://styles/flaytrue/cjpcl12fo22xq2snw85xbzsm3?optimize=true'
    });

    if (data) {
        map.on('style.load', function() {
            loadMapData(data);
        });
    }
    else {
        loadHeatmapData();
    }
}

function loadHeatmapData() {
    $.get('/api/gridpoints', data => {
        console.log('gridPoints', data);

        data.features.forEach(item => {
            item.properties.temperature /= 59;
        });

        map.addSource(`heatmap-source`, {
            "type": "geojson",
            "data": data
        });

        map.addLayer({
            "id": `heatmap`,
            "type": "heatmap",
            "source": `heatmap-source`,
            "maxzoom": 9,
            "paint": {
                // Increase the heatmap weight based on frequency and property magnitude
                
                "heatmap-weight": [
                    "interpolate",
                    ["linear"],
                    ["get","temperature"],
                    0, 0,
                    1, 1.5
                ],
                
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                /*
                "heatmap-intensity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 0,
                    9, 0.8
                ],
                */
                
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(33,102,172,0)",
                    0.2, "rgb(103,169,207)",
                    0.4, "rgb(209,229,240)",
                    0.6, "rgb(253,219,199)",
                    0.8, "rgb(239,138,98)",
                    1, "rgb(178,24,43)"
                ],
                "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 30,
                    1, 30
                ],
            }
        }, 'waterway-label');
        $('#loading').hide();
    });
}

function loadMapData(data) {

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
                                `<h4>${point.type.toLowerCase().replace(/^./, str => str.toUpperCase())} milestone</h4><p><b>Route:</b> ${route.name}</p>
                                <p><b>Length:</b> ${route.length.toFixed(2)} km</p>
                                <img alt="weather-icon" src="/assets/icons/${point.data.weather.icon}.png"/>
                                <p><b>Description:</b> ${point.data.weather.description}</p>
                                <p><b>Temperature:</b> ${point.data.weather.temperature} °C</p>
                                <p><b>Humidity:</b> ${point.data.weather.humidity} %</p>
                                <p><b>Pressure:</b> ${point.data.weather.pressure} HpA</p>
                                <p><b>Last weather update:</b> ${formatDate(point.data.measureDate)}</p>
                                `
                            )
                    )
                    .addTo(map);
            });
            

            $('#loading').hide();
        });
    });
    

    if (data.length === 0 ) {
        $('#loading').hide();
    }
}