$(document).ready(function() {
    $('#loading').hide();

    $('#filterLengthSubmit').click(function() {
        // Filter data to be sent
        var filterData = {};
        var validationErrors = 0;
        // Raw input values
        var minLengthInput = $('#minLengthInput').val();
        var maxLengthInput = $('#maxLengthInput').val();

        // Route length validations
        if (minLengthInput) {
            if (isNaN(minLengthInput)) {
                validationErrors++;
                $('#lengthMustBeNumber').show();
            }
            else {
                $('#lengthMustBeNumber').hide();
                var minLength = Number(minLengthInput);
            }
        }
        if (maxLengthInput) {
            if (isNaN(maxLengthInput)) {
                validationErrors++;
                $('#lengthMustBeNumber').show();
            }
            else {
                $('#lengthMustBeNumber').hide();
                var maxLength = Number(maxLengthInput);
            }
        }
        if (minLength && maxLength) {
            if (minLength > maxLength) {
                validationErrors++;
                $('#minOverlapsMaxWarning').show();
            }
            else {
                $('#minOverlapsMaxWarning').hide();
            }
        }
        filterData.minLength = minLength;
        filterData.maxLength = maxLength;

        if (validationErrors === 0) {
            $.post('/api/cyclingRoutes', filterData, data => {
                $('#filter-form').hide();
                $('#loading').show();
                $('#map').show();
                mapInit(data);
            });
        }
        
    });

    $('#filterWeatherSubmit').click(function() {
        // Filter data to be sent
        var filterData = {};
        var validationErrors = 0;
        // Raw input values
        var minTempInput = $('#minTempInput').val();
        var maxHumidityInput = $('#maxHumidityInput').val();

        // Weather input validations
        if (minTempInput) {
            if (isNaN(minTempInput)) {
                validationErrors++;
                $('#mustBeNumber').show();
            }
            else {
                $('#mustBeNumber').hide();
                var minTemp = Number(minTempInput);
            }
        }
        if (maxHumidityInput) {
            if (isNaN(maxHumidityInput)) {
                validationErrors++;
                $('#mustBeNumber').show();
            }
            else {
                $('#mustBeNumber').hide();
                var maxHumidity = Number(maxHumidityInput);
            }
        }
        filterData.minTemp = minTemp;
        filterData.maxHumidity = maxHumidity;

        if (validationErrors === 0) {
            $.post('/api/cyclingRoutes', filterData, data => {
                $('#filter-form').hide();
                $('#loading').show();
                $('#map').show();
                mapInit(data);
            });
        }
        
    });
});