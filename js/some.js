var itemsForScroll = 15;

/*
    Items
------------------------------------ */
var items = {
    // Create items from data object
    create: function create(data, numberOfItems, target) {
        let parent = document.createElement("div");

        for (let i = 0; i < numberOfItems; i++) {
            let item    = document.createElement("div"),
                value   = document.createTextNode(data[i]);

            item.classList.add("scroller-item");
            item.setAttribute("data-index", i + 1);
            item.setAttribute("data-id", data[i]);
            item.appendChild(value);

            parent.appendChild(item);

            if (i == (data.length - 1)) {
                break;
            }
        }

        document.querySelector(target).innerHTML = parent.innerHTML;
    }

    // Remove items

    // Add items

    // Reorder (by using data-source)
};

items.create(dt, itemsForScroll, ".scroller");

/*
    Limits
------------------------------------ */
var limits = {

    // Actual data used in scroller
    data: {
        y1: 0,
        y2: 0
    },

    getDataLimits: function getDataLimits(target, saveObj) {
        var nodes = document.querySelectorAll(target);

        saveObj.y1 = nodes[0];
        saveObj.y2 = nodes[nodes.length - 1];
    },

    ui: {
        y1: null,
        y2: 0

        // Later for horizontal scroll to introduce "x1" and "x2"
    },

    getUILimits: function getUILimits(target, saveObj, initialBoolean = false) {
        var scroller = document.querySelector(target);

        var props = {
            height:     0,
            position:   0,

            limits: {
                top:    0,
                center: 0,
                bottom: 0
            }
        }

        props.height    = scroller.offsetHeight;
        props.position  = scroller.getBounding;

        console.log(props.height);
    }
};

limits.getDataLimits(".scroller-item", limits.data);
limits.getUILimits(".scroller", limits.ui, true);

/*
    Scroll
------------------------------------ */
var scroll = {
    direction:  "down", // or "up"
    position:   0,
    
    item: {
        id:         null,
        position:   0
    },

    calculateScrolling: function calculateScrolling(scrollingPosition, element) {
        // Find which item is closest to center and remember its position and data
        var items   = element.querySelectorAll(".scroller-item"),
            center  = element.getBoundingClientRect().top + (element.offsetHeight / 2);

        var centerItem = { id: null, delta: center };

        for (let i = 0; i < items.length; i++) {
            let item        = items[i],
                itemCenter  = item.getBoundingClientRect().top + (item.offsetHeight / 2),
                delta       = Math.abs(center - itemCenter);

            if (delta < centerItem.delta) {
                centerItem.delta    = delta;
                centerItem.id       = item.getAttribute("data-id");
            }
        }

        console.log(centerItem.id);
    }
};

function scrolling(e) {

    var scrollPos       = this.scrollTop,
        contentHeight   = this.querySelector(".scroller").offsetHeight,
        limit           = contentHeight * 0.25;

    // See which direction scrolling goes
    if (scrollPos > scroll.position) {
        scroll.direction = "down";
    } else {
        scroll.direction = "up";
    }

    // Make conditions for varions directions
    if (scroll.direction === "down" && scrollPos > limit) {
        scroll.calculateScrolling(scrollPos, this);
    } else if (scroll.direction === "up" && scrollPos < limit) {
        scroll.calculateScrolling(scrollPos, this);
    }

    scroll.position = scrollPos;
}

document.querySelector(".scroller-wrapper").addEventListener("scroll", scrolling);