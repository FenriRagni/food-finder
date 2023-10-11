const GOOGLE = "AIzaSyCFTg8yxhfKfqvVhtZpfmTyXco9qlHLm2Q";

var queryItem = $("#query-item");
var queryLocation = $("#query-location");
var buttonSearch = $("#button-search");
var deviceLocation = { lat: 0, lng: 0 }
var searchLocation = { lat: 0, lng: 0 }

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
    
    fetchGooglePlaces()
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


async function fetchGooglePlaces() {
    // console.log("@fetchGooglePlaces")
    let location = new google.maps.LatLng(searchLocation.lat, searchLocation.lng);

    var request = {
        location: location,
        radius: 1000, // In meters
        keyword: queryItem.val(),
        // openNow: true,
        rankBy: google.maps.places.RankBy.PROMINENCE,
        type: ['food']
    };

    // console.log("request:", request)

    // Use nearbySearch to get results from the user's keyword(s)
    gPlaces.nearbySearch(request, function(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) return 

        for (var i = 0; i < results.length; i++) {
            console.log(results[i].name, results[i].opening_hours.isOpen(), results[i].vicinity)
            // console.log(results[i])
        }
      });
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