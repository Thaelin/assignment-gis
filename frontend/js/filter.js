$(document).ready(function() {
    $('#filterSubmit').click(function() {
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
                
            });
        }
        
    });
});