var bookmarks = [];
var bkList = $("#bookmark");

function createBookmark(name, id, type) {
    let icon = $('<i class="fa is-pulled-right" data-id="'+ id + '" data-type="' + type + '" data-name="' + name +'"/>')
    if(filterBookmarks(id) >= 0) {
        icon.data("favorite", true);
        icon.addClass("fa-bookmark")
    }
    else{
        icon.data("favorite", false);
        icon.addClass("fa-bookmark-o")
    }
    icon.on("click", function(){
        let item = $(this);
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
            item.removeClass("fa-bookmark-o");
            item.addClass("fa-bookmark");
            loadBookmarks();
        }
        else{
            item.data("favorite", false);
            item.removeClass("fa-bookmark");
            item.addClass("fa-bookmark-o");
            bookmarks.splice(filterBookmarks(item.data("id")),1);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            loadBookmarks();
            
        }
    })
    return icon;
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
            for(let x = 0; x < bookmarks.length; x++){
                if(bookmarks[x].type === "recipe"){
                    bkList.append($('<div class="dropdown-item"><a href= "./recipe-details.html?q=' + bookmarks[x].id + '">'+ bookmarks[x].name + '</div>'));
                }
                else{
                    bkList.append($('<div class="dropdown-item"><a href= "./restaurant-details.html?q=' + bookmarks[x].id + '">'+ bookmarks[x].name + '</div>'))
                }
            }
        }
    }
}

function filterBookmarks(itemId){
    for(var x = 0; x < bookmarks.length; x++) {
        if(bookmarks[x].id === itemId){
            return x;
        }
    }
    return -1;
}