const GOOGLE = "AIzaSyCFTg8yxhfKfqvVhtZpfmTyXco9qlHLm2Q";
const SEARCH_RESULTS = "restaurantResults";
const RESULTS_PHOTO_URL = "photo_url";
const RESULTS_IS_OPEN = "is_open";
const RESULTS_NO_HOURS = "No hours listed"
const SHOW_INITIAL_RESTAURANTS = 4; // Determines how many restaurants to show on the front page

var queryItem = $("#query-item");
var queryLocation = $("#query-location");
var buttonSearch = $("#button-search");
var deviceLocation = { lat: 0, lng: 0 }
var searchLocation = { lat: 0, lng: 0 }
var searchRadius = 25; // Miles

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
    if (queryItem.val().length > 0 && queryLocation.val().length > 0){
        fetchGooglePlaces(queryItem.val())
    }
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

        let searchOptions = {
            keyword: keyword,
            city: queryLocation.val(),
            radius: searchRadius,
        }
        // console.log("Results: ", results);
        let updatedResults = updateResults(results);
        displayResults(updatedResults, searchOptions);
        
        updatedResults.push(searchOptions); // Add searchInfo to the end to use later

        // Store results in local storage to bring to see-more-restaurants.html
        let stringifyResults = JSON.stringify(updatedResults);
        // console.log(stringifyResults)
        localStorage.setItem(SEARCH_RESULTS, stringifyResults);
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

        // Make undefined checks 
        let photoUrl = info.icon;
        if (info.photos) {
            photoUrl = info.photos[0].getUrl({maxWidth: 500, maxHeight: 500});
        }
        
        let isOpen = RESULTS_NO_HOURS;
        if (info.opening_hours) {
            isOpen = (info.opening_hours.isOpen()) ? info.opening_hours.isOpen() : info.opening_hours.open_now;
        }
        
        info[RESULTS_PHOTO_URL] = photoUrl;
        info[RESULTS_IS_OPEN] = isOpen;

        results[i] = info
    }

    return resultsCopy;
}


/**
 * Displays the restaurant information to the user.
 * Shows a photo, restaurant name, if open, price level, and rating.
 * @param {JSON} results 
 */
function displayResults(results, searchOptions) {
    var restaurantContainer = $(".restaurant-display");
    restaurantContainer.html("");

    // Only loop through a certain amount of times
    for (let i = 0; i < SHOW_INITIAL_RESTAURANTS; i++) {
        let info = results[i];
        let name = info.name;
        let isOpen = buildIsOpen(info.is_open);
        let priceLevel = buildPriceLevelStr(info.price_level);
        let rating = info.rating;
        let ratingsCount = info.user_ratings_total;
        let photoUrl = info.photo_url;


        var resultColumn = $("<div>").addClass("column is-12 result-display");
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
        
        let bookIcon = createBookmark(name, results[i].place_id, "restaurant");
        cardTitle.append(bookIcon);
        
        let isOpenEl = $("<p>");
        isOpenEl.html(isOpen);

        let ratingEl = $("<p>");
        ratingEl.html(`<strong>${rating}</strong> /5 (${ratingsCount} total reviews)`)

        let priceLevelEl = $("<p>");
        priceLevelEl.html(priceLevel);
        
        let details = $('<p><a href=./restaurant-details.html?q=' + results[i].place_id +'>Details</a><p>');

        mediaContent.append(cardTitle, isOpenEl, priceLevelEl, ratingEl, details);
        
        cardContent.append(mediaContent);
        resultCard.append(cardImage, cardContent);
        resultColumn.append(resultCard);
        restaurantContainer.append(resultColumn); // Append to the container every iteration
    }

    if (results.length > 0) {
        let keyword = searchOptions.keyword;
        let radius = searchOptions.radius;
        let city = searchOptions.city;

        let cityNameNoSpace = "";
        let split = city.split(",")

        for (let i = 0; i < split.length; i++) {
            // First trim leading/trailing whitespace, if there's middle white space then replace with a +
            cityNameNoSpace += split[i].trim().replace(" ", "");
    
            // Add commas to all except the last of the string
            if (i < split.length - 1) cityNameNoSpace += "%20";
        }

        let query = `${keyword}&radius=${radius}&location=${cityNameNoSpace}`
        restaurantContainer.append('<div> <p class = "is-size-2 mb-3 has-text-centered"><a href="./see-more-restaurants.html?q=' + query +'">See more restaurants<p></div>');
    }
}


/**
 * Determines if a place's hours is listed or not, if so then say if place is open or closed.
 * @param {String} isOpen 
 * @returns String if restaurant is open, closed, or has no hours listed
 */
function buildIsOpen(isOpen) {
    if (isOpen === RESULTS_NO_HOURS) {
        return RESULTS_NO_HOURS;
    }

    if (isOpen) {
        return "is <strong>Open</strong>";
    } else {
        return  "is <strong>Closed</strong>";
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


/**
 * Initializes Google API services. Must match that of in the < script > tag in html files
 */
function initGoogle() {
    initAutocomplete()
    initPlaces()
}

/**
 * Specifically initializes the Google Autocomplete API. Only searches for Cities and only receives the gps coordinates of the city selected.
 */
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

/**
 * Specifically initializes the Google Places API. It's neccessary to attach this to a div for the Places API to work.
 * The div doesn't need to show anything, it just needs to exist in the html file.
 */
function initPlaces() {
    // Init map for PlacesServices to work
    infowindow = new google.maps.InfoWindow();
    let map = new google.maps.Map(document.getElementById('map'), {});
    gPlaces = new google.maps.places.PlacesService(map);
}

/**
 * Prompts the user to share their location with the website
 */
function askForUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
}

/**
 * Callback function for askForUserLocation(). Saves the device's location in a local variable
 * @param {Object} position 
 */
function showPosition(position) {
    deviceLocation.lat = position.coords.latitude;
    deviceLocation.lng = position.coords.longitude;
}