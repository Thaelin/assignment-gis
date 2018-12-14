$(document).ready(function() {
    // Initialize map
    mapInit();

    // load cycling routes
    $.get('/api/cyclingRoutes', data => {
        loadMapData(data);
    });
});