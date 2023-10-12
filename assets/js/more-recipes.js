function getSearchQuery() {
    var queryResult = document.location.search.split("=")[1];
    if (queryResult) {
        getSearchResults(queryResult);
    } else {
        // If no result, go back to main page
        document.location.replace("./index.html");
    }
};

function getSearchResults(searchQuery) {
    var requestURL = "https://api.edamam.com/api/recipes/v2?type=public&q="+ searchQuery + "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
    .then(function (data) {
        if (data.hits.length === 0) {
            $("#card-header-title").text("There is no recipe matching your query. Search another menu.")
        } else {
            $("h1").text("Showing " + data.hits.length + " recipe results for: " + searchQuery)
            let cardContainer = $("#container-cards");
            let cardDiv = $("<div>");
            cardDiv.addClass("columns p-3 mb-0");
            for (i = 0; i < 20; i ++) {
                var name = data.hits[i].recipe.label;
                var cuisineType = data.hits[i].recipe.cuisineType;
                var mealTypeData = data.hits[i].recipe.mealType;
                var calorieData = Math.round(data.hits[i].recipe.calories);
                var recipeId = data.hits[i].recipe.uri.split("_")[1];
                var imageSouce = data.hits[i].recipe.images.SMALL.url; 

                let card = $("<div>");
                card.addClass("card column is-3 mx-3 mt-3")
                
                let cardHeader = $("<div>");
                cardHeader.addClass("card-header");
                
                let cardTitle = $("<h3>");
                cardTitle.addClass("card-header-title title is-3 is-centered");
                cardTitle.text(name)

                cardHeader.append(cardTitle);
                let cardContent = $("<div>");
                cardContent.addClass("card-content is-size-4");

                let cardImage = $("<div>");
                cardImage.addClass("card-image");

                let figure = $("<figure>");
                figure.addClass('image');
                figure.html('<img style="border-radius:5%" src = "'+ imageSouce + '">');
                cardImage.append(figure);

                let descriptions = $("<ul>");
                descriptions.addClass("content");
                
                let cuisine = $("<li>");
                cuisine.html("<b>Type</b>: " + cuisineType);

                let mealType = $("<li>");
                mealType.html("<b>Good for</b>: " + mealTypeData);

                let calorie = $("<li>");
                calorie.html(calorieData + " calories");

                let detailsLink = $("<li>");
                detailsLink.html('<a href = "https://fenriragni.github.io/food-finder/recipe-details.html?=' + recipeId + '"> Details</a>');

                descriptions.append(cuisine,mealType,calorie,detailsLink)
                cardContent.append(descriptions);
                card.append(cardImage,cardHeader, cardContent);
                cardDiv.append(card);
                }    
            cardContainer.append(cardDiv)
            };
        })
    } 

    

getSearchQuery();
loadBookmarks();
