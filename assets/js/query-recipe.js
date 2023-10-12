var queryItem = $("#query-item");
var buttonSearch = $("#button-search");

$(function () {
    buttonSearch.on("click", searchClick);
});

function searchClick(event) {
    event.stopPropagation();
    event.preventDefault();
    showRecipeResults(queryItem.val());
}

/// Base API request to get recipe data

function showRecipeResults(searchQuery) {
    var requestURL =
        "https://api.edamam.com/api/recipes/v2?type=public&q=" +
        searchQuery +
        "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if (data.hits.length === 0) {
                alert(
                    "There is no recipe matching your query. Search another menu."
                );
            } else {
                $("#recipe_results").children().remove();
                for (i = 0; i < 4; i++) {
                    var recipeId = data.hits[i].recipe.uri.split("_")[1];
                    var recipeTitle = data.hits[i].recipe.label;         //<---- RECIPE NAME SOURCE
                    var extractCuiseType = data.hits[i].recipe.cuisineType;
                    crusinetype = extractCuiseType[0];      //<----------------RECIPE CUISINE TYPE SOURCE
                    var imageSouce = data.hits[i].recipe.images.SMALL.url;   //<-------- RECIPE IMAGE SOURCE
                    var mealTypeData = data.hits[i].recipe.mealType;
                    var calorieData = Math.round(data.hits[i].recipe.calories);
                    var recipeId = data.hits[i].recipe.uri.split("_")[1];
                    // INSERT INTO THE CARD GENERATOR FUNCTION VALUES RETURNED FROM API
                    RecipecardGenerator(recipeTitle, crusinetype, imageSouce, recipeId, mealTypeData, calorieData);
                }
            };
            if (data.hits.length > 0) {
                $(".recipeDisplay").append('<div> <p class = "is-size-2 mb-3 has-text-centered"><a href = "https://fenriragni.github.io/food-finder/see-more-recipes.html?q=' + searchQuery +'">See more recipes <p></div>');
            }
        });

    // THIS FUNCTION WILL GENERATE ELEMENT ON THE PAGE WE JUST NEED TO NEST THE INFO WE NEED INSIDE
    // THIS FUNCTION WILL TAKE IN TITLE, CARD TEXT CONTENT AND IMAGE URL
    function RecipecardGenerator(title, crusinetype, imagehtml, recipeId, mealTypeData, calorieData) {
        var resultColumn = $("<div>").addClass("column is-12 resultDisplay");
        var resultCard = $("<div>").addClass("card");
        var cardImage = $("<div>").addClass("card-image");
        var figure = $("<figure>").addClass("image is-4by3");
        var cardContent = $("<div>").addClass("card-content");
        var mediaContent = $("<div>").addClass("media-content");
        var cardTitle = $("<h1>").addClass("title is-4");
        var recipeBox = $("<ul>");
        resultColumn.append(resultCard);
        $(".recipeDisplay").append(resultColumn);
        resultCard.append(cardImage);
        cardImage.append(figure);
        resultCard.append(cardContent);
        cardContent.append(mediaContent);
        mediaContent.append(cardTitle,recipeBox);
        recipeBox.append("<li><b>Type</b> :" + crusinetype + "</li>");
        recipeBox.append("<li><b>Good for</b> :" + mealTypeData + "</li>");
        recipeBox.append("<li>" +  calorieData + " calories</li>");
        recipeBox.append('<a href = "https://fenriragni.github.io/food-finder/recipe-details.html?=' + recipeId + '"> Details</a>');
        recipeBox.attr("class","ingredient")
        figure.append($("<img>").attr("src", imagehtml));
        cardTitle.text(title);
    }

}