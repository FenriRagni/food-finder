/// Base API request to get recipe data 
var requestURL = "https://api.edamam.com/api/recipes/v2?type=public&q="+ "italian" + "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (i = 0; i < 5; i++){
                console.log(data.hits[i].recipe.label);
                console.log(data.hits[i].recipe.cuisineType);
                console.log(data.hits[i].recipe.image);
            }
        });