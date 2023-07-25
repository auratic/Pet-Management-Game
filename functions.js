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