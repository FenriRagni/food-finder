var queryResult;

$(document).ready(function() {
    queryResult= document.location.search.split("=")[1];
    if (queryResult) {
        initPlaces();
        getPlaceDetails(queryResult);
    } else {
    // If no result, go back to main page
        document.location.replace("./index.html");
    }
});




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
        let icon = $('<i class="fa is-pulled-right details-icon" data-id="'+ queryResult + '" data-type="recipe" data-name="' + place.name +'"/>')
        console.log(place.place_id);
        if(filterBookmarks(queryResult) >= 0) {
            icon.data("favorite", true);
            icon.addClass("fa-bookmark")
        }
        else {
            icon.data("favorite", false);
            icon.addClass("fa-bookmark-o")
        }
        icon.on("click", function(){
            var item = $(this);
            console.log("icon: ", item);
            if(item.data("favorite")===false) {
                item.data("favorite", true);
                console.log("favorite: ", item.data("favorite"));
                var obj = {};
                obj["name"] = item.data("name");
                obj["id"] = item.data("id");
                obj["type"] = item.data("type");
                console.log("object: ", obj);
                bookmarks.push(obj);
                console.log("bookmark array: ", bookmarks);
                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
                item.removeClass("fa-bookmark-o");
                item.addClass("fa-bookmark");
                loadBookmarks();
            }
            else{
                item.data("favorite", false);
                item.removeClass("fa-bookmark");
                item.addClass("fa-bookmark-o");
                bookmarks.splice(filterBookmarks(item.data("id")),1);
                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
                loadBookmarks();
            }
        })
        name.append(icon);
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
        let website = $("#website");
        console.log(place.url);
        website.html('<a href="'+ place.url +'"> Find it on Google Maps </a>');
        var reviews = $("#reviews");
        for(let x = 0; x < place.reviews.length; x++){
            let reviewBox = $("<div>");
            reviewBox.addClass("columns reviews is-medium is-justify-content-center");
            let authorBox = $("<div>");
            authorBox.addClass("card review-author is-2 my-2 p-2");
            authorBox.text(place.reviews[x].author_name);
            let authorImg = $("<img>");
            authorImg.attr("src", place.reviews[x].profile_photo_url);
            authorBox.append(authorImg);
            let authorRating = $('<p>');
            authorRating.text(place.reviews[x].rating + "/5");
            authorBox.append(authorRating);
            let authorText = $('<div>');
            authorText.addClass("p-2 my-2 review-text")
            authorText.html("<p>" + place.reviews[x].text + "</p>");
            reviewBox.append(authorBox, authorText);
            reviewBox.addClass("my-2");
            reviews.append(reviewBox);
        }
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