// Wrapping jQuery variable to prevent conflict with other libraries
(function ($) {
    // Get parameters
    var getUrlParameters = window.location.href.split("#");
    var getUrlBasePart = getUrlParameters[0];
    var getUrlParametersPart = getUrlParameters[1];
    if (getUrlBasePart.indexOf("/Search/ISSSelfcare.aspx") >= 0) { 
        // Wait all document's chargement
        $(document).ready(function () {
            // Verify if parameters exists in url and
            // Get url to determine if there are filter on url qurey search
            // [url parameters start with "k=" when no filter exist and start by "default=" when filter exist]
            if (getUrlParameters.length > 1 && getUrlParametersPart.indexOf("k=") >= 0) {
                // Change input value to hide %2B by space " " on field view
                var newInputSearchText = getUrlParametersPart.replace("k=", "");
                var searchAddUrlEncodeTable = newInputSearchText.match(/%2B/gi);
                if (searchAddUrlEncodeTable != null) {
                    newInputSearchText = newInputSearchText.replace(/%2B/gi, " ");
                    $("input[title=\"Search...\"]").val(newInputSearchText);
                }
                var searchSpaceUrlEncodeTable = newInputSearchText.match(/%20/gi);
                if (searchSpaceUrlEncodeTable != null) {
                    newInputSearchText = newInputSearchText.replace(/%20/gi, " ");
                    $("input[title=\"Search...\"]").val(newInputSearchText);
                }
                var searchDoubleQuoteUrlEncodeTable = newInputSearchText.match(/%22/gi);
                if (searchDoubleQuoteUrlEncodeTable != null) {
                    newInputSearchText = newInputSearchText.replace(/%22/gi, "\"");
                    $("input[title=\"Search...\"]").val(newInputSearchText);
                }
            }
            // On click reload page with new search
            $("a[title=\"Search\"]").on("click", function (event) {
                console.log("click");
                getUrlParametersForRedefineSearch(window.location.href, this);
            });
            // On key press enter reload page with new search
            $("input[title=\"Search...\"]").keypress(function (event) {
                if (event.which == 13) {
                    console.log("enter");
                    getUrlParametersForRedefineSearch(window.location.href, this);
                }
            });

            // Variables to calculate banner dimension and keep proportionality
            var widthBanner = 1304;
            var heightBanner = 140;
            var widthContentWrapper = $('.contentwrapper').width();
            var pourcentHeightBanner = (widthContentWrapper * 100) / widthBanner;
            var newHeightBanner = (pourcentHeightBanner * heightBanner) / 100;

            // Add a div in the top content wrapper for add banner
            $('.contentwrapper').prepend("<div id='bannerSearch'></div>");
            // Add height for the div bannerSearch
            $('.contentwrapper #bannerSearch').css({
                "height": (Math.round(newHeightBanner) - 4) + "px"
            });

            // Load all necessary SharePoint JavaScript libraries
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
                // Get url of the plateform
                loadListIssselfcareUrlPlateforme('issselfcareUrlPlateforme');
            });
        });
    }

    // Get window location href to redefine search query with + and relaod page with new url
    function getUrlParametersForRedefineSearch(windowLocationHref, element) {
        console.log("redefine search");
        var getUrlParametersRedefine = windowLocationHref.split("#");
        var getUrlBasePartRedefine = getUrlParametersRedefine[0];
        var getUrlParametersPartRedefine = getUrlParametersRedefine[1];
        var newSearchItem = getUrlParametersPartRedefine;
        // Verify if parameters exists in url and
        // Get url to determine if there are filter on url qurey search
        // [url parameters start with "k=" when no filter exist and start by "default=" when filter exist]
        if (getUrlParametersRedefine.length > 1 && getUrlParametersPartRedefine.indexOf("k=") >= 0) {
            newSearchItem = newSearchItem.replace("k=", "");
            /*if(getUrlParametersPartRedefine.indexOf("%22") >= 0){
                newSearchItem = newSearchItem.replace(/%22/gi, "\"");
                window.location.href = getUrlBasePartRedefine + "#" + newSearchItem;
            }
            if(getUrlParametersPartRedefine.indexOf("%20") >= 0){
                newSearchItem = newSearchItem.replace(/%20/gi, "+");
                window.location.href = getUrlBasePartRedefine + "#" + newSearchItem;                
            }    */
            /*$getClientControl(element).search(newSearchItem);*/
            citationTreatmentNoWindowReload(element, getUrlBasePartRedefine, newSearchItem);
        }
    }

    function citationTreatmentNoWindowReload(element, getUrlBasePart, newSearchItem) {
        // Verify if doublequotes are in the url query search        
        if (newSearchItem.indexOf("%22") >= 0) {
            console.log("citation no treatment");
            console.log(getUrlBasePart);
            console.log(newSearchItem);
            var firstDoubleQuotePosition = newSearchItem.indexOf("%22");
            var secondDoubleQuotePosition = newSearchItem.indexOf("%22", firstDoubleQuotePosition + 1);
            var citation = newSearchItem.slice(firstDoubleQuotePosition, secondDoubleQuotePosition + 3);
            console.log("citation");
            console.log(citation);
            console.log("newSearchItem.length");
            console.log(newSearchItem.length);
            console.log("citation.length");
            console.log(citation.length);
            console.log("newSearchItem 0");
            console.log(newSearchItem);
            if (newSearchItem.length > citation.length) {
                console.log("newSearchItem.length > citation.length");
                var getUrlParametersPartCitationLess = newSearchItem.split(citation);
                var getUrlParametersPartCitationLessFirstPart = getUrlParametersPartCitationLess[0];
                var getUrlParametersPartCitationLessSecondPart = getUrlParametersPartCitationLess[1];
                console.log("getUrlParametersPartCitationLess");
                console.log(getUrlParametersPartCitationLess);
                console.log(getUrlParametersPartCitationLessFirstPart);
                console.log(getUrlParametersPartCitationLessFirstPart);
                console.log(getUrlParametersPartCitationLessSecondPart);
                citation = citation.replace(/%22/gi, "\"");
                citation = citation.replace(/%20/gi, " ");
                (getUrlParametersPartCitationLessFirstPart.length > 0) ?
                    getUrlParametersPartCitationLessFirstPart = getUrlParametersPartCitationLessFirstPart.replace(/%20/gi, "+") :
                    getUrlParametersPartCitationLessSecondPart = getUrlParametersPartCitationLessSecondPart.replace(/%20/gi, "+");
                newSearchItem = (firstDoubleQuotePosition > 0) ? getUrlParametersPartCitationLessFirstPart + citation : citation + getUrlParametersPartCitationLessSecondPart;
            }
            console.log("newSearchItem 1");
            console.log(newSearchItem);
        }
        else {
            console.log("parametersReconstitution");
            console.log(newSearchItem);
            newSearchItem = newSearchItem.replace(/%22/gi, "\"");
            console.log("parametersReconstitution %22");
            console.log(newSearchItem);
            newSearchItem = newSearchItem.replace(/%20/gi, "+");
            console.log("parametersReconstitution %20");
            console.log(newSearchItem);
            newSearchItem = newSearchItem.replace(/%2B/gi, "+");
            console.log("parametersReconstitution %2B");
            console.log("newSearchItem 2");
            console.log(newSearchItem);
        }
        console.log("newSearchItem 3");
        console.log(newSearchItem);
        window.location.href = getUrlBasePart + "#" + newSearchItem;
        $getClientControl(element).search(newSearchItem);
    }

    // Function to load list items and get url from list issselfcareUrlPlateforme
    function loadListIssselfcareUrlPlateforme(listTitle) {
        var clientContext = SP.ClientContext.get_current();
        var list = clientContext.get_web().get_lists().getByTitle(listTitle);
        var caml = new SP.CamlQuery();
        caml.set_viewXml('<View>' +
            '<Query>' +
            '<Where>' +
            '<Eq>' +
            '<FieldRef Name=\'Title\' />' +
            '<Value Type=\'Text\'>url</Value>' +
            '</Eq>' +
            '</Where>' +
            '</Query>' +
            '</View>');
        var listItems = list.getItems(caml);
        clientContext.load(listItems, 'Include(Title, IssselfcareUrlPortal)');
        clientContext.executeQueryAsync(Function.createDelegate(this, function () {
            var listItemInfo = '';
            var listItemEnumerator = listItems.getEnumerator();
            while (listItemEnumerator.moveNext()) {
                var listIssselcareUrlPlateforme = listItemEnumerator.get_current();
                listItemInfo += listIssselcareUrlPlateforme.get_item('IssselfcareUrlPortal');
            }
            $('.contentwrapper .welcome > div:nth-of-type(2) > div:first-of-type > div:first-of-type > div:first-of-type > div:nth-of-type(2)')
                .prepend("<div id='iMSearching'><a id='urlPortal' href='" + listItemInfo.toString() + "'><i class='material-icons'>navigate_before</i></a><span>I'm searching</span></div>");
        }), Function.createDelegate(this, function () {
            console.log('Request failed : ' + args.get_message() + '\n' + args.get_stackTrace());
        }));
    }
})(jQuery);