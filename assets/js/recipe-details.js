var queryResult;
function getSearchQuery() {
    queryResult = document.location.search.split("=")[1];
    if (queryResult) {
        getSearchResults(queryResult);
    } else {
        // If no result, go back to main page
        document.location.replace("./index.html");
    }
};
function getSearchResults(recipeId){
    var requestUrl = "https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_" + recipeId + "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";
    var temptData;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            temptData=data;

            var label = temptData.hits[0].recipe.label;
            var imageUrl = temptData.hits[0].recipe.images.SMALL.url;
            var calories = Math.round(temptData.hits[0].recipe.calories);
            var cuisine = temptData.hits[0].recipe.cuisineType;
            var health = temptData.hits[0].recipe.healthLabels;
            var ingredient = temptData.hits[0].recipe.ingredientLines;
            var recipeLIink = temptData.hits[0].recipe.url;
            dataForRecipe(label, imageUrl, cuisine, health, calories, recipeLIink);
            for( i=0; i<ingredient.length;i++){
                $('#shortDescription').append('<p>' + ingredient[i] + '</p>');
            }
            }
        );
};

function dataForRecipe(label, imageUrl, cuisine, health, calories, recipeLIink){
    var title = $('#title');
    title.children().text(label);

    let icon = createBookmark(label, queryResult, "recipe");
    icon.addClass("details-icon");
    title.append(icon);

    var image = $('#image');
    image.attr('src',imageUrl);

    var name = $('#name');
    name.text(label);

    var shortDescription = $('#shortDescription');
    shortDescription.append("<p>" + cuisine +"</p>");
    shortDescription.append("<p>"+ " Total "+ calories + " Calories."+"</p>");

    var longDescription=$('#longDescription');
    longDescription.append("<p>" + health +"</p>");

    var link = $("#link");
    link.html('<a href ="' + recipeLIink + '">See more details about this recipe</a>')
};

loadBookmarks();
getSearchQuery();