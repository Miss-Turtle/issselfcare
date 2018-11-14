// Get parameters
var getUrlParameters = window.location.href.split("#");
var getUrlBasePart = getUrlParameters[0];
var getUrlParametersPart = getUrlParameters[1];
if (getUrlBasePart.indexOf("/Search/ISSSelfcare.aspx") >= 0) {
    // Verify if parameters exists in url and
    // Determine if there are filter on url qurey search
    // [url parameters start with "k=" when no filter exist and start by "default=" when filter exist]
    if (getUrlParameters.length > 1 && getUrlParametersPart.indexOf("k=" >= 0)) {
        // Verify if doublequotes are in the url query search        
        if (getUrlParametersPart.indexOf("%22") >= 0 || getUrlParametersPart.indexOf("\"") >= 0) {
            var isDoublequoteUrlEncode = false;
            (getUrlParametersPart.indexOf("%22") >= 0) ? isDoublequoteUrlEncode = true : isDoublequoteUrlEncode = false;
            if (!isDoublequoteUrlEncode) {
                getUrlParametersPart = getUrlParametersPart.replace(/"/gi, "%22");
                var firstDoubleQuotePosition = getUrlParametersPart.indexOf("%22");
                var secondDoubleQuotePosition = getUrlParametersPart.indexOf("%22", firstDoubleQuotePosition + 1);
                if (firstDoubleQuotePosition >= 0 && secondDoubleQuotePosition >= 0) {
                    citationTreatmentWindowReload(getUrlBasePart, getUrlParametersPart);
                }
            }
        }
        else {
            // Verify if spaces are in the url query search            
            if (getUrlParametersPart.indexOf("%20") >= 0 || getUrlParametersPart.indexOf(" ") >= 0) {
                // Replace spaces by + on the url query search and reload page
                var newUrlParameters = "";
                var isSpaceUrlEncode = false;
                (getUrlParametersPart.indexOf("%20") >= 0) ? isSpaceUrlEncode = true : isSpaceUrlEncode = false;
                (isSpaceUrlEncode) ? newUrlParameters = getUrlParametersPart.replace(/%20/gi, "%2B") : newUrlParameters = getUrlParametersPart.replace(/ /gi, "%2B");
                window.location = getUrlBasePart + "#" + newUrlParameters;
                window.location.reload(true);
            }
        }
    }
}

// Treat citation terms for Window reload
function citationTreatmentWindowReload(getUrlBasePart, getUrlParametersPart) {
    getUrlParametersPart = getUrlParametersPart.replace("k=", "");
    getUrlParametersPart = getUrlParametersPart.replace(/ /gi, "%20");
    var firstDoubleQuotePosition = getUrlParametersPart.indexOf("%22");
    var secondDoubleQuotePosition = getUrlParametersPart.indexOf("%22", firstDoubleQuotePosition + 1);
    var citation = getUrlParametersPart.slice(firstDoubleQuotePosition, secondDoubleQuotePosition + 3);
    if (getUrlParametersPart.length > citation.length) {
        var getUrlParametersPartCitationLess = getUrlParametersPart.split(citation);
        var getUrlParametersPartCitationLessFirstPart = getUrlParametersPartCitationLess[0];
        var getUrlParametersPartCitationLessSecondPart = getUrlParametersPartCitationLess[1];
        (getUrlParametersPartCitationLessFirstPart.length > 0) ?
            getUrlParametersPartCitationLessFirstPart = getUrlParametersPartCitationLessFirstPart.replace(/%20/gi, "%2B") :
            getUrlParametersPartCitationLessSecondPart = getUrlParametersPartCitationLessSecondPart.replace(/%20/gi, "%2B");
        var parametersReconstitution = (firstDoubleQuotePosition > 0) ? getUrlParametersPartCitationLessFirstPart + citation : citation + getUrlParametersPartCitationLessSecondPart;
        window.location = getUrlBasePart + "#k=" + parametersReconstitution;
        window.location.reload(true);
    }
    else {
        window.location = getUrlBasePart + "#k=" + getUrlParametersPart;
        window.location.reload(true);
    }
}