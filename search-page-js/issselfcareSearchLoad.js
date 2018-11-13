// Wrapping jQuery variable to prevent conflict with other libraries
(function ($) {
    // Get parameters
    var getUrlParameters = window.location.href.split("#");
    var getUrlBasePart = getUrlParameters[0];
    var getUrlParametersPart = getUrlParameters[1];
    // Verify if parameters exists in url and
    // Determine if there are filter on url qurey search
    // [url parameters start with "k=" when no filter exist and start by "default=" when filter exist]
    if(getUrlParameters.length > 1 && getUrlParametersPart.indexOf("k=" >= 0)){
        // Verify if doublequotes are in the url query search
        console.log(getUrlParametersPart.indexOf("%2522"));
        if (getUrlParametersPart.indexOf("%2522") >= 0){
            console.log("doublequotes");
        }
        
        // Verify if spaces are in the url query search
        if (getUrlParametersPart.indexOf("%20") >= 0) {
            // Replace spaces by + on the url query search and reload page
            var newUrlParameters = getUrlParametersPart.replace("%20", "%2B");
            window.location = getUrlBasePart + "#" + newUrlParameters;
            window.location.reload(true);
        }        
    }
})(jQuery);