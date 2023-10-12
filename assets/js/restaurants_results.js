const SEARCH_RESULTS = "searchResults"

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
    pageH1.text("Showing " + results.length + " results for: " + keyword)

    let pageH2 = $("<h2>");
    pageH2.addClass("title is-3 has-text-primary has-text-centered")
    pageH2.text("within " + radius + " mi in " + city)
    pageH2.insertAfter(pageH1);

    let cardContainer = $("#container-cards");
    let cardDiv = $("<div>");
    cardDiv.addClass("columns p-3");

    for (let i = 0; i < results.length; i++) {
        let info = results[i];
        let name = info.name;
        let isOpen = info.opening_hours.open_now ? "Open" : "Close";
        let priceLevel = buildPriceLevelStr(info.price_level);
        let rating = info.rating;
        let ratingsCount = info.user_ratings_total;

        let card = $("<div>");
        card.addClass("card column is-4 m-3")


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
        isOpenEl.html(`<strong>${isOpen}</strong>`)

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

    cardContainer.append(cardDiv)

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
