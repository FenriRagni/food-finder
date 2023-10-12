

$(function() {
    console.log("@restaurants_results.js")
    loadFromStorage("searchResults")
})

function loadFromStorage(key) {
    var storage = JSON.parse(localStorage.getItem(key))

    if (storage) {
        console.log(storage)
    } else {
        console.log("Nothing found for", key)
    }
}