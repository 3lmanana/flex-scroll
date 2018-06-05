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

items.create(dt, 15, ".scroller");

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
        var scroller = document.querySelector(saveObj);

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
    }
};

limits.getDataLimits(".scroller-item", limits.data);
limits.getUILimits(".scroller", limits.ui, true);
//console.log(limits.data);