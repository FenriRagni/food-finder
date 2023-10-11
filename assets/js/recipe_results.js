function getSearchQuery() {
    var queryResult = document.location.search.split("=")[1];
    if (queryResult) {
        getSearchResults(queryResult);
    } else {
        // If no result, go back to main page
        document.location.replace("./index.html");
    }
};

function getSearchResults(recipeId){
    var requestUrl = "https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_" + recipeId + "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e"
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.hits[0].recipe);
            $("h2").text(data.hits[0].recipe.label);
            $("h2").append("<img src=" + data.hits[0].recipe.images.SMALL.url + ">")
            var recipeDetails = $("h3").append("<ul></ul>");
            recipeDetails.append("<li> Calories: " + Math.round(data.hits[0].recipe.calories) + " calories</li>");
            recipeDetails.append("<li> Type: " + data.hits[0].recipe.cuisineType + "</li>");
            recipeDetails.append("<li> Diet: " + data.hits[0].recipe.healthLabels + "</li>");
            for (i = 0; i < data.hits[0].recipe.ingredientLines.length; i++) {
                var ingredients = $("h4").append("<ul></ul>");
                ingredients.append("<li>" + data.hits[0].recipe.ingredientLines[i] + "</>");
            };
            $("#recipe_link").html('<a href ="' + data.hits[0].recipe.url + '">Check out the cooking steps </a>');
            }
        );
};


getSearchQuery();
