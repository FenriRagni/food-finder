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
        if (data.hits.length === 0) {
            $("#recipe_results").text("There is no recipe matching your query. Search another menu.")
        } else {
            for (i = 0; i < 3; i++){
                console.log("data: ", data);
                var recipeId = data.hits[i].recipe.uri.split("_")[1];
                console.log("recipeID: ", recipeId);
                var recipeIdDocument = "#" + recipeId;
                $("#recipe_results").append('<h3 id = "'+ recipeId + '" data-id="'+ recipeId +'">' + data.hits[i].recipe.label + '</h3>');
                var recipeItemUl = $(recipeIdDocument).append("<ul></ul>"); 
                recipeItemUl.append("<li>" + data.hits[i].recipe.cuisineType + "</li>")
                recipeItemUl.append("<li>" + Math.round(data.hits[i].recipe.calories) + " calories</li>")
                recipeItemUl.append('<li><a href = /food-finder/recipe_results.html?q=' + recipeId + '> Details</a></li>')
                $("#recipe_results").append("<img src=" + data.hits[i].recipe.images.SMALL.url + ">")
            }
        }
    })
};    
