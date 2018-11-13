// Wrapping jQuery variable to prevent conflict with other libraries
(function ($) {
    // Get parameters
    var getUrlParameters = window.location.href.split("#");
    var getUrlBasePart = getUrlParameters[0];
    var getUrlParametersPart = getUrlParameters[1];
    console.log("getUrlParametersPart");
    console.log(getUrlParametersPart);
    // Verify if parameters exists in url and
    // Determine if there are filter on url qurey search
    // [url parameters start with "k=" when no filter exist and start by "default=" when filter exist]
    if (getUrlParameters.length > 1 && getUrlParametersPart.indexOf("k=" >= 0)) {
        // Verify if doublequotes are in the url query search        
        if (getUrlParametersPart.indexOf("\"") >= 0) {
            console.log("doublequotes");
            console.log(getUrlParametersPart.indexOf("\""));
            console.log(getUrlParametersPart.indexOf("\"", getUrlParametersPart.indexOf("\"") + 1));
            var firstBlockquotePosition = getUrlParametersPart.indexOf("\"");
            var secondBlockquotePosition = getUrlParametersPart.indexOf("\"", firstBlockquotePosition + 1);
            (firstBlockquotePosition >= 0 && secondBlockquotePosition >= 0) ? citationTreatment() : console.log("1 blockquote");
            function citationTreatment(){
                console.log("2 blockquote");                
                var citation = getUrlParametersPart.slice(firstBlockquotePosition, secondBlockquotePosition + 1);
                console.log(citation);
            }
        }
        else {
            // Verify if spaces are in the url query search
            if (getUrlParametersPart.indexOf("%20") >= 0 || getUrlParametersPart.indexOf(" ") >= 0) {
                // Replace spaces by + on the url query search and reload page
                var newUrlParameters = "";
                if (getUrlParametersPart.indexOf("%20") >= 0) {
                    newUrlParameters = getUrlParametersPart.replace("%20", "%2B");
                }
                if (getUrlParametersPart.indexOf(" ") >= 0) {
                    newUrlParameters = getUrlParametersPart.replace(" ", "%2B");
                }
                window.location = getUrlBasePart + "#" + newUrlParameters;
                window.location.reload(true);
            }
        }
    }
    // Wait all document's chargement
    $(document).ready(function () {
        // Verify if parameters exists in url and
        // Get url to determine if there are filter on url qurey search
        // [url parameters start with "k=" when no filter exist and start by "default=" when filter exist]
        if (getUrlParameters.length > 1 && getUrlParametersPart.indexOf("k=") >= 0) {
            // Change input value to hide %2B by space " " on field view
            var newInputSearchText = getUrlParametersPart.replace("k=", "");
            if (newInputSearchText.indexOf("%2B") >= 0) {
                newInputSearchText = newInputSearchText.replace("%2B", " ");
                $("input[title=\"Search...\"]").val(newInputSearchText);
            }
            // Verify if the star item is on search parameters url
            if (getUrlParametersPart.indexOf("k=*") >= 0) {
                // Hide the start item in the input field
                $("input[title=\"Search...\"]").val("");
            }
        }
        // On click reload page with new search
        $("a[title=\"Search\"]").on("click", function (event) {
            getUrlParametersForRedefineSearch(window.location.href, this);
        });
        // On key press enter reload page with new search
        $("input[title=\"Search...\"]").keypress(function (event) {
            if (event.which == 13) {
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

    // Get window location href to redefine search query with + and relaod page with new url
    function getUrlParametersForRedefineSearch(windowLocationHref, element) {
        var getUrlParametersRedefine = windowLocationHref.split("#");
        var getUrlBasePartRedefine = getUrlParametersRedefine[0];
        var getUrlParametersPartRedefine = getUrlParametersRedefine[1];
        var newSearchItem = getUrlParametersPartRedefine;
        // Verify if parameters exists in url and
        // Get url to determine if there are filter on url qurey search
        // [url parameters start with "k=" when no filter exist and start by "default=" when filter exist]
        if (getUrlParametersRedefine.length > 1 && getUrlParametersPartRedefine.indexOf("k=") >= 0 && getUrlParametersPartRedefine.indexOf("%20") >= 0) {
            newSearchItem = newSearchItem.replace("k=", "");
            newSearchItem = newSearchItem.replace("%20", "+");
            window.location.href = getUrlBasePartRedefine + "#" + newSearchItem;
            $getClientControl(element).search(newSearchItem);
        }
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