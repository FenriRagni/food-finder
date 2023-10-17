# Food Finder Website 

## Description

This website takes a search query from the user and will find restaurants and recipes related to it. This can help make it easier for users to decide whether they want to eat out or make their favorite dish at home.

We wanted to use 2 different server-side APIs, Google Maps/Places API and Edamam API. Google Maps would be used to search for local restaurants and provide autocomplete when searching for locations. Edamam provides recipes and their details such as the ingredients, calorie count, and the link to the original location of the recipe.

The user can bookmark their favorite recipes/restaurants and look at them in the bookmarks menu. Clicking on the bookmark link from the menu will move to the "details" page for that respective recipe/restaurant. The bookmarks are stored in the browser's local storage.

**Deployment link:** [https://fenriragni.github.io/food-finder/](https://fenriragni.github.io/food-finder/)

## Technologies Used

|Technology Name|Resource|
|-----------|------------|
|JavaScript|[link](https://www.w3schools.com/js/js_intro.asp)|
|CSS|[link](https://www.w3schools.com/css/css_intro.asp)|
|Git|[link](https://www.w3schools.com/git/git_intro.asp?remote=github)|
|JQuery|[link](https://jquery.com/)|
|Bulma|[link](https://bulma.io/documentation/)|
|Google API|[link](https://developers.google.com/maps/documentation/javascript/places#place_details)|
|Edamam API|[link](https://developer.edamam.com/edamam-docs-recipe-api)|

## Images

Website Home Page

<img src="./assets/images/Screenshot%202023-10-13%20at%2011.05.34%20AM.png" style="width: 500px; height: auto" alt="website home page">

<br>Website Demo: <br> ![website-demo](./assets/images/website-demo.gif) <br> <br>
See more demo: <br> ![see-more-demo](./assets/images/see-more-demo.gif) <br><br>
Size change demo: <br>![size-change-demo](./assets/images/size-change-mobile.gif)

Website Banner

<img src="https://img.freepik.com/free-vector/restaurant-mural-wallpaper_52683-48028.jpg?w=900&t=st=1697220890~exp=1697221490~hmac=56f2be0348c88491858d15463dd1f1c75a549d4e02a53116fe016a7fe1df67f2" style="width: 500px; height: auto" alt="fresh food banner">


## Testing

* Search function for many different locations. 
* Search function for many different food recipes.
* Website opening on loading/closing the site.
* Location storage to bookmark recipes/restaurants

## Learning Objectives

Some of the things we wanted to achieve through this project:

* Getting a deeper understanding of API calls and how to handle them
* Dynamically creating elements using the response from API calls
* Learn about different CSS frameworks outside of Bootstrap
* Getting a better understanding of how the git workflow functions with multiple users and resolving issues that arise
* Developing skills in communicating with others on a collaborative project, rather than using the driver/navigator role exclusively

## Code Snippet

A function that returns a negative value if the given item id does not exist in bookmarks. This was crucial in making bookmarks function properly when adding or removing: <br>
```js
function filterBookmarks(itemId){
    for(var x = 0; x < bookmarks.length; x++) {
        if(bookmarks[x].id === itemId){
            return x;
        }
    }
    return -1;
}
```
<br><br>Uses the Google API nearbySearch in order to fill in the autocomplete dynamically based on the user's location: <br>

```js
// Use nearbySearch to get results from the user's keyword(s)
gPlaces.nearbySearch(request, function(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error("couldn't get locations");
        return
    }

    let searchOptions = {
        keyword: keyword,
        city: queryLocation.val(),
        radius: searchRadius,
    }

    let updatedResults = updateResults(results);
    displayResults(updatedResults, searchOptions);
    updatedResults.push(searchOptions); // Add searchInfo to the end to use later

    // Store results in local storage to bring to see-more-restaurants.html
    let stringifyResults = JSON.stringify(updatedResults);
    localStorage.setItem(SEARCH_RESULTS, stringifyResults);
});
```

<br><br>On each of the seeDetails pages we called a function based on the given URL that contained the unique Id of each recipe/restaurant:
```js
var queryResult;
function getSearchQuery() {
    queryResult = document.location.search.split("=")[1];
    if (queryResult) {
        getSearchResults(queryResult);
    } else {
        // If no result, go back to main page
        document.location.replace("./index.html");
    }
};
```
## Credits

[Fresh food image](https://www.freepik.com/free-vector/restaurant-mural-wallpaper_10373272.htm#query=food%20graphic&position=4&from_view=keyword&track=ais)


### Resources

[Browser Geolocation](https://www.w3schools.com/html/html5_geolocation.asp)

[Full height background colo](https://stackoverflow.com/a/10115544)


### Google API

[Google Autocomplete](https://www.youtube.com/watch?v=c3MjU9E9buQ)

[Place Details](https://developers.google.com/maps/documentation/javascript/places#place_details)

[Place Data Fields](https://developers.google.com/maps/documentation/javascript/place-data-fields)

[Place Types](https://developers.google.com/maps/documentation/javascript/supported_types)

[Place Search requests](https://developers.google.com/maps/documentation/javascript/places#place_search_requests)


## Authors

Alonso Ampuero [Github](https://github.com/FenriRagni)
Minami Mukai [Github](https://github.com/mitsukaichi)
Nathan Geronimo [Github](https://github.com/nathangero)
Thai Nghiem [Github](https://github.com/Truecoding4life)