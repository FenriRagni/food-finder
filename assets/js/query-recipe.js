var queryItem = $("#query-item");
var buttonSearch = $("#button-search");


$(function () {
    buttonSearch.on("click", searchClick, test(4));
});

function searchClick(event) {
    event.stopPropagation();
    event.preventDefault();
    showRecipeResults(queryItem.val());
};

/// Base API request to get recipe data 

function showRecipeResults(searchQuery) {
    var requestURL = "https://api.edamam.com/api/recipes/v2?type=public&q=" + searchQuery + "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.hits.length === 0) {
                $("#recipe_results").text("There is no recipe matching your query. Search another menu.")
            } else {
                for (i = 0; i < 3; i++) {
                    var recipeId = data.hits[i].recipe.uri.split("_")[1];
                    var recipeIdDocument = "#" + recipeId;
                    $("#recipe_results").append('<h3 id = "' + recipeId + '">' + data.hits[i].recipe.label + '</h3>');
                    var recipeItemUl = $(recipeIdDocument).append("<ul></ul>");
                    recipeItemUl.append("<li>" + data.hits[i].recipe.cuisineType + "</li>")
                    recipeItemUl.append("<li>" + Math.round(data.hits[i].recipe.calories) + " calories</li>")
                    recipeItemUl.append('<li><a href = /food-finder/recipe_results.html?q=' + recipeId + '> Details</a></li>')
                    $("#recipe_results").append("<img src=" + data.hits[i].recipe.images.SMALL.url + ">")
                }
            }
        })
};

// var resultColumn = $('<div>').addClass('column is-one-quarter resultDisplay');
// var resultCard = $('<div>').addClass('card');
// var cardImage = $('<div>').addClass('card-image');
// var figure = $('<figure>').addClass('image is-4by3');
// var cardContent = $('<div>').addClass('card-content');
// var mediaContent = $('<div>').addClass('media-content');
// var cardTitle = $('<h1>').addClass('title is-4');
// var cardSub = $('<h2>').addClass('subtitle is-6');
// var recipeBox = $('<ul>');


// $('columns').append(resultColumn).append(resultCard).append(cardImage).append(figure);
// resultColumn.append(cardContent).append(mediaContent).append(cardTitle, cardSub, recipeBox);



function cardGenerator() {
    var resultColumn = $('<div>').addClass('column is-one-half resultDisplay');
var resultCard = $('<div>').addClass('card');
var cardImage = $('<div>').addClass('card-image');
var figure = $('<figure>').addClass('image is-4by3');
var cardContent = $('<div>').addClass('card-content');
var mediaContent = $('<div>').addClass('media-content');
var cardTitle = $('<h1>').addClass('title is-4');
var cardSub = $('<h2>').addClass('subtitle is-6');
var recipeBox = $('<ul>');
    resultColumn.append(resultCard);
    $('.columns').append(resultColumn);
    resultCard.append(cardImage);
    cardImage.append(figure);
    resultCard.append(cardContent);
    cardContent.append(mediaContent);
    mediaContent.append(cardTitle, cardSub, recipeBox);
    recipeBox.append('<li>  this is a test  </li>');
    figure.append($('<img>').attr('src','https://via.placeholder.com/150'));
    cardTitle.text('Recipe 1');
    cardSub.text('Subtitle');
};

function test(num){
    for ( let i =0; i<num; i++){
        cardGenerator();
    }
};
// test(10);