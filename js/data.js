var counter = 0,
    keyword = "item";


function getItems(numOfItems) {
    var items = [];

    for (var i = 1; i <= numOfItems; i++) {
        counter++;
        items.push(keyword + counter);
    }

    return items;
}