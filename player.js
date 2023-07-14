class Player {

    constructor () {
        this.username = ""
        this.ownedPet = ["petid1","petid2","petid3"] //retrieve from database
        this.ownedItem = ["itemdid1","itemdid2","itemdid3"] //retrieve from database
    }
    
    getOwnedItem() {
        return this.ownedItem;
    }

    getOwnedPet() {
        return this.ownedPet;
    }

    getUsername() {
        return this.username;
    }

}