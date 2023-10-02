function screenDetect () {
    /*
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        document.getElementById("game-container").style.height = "100%";
        document.getElementById("game-container").style.width = "100%";
        console.log("mobile device");
    } else {
        document.getElementById("game-container").style.height = "100vmin";
        document.getElementById("game-container").style.width = "100vmin";
        console.log("not mobile device");
    }
    */
    //Model adjust

    if (window.innerHeight > window.innerWidth) {
        document.getElementById("model").style.height = "auto";
        document.getElementById("model").style.width = "85%";
    } else {
        document.getElementById("model").style.height = "85%";
        document.getElementById("model").style.width = "auto";
    }
}

function checkLogin() {
    
}

function loadShop() {
    $.ajax({
        type: 'post',
        //url: 'db.js',
        data: {
            message: "helo",
            action: "loadshop"
            /*$('#myFormName').serialize()*/
        },
        success: function (result) {
            alert(result);
            var items = JSON.parse(result); //Turn result into object
            //console.log(result);
            //console.log(JSON.parse(result));
            //console.log(result.length);

            //List shop items
            //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_node_appendchild
            var shoplist = document.getElementById("shoplist");
            //if(items < 3)
            // var row_i = result.length ;
            // var item_i = items.length
            
            var listItem =  "<div class='row'>";
            for (let i = 0 ; i < items.length ; i++ ) {
                listItem +=     "   <div class='col-sm-2'>";
                listItem +=     `       ${items[i].item_name} <img class='shop-image' src='/Assets/Images/Shop/${items[i].file}'>`;
                listItem +=     "   </div>";
            }
            listItem +=     "</div>";
        

            $("#shoplist").append(listItem);

            //var row_node = document.createElement("div");
            //var row_node = 
            //for()

        },
        error: function(errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
}

window.onload =()=> {
    screenDetect();
    loadShop();
    checkLogin();
} 
    
window.onresize = screenDetect;

document.getElementById("model").onclick = () => {
    //pet audio
    //display gif
    console.log("hi");
}

$('#minigame-1').on('click',function (e) {
    window.location.href="/Minigames/minigame1.html";    
});

$('#minigame-2').on('click',function (e) {
    window.location.href="/Minigames/minigame2.html";    
});