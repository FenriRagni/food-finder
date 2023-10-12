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
        alert (
          "There is no recipe matching your query. Search another menu."
        );
      } else {
        for (i = 0; i < 4; i++) {
          var recipeId = data.hits[i].recipe.uri.split("_")[1];
          var recipeTitle = data.hits[i].recipe.label;
          var extractCuiseType=data.hits[i].recipe.cuisineType;
          crusinetype=extractCuiseType[0];
          console.log("The Recipe origin is " + crusinetype);
          var imageSouce = data.hits[i].recipe.images.SMALL.url;

            // ALL WE HAVE TO DO IS INSERT INTO THE CARDGENERATOR FUNCTION

            cardGenerator(recipeTitle, crusinetype,imageSouce);





        //   var recipeIdDocument = "#" + recipeId;
        //   $("#recipe_results").append(
        //     '<h3 id = "' + recipeId + '">' + data.hits[i].recipe.label + "</h3>"
        //   );
        //   var recipeItemUl = $(recipeIdDocument).append("<ul></ul>");
        //   recipeItemUl.append(
        //     "<li>" + data.hits[i].recipe.cuisineType + "</li>"
        //   );
        //   recipeItemUl.append(
        //     "<li>" + Math.round(data.hits[i].recipe.calories) + " calories</li>"
        //   );
        //   recipeItemUl.append(
        //     "<li><a href = /food-finder/recipe_results.html?q=" +
        //       recipeId +
        //       "> Details</a></li>"
        //   );
        //   $("#recipe_results").append(
        //     "<img src=" + data.hits[i].recipe.images.SMALL.url + ">"
        //   );
        // }


      }
    };
});

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




// THIS FUNCTION WILL GENERATE ELEMENT ON THE PAGE WE JUST NEED TO NEST THE INFO WE NEED INSIDE
// THIS FUNCTION WILL TAKE IN TITLE, CARD TEXT CONTENT AND IMAGE URL
function cardGenerator(title,subtitle, imagehtml) {
  var resultColumn = $("<div>").addClass("column is-one-half resultDisplay");
  var resultCard = $("<div>").addClass("card");
  var cardImage = $("<div>").addClass("card-image");
  var figure = $("<figure>").addClass("image is-4by3");
  var cardContent = $("<div>").addClass("card-content");
  var mediaContent = $("<div>").addClass("media-content");
  var cardTitle = $("<h1>").addClass("title is-4");
  var cardSub = $("<h2>").addClass("subtitle is-6");
  var recipeBox = $("<ul>");
  resultColumn.append(resultCard);
  $(".columns").append(resultColumn);
  resultCard.append(cardImage);
  cardImage.append(figure);
  resultCard.append(cardContent);
  cardContent.append(mediaContent);
  mediaContent.append(cardTitle, cardSub, recipeBox);
  recipeBox.append("<li>  this is a test  </li>");
  figure.append($("<img>").attr("src", imagehtml));
  cardTitle.text(title);
  cardSub.text("Cuisine type: "+subtitle);
}

}