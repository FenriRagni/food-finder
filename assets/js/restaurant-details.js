var queryResult = document.location.search.split("=")[1];
if (queryResult) {
    initPlaces();
    getPlaceDetails(queryResult);
} else {
// If no result, go back to main page
    document.location.replace("./index.html");
}




function getPlaceDetails(restId) {
var request = {
    placeId: restId,
    fields: ['name', 'rating', 'formatted_phone_number', 'geometry', "formatted_address", "photos", "url"]
  };
  
  console.log("gPlaces", gPlaces);
  gPlaces.getDetails(request, callback);
  
  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log("place: ", place);
        var image = $("#image");
        image.attr("src",place.photos[0].getUrl({maxWidth: 500, maxHeight: 500}));
    }
  }
}
function findRestaurant(restId) {
    var restaurants = JSON.parse(localStorage.getItem("restaurantResults"));
    for( var x = 0; x < restaurants.length; x++){
        if(restaurants[x].place_id === restId){
            return x
        }
    } 
};

function initPlaces() {
    // Init map for PlacesServices to work
    infowindow = new google.maps.InfoWindow();
    let map = new google.maps.Map(document.getElementById('map'), {});
    gPlaces = new google.maps.places.PlacesService(map);
}