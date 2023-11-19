/*
 *
 * Item lists
 * 
 */

const socket = io('http://localhost:3000'); //Testing purpose
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
    }, {
        item_id: 2003,
        name: 'beanie',
        cost: 100,
        cat: 'head',
        src: 'beanie.png'
    }, {
        item_id: 2004,
        name: 'wizard hat',
        cost: 100,
        cat: 'head',
        src: 'wizardHat.png'
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
    login: false,
    setting: {
        volume: 0.5,
        gameMode: 'keyboard',
        sensitivity: 0.5
    }
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


        $('#textbubble').css({
            'top': `${ ($('#model-container').height() - $('#model').height()) / 2 }`
        });
            
    } else {
        
        $('#textbubble').css({
            'top': `10`
        });
    
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

function getProfile() {
    $.ajax({
        type: 'post',
        url: '/getProfile',
        /*dataType: 'json', */
        success: function (result) {
            
            if (
                typeof result !== 'object' &&
                !Array.isArray(result) &&
                result !== null
            ) {

                $("#coin").html("0");

            } else {
                
                //alert(`Login successful! Welcome back! ${result.user}`);
                $('#username').html(`${result.user}`);
                $("#loginModal").modal("hide");
                $('#loginNav').css({'display': 'none'});
                $('#logoutNav').css({'display': 'block'});
                $('#coin').html(`${result.coin}`);
                
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

function getInv() {
    $.ajax({
        type: 'POST',
        url: '/getInv',
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
                    listItem +=     `       ${item.item_name} <img class='shop-image' src='/Assets/Images/Shop/${item.file}' style="image-rendering: pixelated;">`;
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
    getShop();
    getInv();
    getProfile();
    checkLogin();
    userSetting();
} 

// Setting

function userSetting() {

    let init = false;
    
    (function () {
        if (!init) {
            init = true;
            console.log("Function Called one time");
            console.log(userProfile.setting.volume);
            BGM.volume = userProfile.setting.volume;
        }
    })();
 

    $('#volume').on('input', function() {

        $('#vol-val').text(`(${$(this).val() * 10})`);

        userProfile.setting.volume = $(this).val() * 0.1;
        BGM.volume = $(this).val() * 0.1;

    });
    
    $('#sensitivity').on('input', function() {

        $('#sens-val').text(`(${$(this).val()})`);

    });
}

var playBGM = false;
var BGM = new Audio('Assets/Audio/Lobby-Time.mp3');
BGM.volume= 0.8;
BGM.loop= true;

window.onclick = () => {

    if(!playBGM) {
        BGM.play();
        playBGM = true;
        /*
        const BGM = document.getElementById('bgm');
        if(!BGM) return;
        const promise = BGM.play();
        if(promise !== undefined){
            promise.then(() => {
                // Autoplay started
            }).catch(error => {
                // Autoplay was prevented.
                BGM.muted = true;
                BGM.play();
            });
        }
        */
    }
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

$('#minigame-3').on('click',function (e) {
    window.location.href="/Minigames/minigame3.html";    
});

$('#minigame-4').on('click',function (e) {
    window.location.href="/Minigames/minigame4.html";    
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
                $('#coin').html(`${result.coin}`)
                $("#inv-msg").css({'display':'none'});
                getInv();

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

function getShop() {
    $.ajax({
        type: 'GET',
        url: '/getShop',
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
                listItem +=     `       ${item.item_name} (${item.cost} coins)<img class='shop-image' src='/Assets/Images/Shop/${item.file}' style='image-rendering: pixelated;'>`;
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
                        getProfile();
                        getInv();
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


//===== Pet interaction : Cuddle =====//

var cuddle = 0;
var isCuddling; // To check if player is still cuddling

$('#heart').css({
    'top': `10`,
    'height': '30%',
});

var heartParticle = document.createElement('img');
heartParticle.setAttribute('src', 'Assets/Images/heart-particle-nobg.gif');
heartParticle.setAttribute('id', 'heart-particle');
heartParticle.style.position = 'absolute';
heartParticle.style.height = '15%';
heartParticle.style.imageRendering = 'pixelated';
setInterval(() => {
    
    $('#textbubble').css({
        'display': `flex`
    });

    setTimeout(() => {

        $('#textbubble').css({
            'display': `none`
        });

    },4000);
}, 10000);


$('#game-container').on('mousemove', (e) =>{
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    console.log('mouse moving')

    $('#model').on('mousedown', () => {
        if(
            mouseX > $('#model').offset().left && 
            mouseX < $('#model').offset().left + $('#model').width() && 
            mouseY > $('#model').offset().top &&
            mouseY < $('#model').offset().top + $('#model').height()
        ) {
            clearTimeout(isCuddling);

            heartParticle.style.display = 'block';
            heartParticle.style.top = e.pageY - (heartParticle.clientHeight / 2);
            heartParticle.style.left = e.pageX - (heartParticle.clientWidth / 2);
            document.getElementById('game-container').appendChild(heartParticle);
            
            isCuddling = setTimeout(() => {
                $('#heart-particle').css({'display':'none'});
            },1000);
            
            $('#textbubble').css({
                'display': `none`
            });

            console.log(cuddle);
            if(cuddle > 5000) {
                cuddle = 0;
                userProfile.coin += 10;
                $('#coin').html(userProfile.coin);
                $('#heart').css({'display':'block'});
                setTimeout(() => {
                    $('#heart').css({'display':'none'});
                }, 3000);
            }
            cuddle++;
        } else {
            console.log('detect1')
        }
    })
})
