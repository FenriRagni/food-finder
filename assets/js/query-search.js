const GOOGLE = "AIzaSyCFTg8yxhfKfqvVhtZpfmTyXco9qlHLm2Q";
const SEARCH_RESULTS = "restaurantResults";
const SHOW_INITIAL_RESTAURANTS = 4; // Determines how many restaurants to show on the front page

var queryItem = $("#query-item");
var queryLocation = $("#query-location");
var buttonSearch = $("#button-search");
var deviceLocation = { lat: 0, lng: 0 }
var searchLocation = { lat: 0, lng: 0 }
var searchRadius = 25; // Miles
var h3Items = $("h3");
var bookmarks = [];
var bkList = $("#bookmark");

// Google services
var gAutocomplete;
var gPlaces;

askForUserLocation()
$(function() {
    buttonSearch.on("click", handleSearch);
})



function handleSearch(event) {
    event.stopPropagation();
    event.preventDefault();
    
    fetchGooglePlaces(queryItem.val())
}

async function handleUpdateAutocomplete() {
    var place = gAutocomplete.getPlace();

    if (!place.geometry) { // Checks if the user did not click on a place
        console.log(place)
        queryLocation.val("")
    } else {
        searchLocation.lat = place.geometry.location.lat()
        searchLocation.lng = place.geometry.location.lng()
    }
}


function fetchGooglePlaces(keyword) {
    // console.log("@fetchGooglePlaces")
    let location = new google.maps.LatLng(searchLocation.lat, searchLocation.lng);
    let milesToMeters = Math.round(searchRadius * 1.609344) * 1000

    var request = {
        location: location,
        keyword: keyword,
        radius: milesToMeters,
        rankBy: google.maps.places.RankBy.PROMINENCE,
        type: ['food'],
    };

    // console.log("request:", request)

    // Use nearbySearch to get results from the user's keyword(s)
    gPlaces.nearbySearch(request, function(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error("couldn't get locations");
            return
        }

        let updatedResults = updateResults(results);
        displayResults(updatedResults);

        let searchOptions = {
            keyword: keyword,
            city: queryLocation.val(),
            radius: searchRadius,
        }
        
        updatedResults.push(searchOptions); // Add searchInfo to the end to use later

        // Store results in local storage to bring to see-more-restaurants.html
        let stringifyResults = JSON.stringify(updatedResults);
        // console.log(stringifyResults)
        localStorage.setItem(SEARCH_RESULTS, stringifyResults);

        // This is only here for testing purposes. This will occur when the "See more restaurants" button is clicked
        // window.location.href = "./see-more-restaurants.html"
        // queryItem.val(""); // Clear the input fields after going to the next page
        // queryLocation.val("");
    });
}


/**
 * Updates each google place result with a photo url and if its open or not
 * @param {JSON} results 
 * @returns updated version of the JSON with the photo url and if restaurant is currently open.
 */
function updateResults(results) {
    let resultsCopy = results;

    for (let i = 0; i < results.length; i++) {
        let info = results[i];
        let photoUrl = info.photos[0].getUrl({maxWidth: 500, maxHeight: 500});
        let isOpen = (info.opening_hours.isOpen()) ? info.opening_hours.isOpen() : info.opening_hours.open_now;
        info["photo_url"] = photoUrl;
        info["is_open"] = isOpen;

        results[i] = info
    }

    return resultsCopy;
}


/**
 * Displays the restaurant information to the user.
 * Shows a photo, restaurant name, if open, price level, and rating.
 * @param {JSON} results 
 */
function displayResults(results) {
    var restaurantContainer = $(".restaurantDisplay");
    restaurantContainer.html("");

    // Only loop through a certain amount of times
    for (let i = 0; i < SHOW_INITIAL_RESTAURANTS; i++) {
        let info = results[i];
        let name = info.name;
        let isOpen = info.is_open ? "Open" : "Closed";
        let priceLevel = buildPriceLevelStr(info.price_level);
        let rating = info.rating;
        let ratingsCount = info.user_ratings_total;
        let photoUrl = info.photo_url;


        var resultColumn = $("<div>").addClass("column is-12 resultDisplay");
        var resultCard = $("<div>").addClass("card");
        
        var cardImage = $("<div>").addClass("card-image");
        var figure = $("<figure>").addClass("image is-4by3");

        var image = $("<img>").attr("src", photoUrl);
        figure.append(image);
        cardImage.append(figure);


        var cardContent = $("<div>").addClass("card-content");
        var mediaContent = $("<div>").addClass("media-content");

        var cardTitle = $("<h2>");
        cardTitle.addClass("title is-4");
        cardTitle.text(name);

        let isOpenEl = $("<p>");
        isOpenEl.addClass("content");
        isOpenEl.html(`is <strong>${isOpen}</strong>`)

        let ratingEl = $("<p>");
        ratingEl.addClass("content");
        ratingEl.html(`<strong>${rating}</strong> /5 (${ratingsCount} total reviews)`)

        let priceLevelEl = $("<p>");
        priceLevelEl.addClass("content");
        priceLevelEl.html(priceLevel);

        mediaContent.append(cardTitle, isOpenEl, priceLevelEl, ratingEl);
        
        cardContent.append(mediaContent);
        resultCard.append(cardImage, cardContent);
        resultColumn.append(resultCard);
        restaurantContainer.append(resultColumn); // Append to the container every iteration
    }
}

function buildPriceLevelStr(priceLevel) {
    switch (priceLevel) {
        case 0:
            return "Free"
        
        case 1:
            return "<strong>$ </strong>"
        
        case 2:
            return "<strong>$ $</strong>"
    
        case 3:
            return "<strong>$ $ $</strong>"

        case 4:
            return "<strong>$ $ $ $</strong>"
        
        default:
            return "<strong>$ $</strong>"
    }
}



function initGoogle() {
    initAutocomplete()
    initPlaces()
}


function initAutocomplete() {
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
        north: deviceLocation.lat + 0.1,
        south: deviceLocation.lat - 0.1,
        east: deviceLocation.lng + 0.1,
        west: deviceLocation.lng - 0.1,
    };

    const options = {
        bounds: defaultBounds,
        types: ["(cities)"],
        fields: ["geometry"],
    }

    gAutocomplete = new google.maps.places.Autocomplete(document.getElementById("query-location"), options);

    gAutocomplete.addListener('place_changed', handleUpdateAutocomplete);
}


function initPlaces() {
    // Init map for PlacesServices to work
    infowindow = new google.maps.InfoWindow();
    let map = new google.maps.Map(document.getElementById('map'), {});
    gPlaces = new google.maps.places.PlacesService(map);
}


function askForUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
}


function showPosition(position) {
    deviceLocation.lat = position.coords.latitude;
    deviceLocation.lng = position.coords.longitude;
}

$(document).ready(function(){
    loadBookmarks();

    h3Items.on("click", "button", function(){
        clickBtn = $(this);
        console.log("button clicked!");
        console.log("This: ", clickBtn.data("favorite"));
        if(clickBtn.data("favorite")===false){
            clickBtn.data("favorite", true);
            console.log("favorite: ", clickBtn.data("favorite"));
            var obj = {};
            obj["name"] = clickBtn.parent().text().split("\n")[0];
            obj["id"] = clickBtn.parent().data("id");
            obj["type"] = clickBtn.parent().data("type");
            console.log("object: ", obj);
            bookmarks.push(obj);
            console.log("bookmark array: ", bookmarks);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            clickBtn.children().children().removeClass("fa-bookmark-o");
            clickBtn.children().children().addClass("fa-bookmark");
            loadBookmarks();
            
        }
        else{
            clickBtn.data("favorite", false);
            clickBtn.children().children().removeClass("fa-bookmark");
            clickBtn.children().children().addClass("fa-bookmark-o");
            bookmarks.splice(filterBookmarks(clickBtn.parent().text().split("\n")[0]),1);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            loadBookmarks();
            
        }
    })
    function filterBookmarks(name){
        for(var x = 0; x < bookmarks.length; x++) {
            if(bookmarks[x].name === name){
                return x;
            }
        }
        return -1;
    }

    function loadBookmarks(){
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
        console.log("Bookmarks: ", bookmarks);
        if(bookmarks === null || bookmarks.length === 0) {
            bookmarks = [];
            bkList.text("");
            bkList.append($('<div class="dropdown-item">No Bookmarks</div>'));
        }
        else{
            if(bkList.length <= bookmarks.length) {
                bkList.text("");
                for(var x = 0; x < bookmarks.length; x++){
                    // if(bookmarks[x].type === "recipe")
                    bkList.append($('<div class="dropdown-item"><a href= "recipe_results.html?q=' + bookmarks[x].id + '">'+ bookmarks[x].name + '</div>'));
                    //else
                }
            }
            
        }
    }
});