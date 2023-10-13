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
    fields: ['name', 'rating', 'formatted_phone_number', 'geometry', "formatted_address", "photos", "url", "opening_hours", "review"]
  };
  
  console.log("gPlaces", gPlaces);
  gPlaces.getDetails(request, callback);
  
  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log("place: ", place);
        let image = $("#image");
        image.attr("src",place.photos[0].getUrl({maxWidth: 500, maxHeight: 500}));
        let name = $("#title");
        name.children().text(place.name);
        let info = $("#info");
        let formatted_address = place.formatted_address.split(" ");
        formatted_address[5] = formatted_address[5].split(",")[0];
        console.log("Address: ", formatted_address);
        information = "Address: <br>"+ formatted_address[0] + " " + formatted_address[1] + " " + formatted_address[2] + "<br>     " + formatted_address[3] + " " + formatted_address[4] + " " + formatted_address[5]
        + "<br><br>Phone: <br>" + place.formatted_phone_number
        + "<br><br>Hours: <br>";
        let weekdays = place.opening_hours.weekday_text

        for(let x = 0; x < weekdays.length; x++){
            information += weekdays[x] + "<br>";
        }
        info.html(information);
        let website = $("website");
        console.log(place.url);
        website.html('<a href="'+ place.url +'"> Website </a>')
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