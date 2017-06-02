var scroller = {
    initial: true,
    initalItems: 20,

    // Container element
    container: {
        el:      null,
        height:  0,
        coords: {
            y1: 0,
            y2: 0
        }
    },

    // Scroller element
    scroller: {
        el: null,
        direction: null,
        threshold:  null,
        height: {
            current: 0,
            max:     0
        },

        position: {
            min:     0,
            current: 0,
            max:     0
        }
    },

    // Indexes for items
    index: {
        max:     0,
        current: 0
    },

    // Calculator for returning scrolling position of target element
    positionCalculator: function positionCalculator(element) {
        return $(".scroller-item[data-id='" + referenceItem.id + "']").offset().top - scroller.container.coords.y1;
    },

    // Append, reorder and remove data from items
    manage: function manage(items, scrollDirection, referenceItem) {
        var indexShift = items.length,
            newItems = getItems(indexShift);
            referenceItemOffset = scroller.positionCalculator(referenceItem);

            console.log(items);

        if (scrollDirection == "up") {

            for (var i = 0; i < items.length; i++) {

                $(".scroller-item[data-id='" + items[i].id + "']").attr({
                    "data-id": newItems[i],
                    "data-index": i + 1,
                    "data-new": "true"
                }).css({
                    "-webkit-box-ordinal-group": i + 2,
                    "-webkit-order": i + 1,
                    "-moz-order": i + 1,
                    "-ms-flex-order": i + 1,
                    "order": i + 1
                }).html(newItems[i]);
            }

            // Reorder
            $(".scroller-item").each(function (index) {
                var itemIndex = parseInt($(this).attr("data-index")),
                    propNew = $(this).attr("data-new");

                if (typeof propNew !== typeof undefined && propNew !== false) {
                    $(this).removeAttr("data-new");
                } else {
                    itemIndex += indexShift;
                    $(this).attr("data-index", itemIndex);
                    $(this).css({
                        "-webkit-box-ordinal-group": itemIndex + 1,
                        "-webkit-order": itemIndex,
                        "-moz-order": itemIndex,
                        "-ms-flex-order": itemIndex,
                        "order": itemIndex
                    });
                }
            });
        } else {
            var numOfAllItems = $(".scroller-item").length;
            newItems.reverse();
            items.reverse();

            for (var i = 0; i < items.length; i++) {
                // Assign new items
                var itemIndex = numOfAllItems - i;

                $(".scroller-item[data-id='" + items[i].id + "']").attr({
                    "data-id": newItems[i],
                    "data-index": itemIndex,
                    "data-new": "true"
                }).css({
                    "-webkit-box-ordinal-group": itemIndex + 1,
                    "-webkit-order": itemIndex,
                    "-moz-order": itemIndex,
                    "-ms-flex-order": itemIndex,
                    "order": itemIndex
                }).html(newItems[i]);
            }

            // Reorder
            $(".scroller-item").each(function (index) {
                var itemIndex = parseInt($(this).attr("data-index")),
                    propNew = $(this).attr("data-new");

                if (typeof propNew !== typeof undefined && propNew !== false) {
                    $(this).removeAttr("data-new");
                } else {

                    itemIndex -= indexShift

                    //itemIndex -= indexShift;
                    $(this).attr("data-index", itemIndex).css({
                        "-webkit-box-ordinal-group": itemIndex + 1,
                        "-webkit-order": itemIndex,
                        "-moz-order": itemIndex,
                        "-ms-flex-order": itemIndex,
                        "order": itemIndex
                    });
                }
            });
        }

        // Center scrollbar
        // Scrolled item
        //var topOffset = $(".scroller-item[data-id='" + referenceItem.id + "']").position().top;

        //$(scroller.container.el).scrollTop(topOffset + referenceItemOffset);

        //console.log($(".scroller-item[data-id='" + referenceItem.id + "']").position().top, topOffset);

        scroller.scroller.height.current = $(scroller.scroller.el).height();
        scroller.scroller.threshold = scroller.scroller.height.max / 4;
    },

    // Check if there's need for getting data
    check: function check(thresholdBoolean, scrollDirection) {
        var items = [];
            referenceItem = null;

        if (thresholdBoolean) {

            $(scroller.container.el).off("scroll");

            $(".scroller-item").each(function (index) {
                var item = {
                    index: parseInt($(this).attr("data-index")),
                    id:    $(this).attr("data-id")
                };

                // Up direction
                if (scrollDirection == "up") {
                    if ($(this).offset().top > scroller.container.coords.y2) {
                        items.push(item);
                    } else if ($(this).offset().top > scroller.container.coords.y1 && $(this).offset().top < scroller.container.coords.y2) {
                        if (referenceItem == null) {
                            referenceItem = item;
                        }
                    }
                } else {
                    // Down direction
                    if ($(this).offset().top <= scroller.container.coords.y1) {
                        items.push(item);
                    } else if ($(this).offset().top > scroller.container.coords.y1 && $(this).offset().top < scroller.container.coords.y2) {
                        if (referenceItem == null) {
                            referenceItem = item;
                        }
                    }
                }
            });

            // Filter and Sort result items
            var spliceLimit = Math.round(items.length / 2) - 1;
            
            items = items.sort(function (a, b) {
                return a.id - b.id;
            });

            items.reverse();
            items.splice(0, spliceLimit);

            scroller.manage(items, scrollDirection, referenceItem);

            setTimeout(function () {
                $(scroller.container.el).on("scroll", $.debounce(100, scroller.scroll));
            }, 300);

            //$(scroller.container.el).on("scroll", $.debounce(100, scroller.scroll));
        }
    },

    initLoad: function initLoad() {
        var data = getItems(scroller.initalItems);

        for (var i = 0; i < data.length; i++) {
            var item = '<div class="scroller-item" data-index="' + (i + 1) + '" data-id="' + data[i] + '">' + data[i] + '</div>';
            $(scroller.scroller.el).append(item);
        }

        scroller.scroller.height.current = $(scroller.scroller.el).height();
        scroller.scroller.threshold = scroller.scroller.height.max / 4;
    },

    scroll: function scroll() {
        var quarterScroll = false;

        if ($(scroller.container.el).scrollTop() > scroller.scroller.position.current) {
            scroller.scroller.direction = "down";

            if ($(scroller.container.el).scrollTop() >= (scroller.scroller.height.current * 0.5)) {
                quarterScroll = true;
                scroller.initial = false;
            }

        } else {
            scroller.scroller.direction = "up";

            if (!scroller.initial && ($(scroller.container.el).scrollTop() <= (scroller.scroller.height.current * 0.25))) {
                quarterScroll = true;
            }
        }

        scroller.scroller.position.current = $(scroller.container.el).scrollTop();
        scroller.check(quarterScroll, scroller.scroller.direction);
    },

    // Initialization
    init: function init(el) {
        // Container
        scroller.container.el = $(el);
        scroller.container.height = $(scroller.container.el).outerHeight();
        scroller.container.coords.y1 = $(scroller.container.el).offset().top;
        scroller.container.coords.y2 = scroller.container.coords.y1 + scroller.container.height;

        // Scroller
        scroller.scroller.el = $(scroller.container.el).find(".scroller");
        //scroller.scroller.height.max = scroller.container.height * 2;
        
        // initLoad
        scroller.initLoad();

        // Scroll event with Debounce.js
        //$(scroller.container.el).on("scroll", scroller.scroll);
        //$(scroller.container.el).scroll($.debounce(250, true, scroller.scroll));
        $(scroller.container.el).on("scroll", $.debounce(100, scroller.scroll)); // On scroll end
    }
};



$(window).on("load", function () {
    scroller.init(".scroller-wrapper");
});