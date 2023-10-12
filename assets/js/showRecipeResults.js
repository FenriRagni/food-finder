/// Base API request to get recipe data
function showRecipeResults(searchQuery) {
    var requestURL = "https://api.edamam.com/api/recipes/v2?type=public&q=" +
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
                    var recipeTitle = data.hits[i].recipe.label; //<---- RECIPE NAME SOURCE
                    var extractCuiseType = data.hits[i].recipe.cuisineType;
                    crusinetype = extractCuiseType[0]; //<----------------RECIPE CUISINE TYPE SOURCE
                    var imageSouce = data.hits[i].recipe.images.SMALL.url; //<-------- RECIPE IMAGE SOURCE
                    var mealTypeData = data.hits[i].recipe.mealType;
                    var calorieData = Math.round(data.hits[i].recipe.calories);
                    var recipeId = data.hits[i].recipe.uri.split("_")[1];
                    // INSERT INTO THE CARD GENERATOR FUNCTION VALUES RETURNED FROM API
                    RecipecardGenerator(recipeTitle, crusinetype, imageSouce, recipeId, mealTypeData, calorieData);
                }
            };
            if (data.hits.length > 0) {
                $(".recipeDisplay").append('<div> <p class = "is-size-2 mb-3 has-text-centered"><a href = "https://fenriragni.github.io/food-finder/see-more-recipes.html?q=' + searchQuery + '">See more recipes <p></div>');
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
        mediaContent.append(cardTitle, recipeBox);
        recipeBox.append("<li><b>Type</b> :" + crusinetype + "</li>");
        recipeBox.append("<li><b>Good for</b> :" + mealTypeData + "</li>");
        recipeBox.append("<li>" + calorieData + " calories</li>");
        recipeBox.append('<a href = "https://fenriragni.github.io/food-finder/recipe-details.html?=' + recipeId + '"> Details</a>');
        recipeBox.attr("class", "ingredient");
        figure.append($("<img>").attr("src", imagehtml));
        cardTitle.text(title);
        var icon = $('<i class="fa is-pulled-right" data-id="' + recipeId + '" data-type="recipe" data-name="' + title + '"/>');
        if (filterBookmarks(recipeId) >= 0) {
            icon.data("favorite", true);
            icon.addClass("fa-bookmark");
        }
        else {
            icon.data("favorite", false);
            icon.addClass("fa-bookmark-o");
        }
        cardTitle.append(icon);
        icon.on("click", function () {
            var item = $(this);
            console.log("icon: ", item);
            if (item.data("favorite") === false) {
                item.data("favorite", true);
                console.log("favorite: ", item.data("favorite"));
                var obj = {};
                obj["name"] = item.data("name");
                obj["id"] = item.data("id");
                obj["type"] = item.data("type");
                console.log("object: ", obj);
                bookmarks.push(obj);
                console.log("bookmark array: ", bookmarks);
                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
                item.removeClass("fa-bookmark-o");
                item.addClass("fa-bookmark");
                loadBookmarks();
            }
            else {
                item.data("favorite", false);
                item.removeClass("fa-bookmark");
                item.addClass("fa-bookmark-o");
                bookmarks.splice(filterBookmarks(item.data("id")), 1);
                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
                loadBookmarks();

            }
        });
        cardSub.text("Cuisine type: " + subtitle);
    }

}
