var queryItem = $("#query-item");
var queryLocation = $("#query-location");
var buttonSearch = $("#button-search");
var autocomplete;

$(function() {
    buttonSearch.on("click", handleSearch);
})



function handleSearch(event) {
    event.stopPropagation();
    event.preventDefault();

    let item = queryItem.val();
    let location = queryLocation.val();
    // console.log("item:", item, "location:", location);

    console.log(buildLocationQuery(location))
}

async function handlePlaceChanged() {
    var place = autocomplete.getPlace();

    console.log(place)
    if (!place.geometry) { // Checks if the user did not click on a place
        queryLocation.val("")
    } else {
        console.log(place)
    }
}


async function fetchGooglePlaces() {
    var request = {
        query: 'Museum of Contemporary Art Australia',
        fields: ['name', 'geometry'],
      };
    
    
      autocomplete.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log("worked")
        } else {
            console.log("didn't work")
        }
      });
}

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById("query-location"), {
        types: ["(cities)"],
        fields: ["geometry", "name", "place_id",],
        strictBounds: true,
    });

    autocomplete.addListener('place_changed', handlePlaceChanged);
}

