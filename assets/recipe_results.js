function getSearchQuery() {
    var queryResult = document.location.search.split("=")[1];
    if (queryResult) {
        console.log(queryResult);
        getSearchResults(queryResult);
    } else {
        // If no result, go back to main page
        document.location.replace("./index.html");
    }
};

/*
function getSearchResults(){
    requestUrl = 
}
*/
getSearchQuery();
