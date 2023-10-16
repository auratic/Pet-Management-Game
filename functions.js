
/*
 *
 * User Interface
 * 
 */

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

function loadProfile() {
    $.ajax({
        type: 'post',
        url: '/profile',
        /*dataType: 'json', */
        success: function (result) {
            
            if (
                typeof result !== 'object' &&
                !Array.isArray(result) &&
                result !== null
            ) {

                $("#coin").html("Gold: N/A");

            } else {
                
                alert(`Login successful! Welcome back! ${result.user}`);
                $('#username').html(`${result.user}`);
                $("#loginModal").modal("hide");
                $('#loginNav').css({'display': 'none'});
                $('#logoutNav').css({'display': 'block'});
                $('#coin').html(`Gold: ${result.coin}`);
            
            }
        },
        error: function(errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
}

function loadShop() {
    $.ajax({
        type: 'GET',
        url: '/loadShop',
        /*dataType: 'json', */
        success: function (result) {
            // alert(result[0].item_id);
            // var items = JSON.parse(result); //Turn result into object

            //List shop items
            //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_node_appendchild
            var listItem =  "<div class='row'>";
            result.forEach(item => {
                listItem +=     "   <div class='col-sm-2'>";
                listItem +=     `       ${item.item_name} <img class='shop-image' src='/Assets/Images/Shop/${item.file}'>`;
                listItem +=     "   </div>";

            })
            listItem +=     "</div>";
            $("#shoplist").append(listItem);
        },
        error: function(errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
}

function loadInv() {
    $.ajax({
        type: 'POST',
        url: '/loadInv',
        /*dataType: 'json',*/
        success: function (result) {
            
            if (
                typeof result !== 'object' &&
                !Array.isArray(result) &&
                result !== null
            ) {

                $("#inv-msg").css({'display':'block'});
                $("#inv-msg").html(result);

            } else {

                let listItem =  "<div class='row'>";
                result.forEach(item => {
                    listItem +=     "   <div class='col-sm-2'>";
                    listItem +=     `       ${item.item_name} <img class='shop-image' src='/Assets/Images/Shop/${item.file}'>`;
                    listItem +=     "   </div>";
    
                })
                listItem +=     "</div>";
                $("#invlist").append(listItem);

            }
        },
        error: function(errMsg) {
            console.log('entered error')
            $("#inv-msg").css({'display':'block'});
            $("#inv-msg").html(errMsg);

        }
    });
}

window.onload =()=> {
    screenDetect();
    loadShop();
    loadInv();
    loadProfile();
    checkLogin();
} 
    
window.onresize = screenDetect;

document.getElementById("model").onclick = () => {
    //pet audio
    //display gif
    console.log("hi");
}


/*
 *
 * Navigation
 * 
 */


$('#minigame-1').on('click',function (e) {
    window.location.href="/Minigames/minigame1.html";    
});

$('#minigame-2').on('click',function (e) {
    window.location.href="/Minigames/minigame2.html";    
});

/*
 *
 * Account
 * 
 */


//$('#myFormName').serialize()
 
$('#loginForm').on('submit',function (e) {

    onLoading();
    //console.log($(this).serialize());
    $.ajax({
        type: 'post',
        url: '/login',
        data: $(this).serialize(),
        /*
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // Set the content type
        dataType: 'json', 
        */
        success: function (result) {
            
            //alert(JSON.stringify(result));
            if (
                typeof result !== 'object' &&
                !Array.isArray(result) &&
                result !== null
            ) {
                offLoading();
                alert(result);
            } else {
                
                offLoading();
                alert(`Login successful! Welcome back! ${result.user}`);

                $('#username').html(`${result.user}`);
                $("#loginModal").modal("hide");
                $('#loginNav').css({'display': 'none'});
                $('#logoutNav').css({'display': 'block'});
                $('#coin').html(`Gold: ${result.coin}`)
                $("#inv-msg").css({'display':'none'});
                loadInv();
            }

        },
        error: function(errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
    e.preventDefault();
});


$('#registerForm').on('submit',function (e) {
    
    onLoading();
    //console.log($(this).serialize());
    $.ajax({
        type: 'post',
        url: '/register',
        data: $(this).serialize(),
        /*
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // Set the content type
        dataType: 'json', 
        */
        success: function (result) {
            
            offLoading();
            alert(`${result}`);
            if(result == 'Registration successful') {
                $("#registerModal").modal("hide");
                $("#loginModal").modal("show");
            }
            
        },
        error: function(errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
    e.preventDefault();
});


$('#logout').on('click',function (e) {
    onLoading();
    $.ajax({
        type: 'post',
        url: '/logout',
        data: $(this).serialize(),
        /*
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // Set the content type
        dataType: 'json', 
        */
        success: function (result) {
            
            offLoading();

            alert(`${result}`);
            window.location.reload(true);
            
        },
        error: function(errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
    e.preventDefault();

});


/*
 *
 * Loading screen
 * 
 */


var loading = null;
function onLoading() {
    let counter = 0;
    let loading_text = 'loading';
    $('#overlay').css({'display':'flex'});

    loading = setInterval(()=> {
        console.log(loading_text)
        if(counter > 2) {
            counter = 0;
            loading_text = 'loading';
        } else {
            counter++
            console.log('entered dot')
            loading_text += '.';
        }
        
        $('#overlay span').text(loading_text);
        console.log(counter);

    }, 1000);

}


function offLoading() {

    clearInterval(loading);
    $('#overlay').css({'display':'none'});

}