var queryItem = $("#query-item");
var buttonSearch = $("#button-search");
var bookmarks = [];
var bkList = $("#bookmark");

$(function () {
    buttonSearch.on("click", searchClick);
    loadBookmarks();
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
                    var recipeTitle = data.hits[i].recipe.label;         //<---- RECIPE LABEL SOURCE
                    var extractCuiseType = data.hits[i].recipe.cuisineType;
                    crusinetype = extractCuiseType[0];      //<----------------RECIPE CUISINE TYPE SOURCE
                    var imageSouce = data.hits[i].recipe.images.SMALL.url;   //<-------- RECIPE IMAGE SOURCE
                    var ingredient = data.hits[i].recipe.ingredientLines;
                    // ALL WE HAVE TO DO IS INSERT INTO THE CARD GENERATOR FUNCTION VALUES RETURNED FROM API
                    RecipecardGenerator(recipeTitle, crusinetype, imageSouce,recipeId);
                }
            };
        });




    // THIS FUNCTION WILL GENERATE ELEMENT ON THE PAGE WE JUST NEED TO NEST THE INFO WE NEED INSIDE
    // THIS FUNCTION WILL TAKE IN TITLE, CARD TEXT CONTENT AND IMAGE URL
    function RecipecardGenerator(title, subtitle, imagehtml, recipeId) {
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
        recipeBox.append("<li>  this is a test  </li>");
        recipeBox.attr("class","ingredient")
        figure.append($("<img>").attr("src", imagehtml));
        cardTitle.text(title);
        var icon = $('<i class="fa fa-bookmark-o is-pulled-right" data-id="'+ recipeId + '" data-type="recipe" data-name="' + title +'"/>')
        if(filterBookmarks(title) > 0){
            icon.data("favorite", true);
        }
        else{
            icon.data("favorite", false);
        }
        cardTitle.append(icon);
        icon.on("click", function(){
            var item = $(this);
            console.log("icon: ", item);
            if(item.data("favorite")===false) {
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
                item.children().children().removeClass("fa-bookmark-o");
                item.children().children().addClass("fa-bookmark");
                loadBookmarks();
            }
            else{
                item.data("favorite", false);
                item.children().children().removeClass("fa-bookmark");
                item.children().children().addClass("fa-bookmark-o");
                bookmarks.splice(filterBookmarks(item.parent().text().split("\n")[0]),1);
                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
                loadBookmarks();
                
            }
        })
        cardSub.text("Cuisine type: " + subtitle);
    }

}

function filterBookmarks(name){
    for(var x = 0; x < bookmarks.length; x++) {
        if(bookmarks[x].name === name){
            return x;
        }
    }
    return -1;
}

function loadBookmarks(){
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    console.log("Bookmarks: ", bookmarks);
    if(bookmarks === null || bookmarks.length === 0) {
        bookmarks = [];
        bkList.text("");
        bkList.append($('<div class="dropdown-item">No Bookmarks</div>'));
    }
    else{
        if(bkList.length <= bookmarks.length) {
            bkList.text("");
            for(var x = 0; x < bookmarks.length; x++){
                // if(bookmarks[x].type === "recipe")
                bkList.append($('<div class="dropdown-item"><a href= "recipe-details.html?q=' + bookmarks[x].id + '">'+ bookmarks[x].name + '</div>'));
                //else
            }
        }
        
    }
}