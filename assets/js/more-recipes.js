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
            for (i = 0; i < 20; i ++) {
                if (data.hits[i].recipe.length !== 0) {
                    var recipeId = data.hits[i].recipe.uri.split("_")[1];
                    if (i % 3 === 0) {
                        $("#container").append('<div class="columns is-mobile is-centered" id = "column_' + i + '"></div>');
                        var newColumnId = "#column_" + i;
                    };
                    $(newColumnId).append('<div class="column" id = "columnitem_' + i + '" ></div>');
                    var columnItemId = "#columnitem_" + i;
                    $(columnItemId).append('<div class="card-header"><div class="card-header-title title is-4 is-centered has-text-primary">' + data.hits[i].recipe.label + '</div></div>');
                    $(columnItemId).append('<div class="card-content"> <div class="media"  value = "' + recipeId + '" id = "' +  recipeId + '"></div></div>');
                    var mediaClassId = "#" + recipeId;
                    $(mediaClassId).append('<div class="media-left"><figure class="image is-48x48"><img src="' + data.hits[i].recipe.images.REGULAR.url + '"></figure></div>');
                    $(mediaClassId).append('<div class="media-content"><ul class="content has-text-primary" id = "list_' + recipeId + '"></ul></div>');
                    var recipeListId = "#list_" + recipeId;
                    $(recipeListId).append("<li>" + data.hits[i].recipe.cuisineType + "</li>");
                    $(recipeListId).append("<li>" + data.hits[i].recipe.mealType + "</li>");
                    $(recipeListId).append("<li>" + Math.round(data.hits[i].recipe.calories) + " calories</li>");
                    $(recipeListId).append("<li>" + data.hits[i].recipe.healthLabels[0] + "</li>");
                    $(recipeListId).append('<li><a href = /recipe-details.html?q=' + recipeId + '> Details</a></li>');
                };
            };
        }
    })
}; 

getSearchQuery();

