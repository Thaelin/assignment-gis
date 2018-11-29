$(document).ready(function() {
    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmxheXRydWUiLCJhIjoiY2pud3V2b2k0MDFybDNxcWw0cm13dmwwZiJ9.96Hi1GHh8GNtHaiMoRkq0w';

    var map = new mapboxgl.Map({
        container: 'map',
        center: [19.696058, 48.6737532],
        zoom: 7.25,
        minZoom: 6.75,
        style: 'mapbox://styles/mapbox/streets-v10'
    });

    // load cycling routes
    $.get('/cyclingRoutes', function(data) {
        console.log(data);
    });
});