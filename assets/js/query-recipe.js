var queryItem = $("#query-item");
var queryLocation = $("#query-location");
var buttonSearch = $("#button-search");
var modalCloseButton = $("#modal-close");

$(function () {
    buttonSearch.on("click", searchClick);
    loadBookmarks();
});

function searchClick(event) {
    event.stopPropagation();
    event.preventDefault();
    if ((queryItem.val().length === 0) || (queryLocation.val().length === 0)){
        openModal();
    } else {
        $(".recipeDisplay").children().remove();
        $(".restaurantDisplay").children().remove();
        showRecipeResults(queryItem.val());
    }
}

// Close the modal when user clicks close
modalCloseButton.on("click", function() {
    $("#emptyinput").removeAttr("class");
    $("#emptyinput").attr("class","modal");
});

/// Base API request to get recipe data

function showRecipeResults(searchQuery) {
    var requestURL =
        "https://api.edamam.com/api/recipes/v2?type=public&q=" +
        searchQuery +
        "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";
    fetch(requestURL)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            for (i = 0; i < 4; i++) {
                var recipeId = data.hits[i].recipe.uri.split("_")[1];
                var recipeTitle = data.hits[i].recipe.label;         //<---- RECIPE NAME SOURCE
                var extractCuiseType = data.hits[i].recipe.cuisineType;
                crusinetype = extractCuiseType[0];      //<----------------RECIPE CUISINE TYPE SOURCE
                var imageSouce = data.hits[i].recipe.images.SMALL.url;   //<-------- RECIPE IMAGE SOURCE
                var mealTypeData = data.hits[i].recipe.mealType;
                var calorieData = Math.round(data.hits[i].recipe.calories);
                // ALL WE HAVE TO DO IS INSERT INTO THE CARD GENERATOR FUNCTION VALUES RETURNED FROM API
                RecipecardGenerator(recipeTitle, crusinetype, imageSouce,recipeId, mealTypeData, calorieData);
            }
            if (data.hits.length > 0) {
                $(".recipeDisplay").append('<div> <p class = "is-size-2 mb-3 has-text-centered"><a href = "https://fenriragni.github.io/food-finder/see-more-recipes.html?q=' + searchQuery +'">See more recipes <p></div>');
            }
        });
    }
    // THIS FUNCTION WILL GENERATE ELEMENT ON THE PAGE WE JUST NEED TO NEST THE INFO WE NEED INSIDE
    // THIS FUNCTION WILL TAKE IN TITLE, CARD TEXT CONTENT AND IMAGE URL
    function RecipecardGenerator(title, subtitle, imagehtml, recipeId, mealTypeData, calorieData) {
        var resultColumn = $("<div>").addClass("column is-12 resultDisplay");
        var resultCard = $("<div>").addClass("card");
        var cardImage = $("<div>").addClass("card-image");
        var figure = $("<figure>").addClass("image is-4by3");
        var cardContent = $("<div>").addClass("card-content");
        var mediaContent = $("<div>").addClass("media-content");
        var cardTitle = $("<h1>").addClass("title is-4");
        var cardSub = $("<h2>").addClass("subtitle is-6");
        var recipeBox = $("<ul>");
        resultColumn.append(resultCard);
        $(".recipeDisplay").append(resultColumn);
        resultCard.append(cardImage);
        cardImage.append(figure);
        resultCard.append(cardContent);
        cardContent.append(mediaContent);
        mediaContent.append(cardTitle, cardSub, recipeBox);
        recipeBox.append("<li><b>Good for</b>:" + mealTypeData + "</li>");
        recipeBox.append("<li>" + calorieData + " calories</li>");
        recipeBox.append('<li><a href="./recipe-details.html?=' + recipeId + '"> Details</a></li>');
        recipeBox.attr("class","ingredient")
        figure.append($("<img>").attr("src", imagehtml));
        cardTitle.text(title);
        let icon = createBookmark(title,recipeId, "recipe");
        cardTitle.append(icon);
        cardSub.html("<b>Cuisine type: </b>" + subtitle);
    }

function openModal(){
    document.getElementById("emptyinput").setAttribute("class", "modal is-active");
};
