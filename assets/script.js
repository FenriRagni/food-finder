/// Base API request to get recipe data 
var requestURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=bc252eb72b7f48ba812d2420ce79224d&q=" + "italian";
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (i = 0; i < 5; i++){
                console.log(data.results[i].id);
                console.log(data.results[i].title);
                console.log(data.results[i].image);
            }
        });