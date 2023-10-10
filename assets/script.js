/// Base API request to get recipe data 
var requestURL = "https://api.edamam.com/api/recipes/v2?type=public&q="+ "italian" + "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (i = 0; i < 3; i++){
                var recipeId = data.hits[i].recipe.uri.split("_")[1];
                var recipeIdDocument = "#" + recipeId;
                $("#recipe_results").append('<h3 id = "'+ recipeId + '">' + data.hits[i].recipe.label + '</h3>');
                var recipeItemUl = $(recipeIdDocument).append("<ul></ul>"); 
                recipeItemUl.append("<li>" + data.hits[i].recipe.cuisineType + "</li>")
                recipeItemUl.append("<li>" + data.hits[i].recipe.calories + " calories</li>")
                recipeItemUl.append('<li><a href = "/food-finder/recipe_results.html?q=' + recipeId + '"> Details</a></li>')
                recipeItemUl.append("<img src=" + data.hits[i].recipe.images.SMALL.url + ">")
            }
        });