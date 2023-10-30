/*
 *
 * Item lists
 * 
 */

var items = [
    {
        item_id: 2001,
        name: 'fedora',
        cost: 2000,
        cat: 'head',
        src: 'fedora.png'
    }, {
        item_id: 2002,
        name: 'tshirt1',
        cost: 100,
        cat: 'torso',
        src: 'tshirt1.png'
    }
];


/*
 *
 * User
 * 
 */

var userProfile = {
    user_id: null,
    username: null,
    coin: null,
    inv: null,
    login: false
}

/*
 *
 * User Interface Initialization
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
        
        $('#model').css({
            'height':'auto',
            'width': "85%"})

        $('#model-head').css({
            'height':'auto',
            'width': "70%"})
            
        $('#model-torso').css({
            'height':'auto',
            'width': "70%"})
    } else {
        
        $('#model').css({
            'height':'85%',
            'width': "auto"})

        $('#model-head').css({
            'height':'70%',
            'width': "auto"})
            
        $('#model-torso').css({
            'height':'70%',
            'width': "auto"})
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
                
                //alert(`Login successful! Welcome back! ${result.user}`);
                $('#username').html(`${result.user}`);
                $("#loginModal").modal("hide");
                $('#loginNav').css({'display': 'none'});
                $('#logoutNav').css({'display': 'block'});
                $('#coin').html(`Gold: ${result.coin}`);
                
                userProfile = {
                    user_id: result.id,
                    username: result.user,
                    coin: result.coin,
                    inv: result.inv,
                    login: true
                }

                console.log(userProfile);
            }
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
                $("#invlist").empty();
                
                let listItem =  "<div class='row'>";
                result.forEach(item => {
                    listItem +=     `   <div class='col-sm-2' onclick='equipItem(${item.item_id})'>`;
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

                userProfile = {
                    user_id: result.id,
                    username: result.user,
                    coin: result.coin,
                    inv: result.inv,
                    login: true
                }
                console.log(userProfile);
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


/*
 *
 * Shop
 * 
 */

var shopItems = [];

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
            var counter = 0;
            result.forEach(item => {
                listItem +=     `   <div class='col-sm-2' onclick='buyItem(${counter})'>`;
                listItem +=     `       ${item.item_name} (${item.cost} coins)<img class='shop-image' src='/Assets/Images/Shop/${item.file}'>`;
                listItem +=     "   </div>";

                shopItems[counter] = {
                    item_id: item.item_id,
                    item_name: item.item_name,
                    item_cost: item.cost
                }
                console.log(shopItems[counter]);
                counter++;
            });
            listItem +=     "</div>";
            $("#shoplist").append(listItem);
        },
        error: function(errMsg) {
            alert(JSON.stringify(errMsg));
        }
    });
}

function buyItem(i) {
    console.log('hola amigo' + i);
    onLoading();
    if(userProfile.login) {

        if(shopItems[i].item_cost > userProfile.coin) {
            alert('Do not have enough coins !');
            offLoading();
        } else {
            $.ajax({
                type: 'post',
                url: '/buyItem',
                data: {
                    item_id: shopItems[i].item_id,
                    cost: shopItems[i].item_cost
                },
                /*
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // Set the content type
                dataType: 'json', 
                */
                success: function (result) {
                    if(result == 'Already owned this item') {
                        console.log('already owned item')
                        alert(JSON.stringify(result))
                        offLoading();
                    } else {
                        console.log('bought item')
                        $('#inv-msg').css({'display':'none'});
                        alert(JSON.stringify(result));
                        loadProfile();
                        loadInv();
                        //loadProfile();
                        offLoading();
                    }
                    
                },
                error: function(errMsg) {
                    alert(JSON.stringify(errMsg));
                    offLoading();
                }
            });
            //e.preventDefault();
        }
        
    } else {
        alert('Not logged in !');
        offLoading();
    }

}

function equipItem(i) {
    //console.log('equipItem ' + i);
    onLoading();
    if(userProfile.login) {

        offLoading();
        var index = items.findIndex(item => item.item_id === i)
        //console.log('item is ' + items[index].name);

        if (items[index].cat == 'torso') {
            if($('#model-torso').attr('src') == `Assets/Images/Shop/${items[index].src}`) {
                $("#model-torso").css({'display':'none'});
                $("#model-torso").attr("src", ``);
            } else {
                $("#model-torso").css({'display':'block'});
                $("#model-torso").attr("src", `Assets/Images/Shop/${items[index].src}`);
            }

        } else if (items[index].cat == 'head') {
            if($('#model-head').attr('src') == `Assets/Images/Shop/${items[index].src}`) {
                $("#model-head").css({'display':'none'});
                $("#model-head").attr("src", ``);
            } else {
                $("#model-head").css({'display':'block'});
                $("#model-head").attr("src", `Assets/Images/Shop/${items[index].src}`);
            }
        } 
        
    } else {
        alert('Not logged in !');
        offLoading();
    }
}