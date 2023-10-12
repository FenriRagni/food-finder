const GOOGLE = "AIzaSyCFTg8yxhfKfqvVhtZpfmTyXco9qlHLm2Q";
const SEARCH_RESULTS = "restaurantResults";
const SHOW_INITIAL_RESTAURANTS = 4; // Determines how many restaurants to show on the front page

var queryItem = $("#query-item");
var queryLocation = $("#query-location");
var buttonSearch = $("#button-search");
var deviceLocation = { lat: 0, lng: 0 }
var searchLocation = { lat: 0, lng: 0 }
var searchRadius = 25; // miles

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
        type: ['food']
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
        
        results.push(searchOptions); // Add searchInfo to the end to use later
        
        // Store results in local storage to bring to see-more-restaurants.html
        let stringifyResults = JSON.stringify(results);
        // console.log(stringifyResults)
        localStorage.setItem(SEARCH_RESULTS, stringifyResults);
        displayResults(results);

        // This is only here for testing purposes. This will occur when the "See more restaurants" button is clicked
        // window.location.href = "./see-more-restaurants.html"
        // queryItem.val(""); // Clear the input fields after going to the next page
        // queryLocation.val("");
    });
}


function displayResults(results) {

    var restaurantContainer = $("#restaurant-display");
    restaurantContainer.val("");
    let cardDiv = $("<div>");
    cardDiv.addClass("columns p-3 mb-0");

    for (let i = 0; i < SHOW_INITIAL_RESTAURANTS; i++) {
        let info = results[i];
        let name = info.name;
        let isOpen = info.opening_hours.open_now ? "Open" : "Closed";
        let priceLevel = buildPriceLevelStr(info.price_level);
        let rating = info.rating;
        let ratingsCount = info.user_ratings_total;

        let card = $("<div>");
        card.addClass("card column is-4 mx-3 mt-3")


        let cardHeader = $("<div>");
        cardHeader.addClass("card-header");

        let cardTitle = $("<h3>");
        cardTitle.addClass("card-header-title title is-3 is-centered");
        cardTitle.text(name)

        cardHeader.append(cardTitle);


        let cardContent = $("<div>");
        cardContent.addClass("card-content is-size-4");

        let isOpenEl = $("<p>");
        isOpenEl.addClass("content");
        isOpenEl.html(`is <strong>${isOpen}</strong>`)

        let ratingEl = $("<p>");
        ratingEl.addClass("content");
        ratingEl.html(`<strong>${rating}</strong> /5 (${ratingsCount} total reviews)`)

        let priceLevelEl = $("<p>");
        priceLevelEl.addClass("content");
        priceLevelEl.html(priceLevel);

        // let descriptionEl = $("<p>");


        cardContent.append(isOpenEl, priceLevelEl, ratingEl);
        card.append(cardHeader, cardContent);
        cardDiv.append(card);
    }

    restaurantContainer.append(cardDiv);

    // var resultColumn = $("<div>").addClass("column is-3 resultDisplay");
    // var resultCard = $("<div>").addClass("card");
    // var cardImage = $("<div>").addClass("card-image");
    // var figure = $("<figure>").addClass("image is-4by3");
    // var cardContent = $("<div>").addClass("card-content");
    // var mediaContent = $("<div>").addClass("media-content");
    // var cardTitle = $("<h1>").addClass("title is-4");
    // var cardSub = $("<h2>").addClass("subtitle is-6");
    // var recipeBox = $("<ul>");
    // resultColumn.append(resultCard);
    // $(".recipeDisplay").append(resultColumn);
    // resultCard.append(cardImage);
    // cardImage.append(figure);
    // resultCard.append(cardContent);
    // cardContent.append(mediaContent);
    // mediaContent.append(cardTitle, cardSub, recipeBox);
    // recipeBox.append("<li>  this is a test  </li>");
    // recipeBox.attr("class","ingredient")
    // figure.append($("<img>").attr("src", imagehtml));
    // cardTitle.text(title);
    // cardSub.text("Cuisine type: " + subtitle);
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