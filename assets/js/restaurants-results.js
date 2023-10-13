const SEARCH_RESULTS = "restaurantResults";
const RESULTS_PHOTO_URL = "photo_url";
const RESULTS_IS_OPEN = "is_open";
const RESULTS_NO_HOURS = "No hours listed"

$(function() {
    let results = loadFromStorage(SEARCH_RESULTS)
    displayResults(results);
})

function loadFromStorage(key) {
    var storage = JSON.parse(localStorage.getItem(key))

    if (storage) {
        return storage
    } else {
        console.log("Nothing found for", key)
    }
}


function displayResults(results) {
    let searchInfo = results.pop();
    let keyword = searchInfo.keyword;
    let city = searchInfo.city;
    let radius = searchInfo.radius;

    let pageH1 = $("h1")
    pageH1.text("Showing " + results.length + " restaurants results for: " + keyword)

    let pageH2 = $("<h2>");
    pageH2.addClass("title is-3 has-text-primary has-text-centered")
    pageH2.text("within " + radius + " mi in " + city)
    pageH2.insertAfter(pageH1);

    let cardContainer = $("#container-cards");
    let cardDiv = $("<div>");
    cardDiv.addClass("columns p-3 mb-0");

    for (let i = 0; i < results.length; i++) {
        let info = results[i];
        let name = info.name;
        let isOpen = buildIsOpen(info.is_open);
        let priceLevel = buildPriceLevelStr(info.price_level);
        let rating = info.rating;
        let ratingsCount = info.user_ratings_total;
        let photo = info[RESULTS_PHOTO_URL];

        let card = $("<div>");
        card.addClass("card column is-3 mx-3 mt-3")


        let cardHeader = $("<div>");
        cardHeader.addClass("card-header");

        let cardTitle = $("<h3>");
        cardTitle.addClass("card-header-title title my-0 is-3 is-centered");
        cardTitle.text(name)
        cardHeader.append(cardTitle);
      
        var icon = $('<i class="fa is-pulled-right more-icon" data-id="'+ results[i].place_id + '" data-type="recipe" data-name="' + name +'"/>')
        if(filterBookmarks(results[i].place_id) >= 0){
            icon.data("favorite", true);
            icon.addClass("fa-bookmark")
        }
        else{
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
        cardHeader.append(icon);
            


        var cardImage = $("<div>").addClass("card-image");
        var figure = $("<figure>").addClass("image is-4by3");

        var image = $("<img>").attr("src", photo);
        figure.append(image);
        cardImage.append(figure);
        let cardContent = $("<div>");
        cardContent.addClass("card-content is-size-4");

        let isOpenEl = $("<p>");
        isOpenEl.addClass("content");
        isOpenEl.html(isOpen)

        let ratingEl = $("<p>");
        ratingEl.addClass("content");
        ratingEl.html(`<strong>${rating}</strong> /5 (${ratingsCount} total reviews)`)

        let priceLevelEl = $("<p>");
        priceLevelEl.addClass("content");
        priceLevelEl.html(priceLevel);

        // let descriptionEl = $("<p>");


        cardContent.append(isOpenEl, priceLevelEl, ratingEl);
        card.append(cardImage, cardHeader, cardContent);
        cardDiv.append(card);
    }

    cardContainer.append(cardDiv)

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
loadBookmarks();
// https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJrTLr-GyuEmsRBfy61i59si0&fields=address_components&key=AIzaSyCFTg8yxhfKfqvVhtZpfmTyXco9qlHLm2Q
