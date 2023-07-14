class Items {

    constructor(id, name, type, cost) {
        /*
        this.itemId = id ;
        this.itemName = name ;
        this.itemType = type ;
        this.itemCost = cost ;
        this.itemEvent = "";
        */

        this.item = [{
                itemId: function () { id },
                itemName: name,
                itemType: type,
                itemCost: cost,
                itemEvent: "",
                file: ""
            }, 
            {
                itemId: id,
                itemName: name,
                itemType: type,
                itemCost: cost,
                itemEvent: "",
                file: ""
            }
            //append array with new object
        ]
    }

    buyItem(itemId) {
        //if currency >= item cost, buy successful. else transaction fail.
    }

    /*
    removeItem(itemId) {

    }
    */

    addItem(itemId) {
        //Get owned item from player.js. If not, append new item to array. Then update database
    }

    displayInvItem() {

    }

    displayShopItem() {

    }
    
    itemEvent() {

    }

}
