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
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    if(	window.screen.height >= 4096 || window.screen.width >= 4096 ) {
        (window.innerHeight > window.innerWidth) ? $("a").css({"font-size": "2em"}) : $("a").css({"font-size": "1em"});
        $("h1").css({"font-size": "7em"});
        $("h2").css({"font-size": "1em"});
        $(".menu-item").css({ "font-size": "3em", "width": "5em", "height": "5em"});
        $(".modal-body").css({ "font-size": "4em"});
    }
    if(	window.screen.height >= 2560 || window.screen.width >= 2560 ) {
        (window.innerHeight > window.innerWidth) ? $("a").css({"font-size": "2em"}) : $("a").css({"font-size": "1em"});
        $("h1").css({"font-size": "7em"});
        $("h2").css({"font-size": "1em"});
        $(".menu-item").css({ "font-size": "3em", "width": "5em", "height": "5em"});
        $(".modal-body").css({ "font-size": "4.5em"});
    } else if(	window.screen.height >= 1920 || window.screen.width >= 1920 ) {
        $("a").css({"font-size": "1em"})
        $("h1").css({"font-size": "2em"})
        $("h2").css({"font-size": "1em"})
        $(".menu-item").css({ "font-size": "2em", "width": "4em", "height": "4em"});
        $(".modal-body").css({ "font-size": "2em"});
    } else if(	window.screen.height >= 1280 || window.screen.width >= 1280 ) {
        $("a").css({"font-size": "1em"})
        $("h1").css({"font-size": "2em"})
        $("h2").css({"font-size": "1em"})
        $(".menu-item").css({ "font-size": "2em", "width": "4em", "height": "4em"});
        $(".modal-body").css({ "font-size": "2em"});
    } else if(	window.screen.height >= 1024 || window.screen.width >= 1024 ) {
        $("a").css({"font-size": "1em"})
        $("h1").css({"font-size": "2em"})
        $("h2").css({"font-size": "1em"})        
        $(".menu-item").css({ "font-size": "2.5em", "width": "3em", "height": "3em"});
    } else {
        $("a").css({"font-size": "2em"});
        $("h1").css({"font-size": "2em"});
        $("h2").css({"font-size": "2em"});  
        // (window.innerHeight > window.innerWidth) ? $("a").css({"font-size": "2em"}) : $("a").css({"font-size": "1em"});
        // (window.innerHeight > window.innerWidth) ? $(".menu-item").css({"left": "40%"}) : $(".menu-item").css({"left": "45%"});
        $(".menu-item").css({ "font-size": "1.8em", "width": "3em", "height": "3em"});
        $(".modal-body").css({ "font-size": "2em"});
    }

    if (window.innerHeight > window.innerWidth) {
        $("#heart").css({ 'top': window.innerHeight / 8, 'height': '30%' })
        
        $("#game-container").css({ 'width': "100%" })

        $('#model').css({ 'height':'100vw', 'width': "100vw"})

        $('#model-head').css({ 'height':'auto', 'width': "100%"})
            
        $('#model-torso').css({ 'height':'auto', 'width': "100%"})

        $('#model-dirt1').css({ 'height':'auto', 'width': "100%"})
        $('#model-dirt2').css({ 'height':'auto', 'width': "100%"})

        $('#textbubble').css({ 'top': `${ ($('#model-container').height() - $('#model').height()) / 2 }` });
            
        $('.offcanvas').css({ 'width': '100%' });

    } else {
        $('#heart').css({ 'top': `10`, 'height': '30%', });

        $("#game-container").css({ 'width': "100vh" })

        $('#textbubble').css({ 'top': `10` });
    
        $('#model').css({ 'height':'85%', 'width': "auto"})

        $('#model-head').css({ 'height':'70%', 'width': "auto"})
            
        $('#model-torso').css({ 'height':'70%', 'width': "auto"})

        $('#model-dirt1').css({ 'height':'70%', 'width': "auto"})
        $('#model-dirt2').css({ 'height':'70%', 'width': "auto"})

        $('.offcanvas').css({ 'width': '30%' });
    
    }
}

function changeName() {
    $("#pet-name").css({"display":"none"});
    $("#change-name").css({"display":"none"});
    $("#new-name").css({"display":"block"});
    $("#confirm-name").css({"display":"block"});
}

function confirmName() {

    let newName = $("#new-name").val();

    if(!newName || newName == "") {
        alert("Enter a name !")
    } else if(newName.length > 50) {
        alert("Name is too long ! 50 characters max")
    } else {
        $.ajax({
            url: "/setPet",
            method: "POST",  
            data: {
                action: "setName", 
                newName: newName
            },
            cache: false,
            /* dataType: 'json', */
            success: function(data){
            
                alert(data);
                $("#pet-status").html(`${newName}`);
                $("#pet-status").css({"display":"block"});
                $("#change-name").css({"display":"block"});
                $("#new-name").css({"display":"none"});
                $("#confirm-name").css({"display":"none"});
                getPet();
        
            },
            error: function(errMsg) {
                alert(JSON.stringify(errMsg));
            }
        });
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
                $("#petInstruction").css({ "display": "none"});
                
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

function getPet() {
    
    $.ajax({
        type: 'POST',
        url: '/getPet',
        /*dataType: 'json',*/
        success: function (result) {
            
            if (
                typeof result !== 'object' &&
                !Array.isArray(result) &&
                result !== null
            ) {

                console.log("Cannot get pet");
                $("#petStatus").empty();
                $("#petStatus").append(`
                    <span><span style="color:green">Log in</span> to interact with your pet !<span><br>
                    <hr >
                    <span>Click the button at top right of your screen<span>`);

                    $('.menu-item:not(#item0, #item5)').prop('disabled', true);
                    $('.menu-item:not(#item0, #item5)').css({ "background": `url("Assets/Images/UI/png/lock_gray.png") no-repeat` });


            } else {
                // console.log(result);
                $("#pet-title").css({"display":"none"});
                $("#pet-name").css({"display":"block"});
                $("#change-name").css({"display":"block"});

                $(".pet-name").html(`${result.pet_name}`);
                $('.menu-item').prop('disabled', false);
                $('.menu-item').css({ "background": `url("Assets/Images/UI/png/empty_red.png") no-repeat` });
                $('#item4').prop('disabled', true);
                $('#item4').css({ "background": `url("Assets/Images/UI/png/lock_gray.png") no-repeat` });

                if(result.growth >= 80) $("#model").attr('src','Assets/Images/Models/cat-adult.gif')

                $("#petStatus").empty();
                // $("#petStatus").append(`
                //     <span>Growth: ${result.growth}%</span><br>
                //     <span>Happiness: ${result.happiness}%</span><br>
                //     <span>Clean: ${result.clean}%</span><br>
                //     <span>Hunger: ${result.hunger}%</span><br>
                //     <span>Trim: ${result.nail}%</span><br>
                //     <span>Groom: ${result.hair}%</span>
                // `);
                $("#petStatus").append(`
                        <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#growthCollapse" aria-expanded="false" aria-controls="growthCollapse">
                                    Growth: ${result.growth}%
                                </button>
                            </h2>
                            <div id="growthCollapse" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <span style="color:green">Feeding</span> increases growth, <br>
                                    Pet grows faster if <span style="color:green">happiness is high</span>, <br>
                                    happiness more than 50%, pet grows by 15% every feed, <br>
                                    happiness more than 80%, pet grows by 20% every feed, <br>
                                    otherwise pets will just grow by 10% every feed
                                </div>
                            </div>
                        </div>
                        
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#happinessCollapse" aria-expanded="false" aria-controls="happinessCollapse">
                                    Happiness: ${result.happiness}%
                                </button>
                            </h2>
                            <div id="happinessCollapse" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body"> 
                                    <span style="color:green">Happiness</span> can affect growth <br>
                                    Player can increase happiness by bathing, feeding, cuddling, trimming and playing with pet<br>
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cleanCollapse" aria-expanded="false" aria-controls="cleanCollapse">
                                    Cleanliness: ${result.clean}%
                                </button>
                            </h2>
                            <div id="cleanCollapse" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    Your pet will look dirty when cleanliness below 60<br>
                                    <span style="color:green">Bathing</span> increases cleanliness to 100% <br>
                                </div>
                            </div>
                        </div>
                        <!--
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#hungerCollapse" aria-expanded="false" aria-controls="hungerCollapse">
                                    Hunger: ${result.hunger}%
                                </button>
                            </h2>
                            <div id="hungerCollapse" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <span style="color:green">Feeding</span> increases hunger to 100% <br>
                                    Also increase happiness by 50% and growth <br>
                                </div>
                            </div>
                        </div>
                        
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#nailCollapse" aria-expanded="false" aria-controls="nailCollapse">
                                    Nail: ${result.nail}%
                                </button>
                            </h2>
                            <div id="nailCollapse" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    Nail is long ! <br>
                                    <span style="color:green">Trimming</span> increases nail to 100% <br>
                                    Also increase happiness by 50% <br>
                                </div>
                            </div>
                        </div>
                        -->
                        </div>

                `);
                $("#petStatus").children().css({ "color": "gray" });
                $("#growthStatus :eq(1)").html(`${result.growth}%`);
                $("#cleanStatus :eq(1)").html(`${result.clean}%`);
                $("#cuddleStatus :eq(1)").html(`${result.happiness}%`);
                $("#trimStatus :eq(1)").html(`${result.happiness}%`);


                if(result.clean < 30) {
                    $("#model-dirt1").css({"display":"block"});
                } else if (result.clean < 60) {
                    $("#model-dirt2").css({"display":"block"});
                }
                // new bootstrap.Popover(document.getElementById('pet-status'), {
                //     container: 'body',
                //     html: true,
                //     placement: 'bottom',
                //     title: `${result.pet_name}`,
                //     content: `
                //         <span>Growth: ${result.growth}%</span><br>
                //         <span>Happiness: ${result.happiness}%</span><br>
                //         <span>Clean: ${result.clean}%</span><br>
                //         <span>Hunger: ${result.hunger}%</span><br>
                //         <span>Trim: ${result.nail}%</span><br>
                //         <span>Groom: ${result.hair}%</span>
                //         `
                //   });

            }
        },
        error: function(errMsg) {
            console.log('entered error')
            alert(errMsg);

        }
    });
}

window.onload =()=> {
    
    screenDetect();
    getShop();
    getInv();
    getPet();
    getProfile();
    checkLogin();
    userSetting();
} 

/*
 *
 * Tutorial
 * 
 */

var tutorialCounter = 0;
function tutorial() {

    let coin = document.getElementById("coin").getBoundingClientRect();
    let petTitle = document.getElementById("pet-title").getBoundingClientRect();
    let navBar = document.getElementById("navbarToggler").getBoundingClientRect();
    let inv = document.getElementById("inv-button").getBoundingClientRect();
    let shop = document.getElementById("shop-button").getBoundingClientRect();
    let help = document.getElementById("help-button").getBoundingClientRect();
    let minigame = document.getElementById("minigame-open").getBoundingClientRect();
    let pet = document.getElementById("model").getBoundingClientRect();
    let footer = document.getElementById("footer-container").getBoundingClientRect();

    let footerPos
    let fontSize

    $("#tutorialtips").removeAttr('style');

        if(	window.screen.height >= 2560 || window.screen.width >= 2560 ) {
            fontSize = "7em";
        } else if(	window.screen.height >= 1920 || window.screen.width >= 1920 ) {
            fontSize = "2em"
        } else if(	window.screen.height >= 1280 || window.screen.width >= 1280 ) {
            fontSize = "2em"
        } else if(	window.screen.height >= 1024 || window.screen.width >= 1024 ) {
            fontSize = "2em"
        } else {
            fontSize = "1.2em"
        }
    $("#tutorialtips").css({
        "position": "absolute",
        "border": "1px solid black",
        "border-radius": "10px",
        "padding": "10px",
        "font-size": fontSize
    });
    switch (tutorialCounter) {
        case 0:
            $("#tutorialtips").css({
                "top":`${coin.top}`,
                "left":`${coin.left}`,
            });
            $("#tutorialtips").html("This is your coins");
            tutorialCounter++;
        break;
        case 1:
            $("#tutorialtips").css({
                "top":`${petTitle.top}`,
                "left":`${petTitle.left}`,
                "margin-right": "30%"
            });
            $("#tutorialtips").html(`This is your pet's name, 
                                you can <span style="color:green">change name</span> and view <span style="color:green">pet's status</span> here after login`);
            tutorialCounter++;
        break;
        case 2:
            $("#tutorialtips").css({
                "top":`${navBar.top}`,
                "right":`${(window.innerHeight > window.innerWidth) ? 0 : ""}`,
                "left":`${(window.innerHeight > window.innerWidth) ? "" : navBar.left}`,
            });
            $("#tutorialtips").html(`Login & Setting here`);
            tutorialCounter++;
        break;
        case 3:
            $("#tutorialtips").css({
                "top":`${footer.top - (inv.width*2)}`,
                "left":`${inv.left}`,
            });
            $("#tutorialtips").html(`Inventory !`);
            tutorialCounter++;
        break;
        case 4:
            $("#tutorialtips").css({
                "top":`${footer.top - shop.height}`,
                "left":`${shop.left}`,
            });
            $("#tutorialtips").html(`Shop !`);
            tutorialCounter++;
        break;
        case 5:
            $("#tutorialtips").css({
                "top":`${footer.top - help.height}`,
                "left":`${help.left}`,
            });
            $("#tutorialtips").html(`Help button !`);
            tutorialCounter++;
        break;
        case 6:
            $("#tutorialtips").css({
                "top":`${footer.top - minigame.height}`,
                "right":`${(window.innerHeight > window.innerWidth) ? 0 : ""}`,
                "left":`${(window.innerHeight > window.innerWidth) ? "" : minigame.left}`,
            });
            $("#tutorialtips").html(`Minigame here!`);
            tutorialCounter++;
        break;
        case 7:
            $("#tutorialtips").css({
                "top":`${pet.top}`,
                "left":`${pet.left}`,
            });
            $("#tutorialtips").html(`Click to interact with pet!`);
            tutorialCounter ++;
        break;
        case 8:
            $("#tutorialtips").css({
                "top":`${pet.top}`,
                "left":`${pet.left}`,
            });
            $("#tutorialtips").html(`Press ESC to exit tutorial !`);
            tutorialCounter ++;
        break;
        default:
            $('.modal').modal('hide');
            tutorialCounter = 0;
    }
}

$("#tutorialModal .modal-content").on("click", tutorial)

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

var click = new Audio('Assets/Audio/click-sound.mp3');
click.volume= 0.8;

window.onclick = () => {
    click.play();

    if(!playBGM) {
        BGM.play();
        playBGM = true;
    }
}

    
window.onresize = screenDetect;

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

$(document).on('keydown', function (e) {
    if (e.key === "Escape") {
      // Close all open modals
      $('.modal').modal('hide');
      tutorialCounter = 0;
    }
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

                $('#username').html(`User: ${result.user}`);
                $("#loginModal").modal("hide");
                $('#loginNav').css({'display': 'none'});
                $('#logoutNav').css({'display': 'block'});
                $('#coin').html(`${result.coin}`)
                $("#inv-msg").css({'display':'none'});
                getInv();
                getPet();

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
var isCuddling; // To make heart particle disappear using setInterval
var isCuddle = false; // To check if player is cuddling

var heartParticle = document.createElement('img');
heartParticle.setAttribute('src', 'Assets/Images/heart-particle-nobg.gif');
heartParticle.setAttribute('id', 'heart-particle');
heartParticle.style.position = 'absolute';
heartParticle.style.height = '15%';
heartParticle.style.imageRendering = 'pixelated';
heartParticle.style.pointerEvents = 'none';

$("#cuddle").on("click", () => {
    isCuddle = true;
    let overlay = document.getElementById('menu-overlay');
    $("#petInstruction").css({ "display": "flex"});

    overlay.style.opacity = (overlay.style.opacity === "1") ? "0" : "1";
    overlay.style.pointerEvents = (overlay.style.pointerEvents === "visible") ? "none" : "visible";
    overlay.classList.toggle('menu-open');
    $('.modal').modal('hide');

});

function toggleMenu(e) {
    $("#petInstruction").css({ "display": "none"});
    if(!isCuddle) {
        let overlay = document.getElementById('menu-overlay');
    
        overlay.style.opacity = (overlay.style.opacity === "1") ? "0" : "1";
        overlay.style.pointerEvents = (overlay.style.pointerEvents === "visible") ? "none" : "visible";
        overlay.classList.toggle('menu-open');
    } else {
        
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        // isCuddle = true;
    
        clearTimeout(isCuddling);
    
        heartParticle.style.display = 'block';
        heartParticle.style.top = e.pageY - (heartParticle.clientHeight / 2);
        heartParticle.style.left = e.pageX - (heartParticle.clientWidth / 2);
        document.getElementById('game-container').appendChild(heartParticle);
        
        isCuddling = setTimeout(() => {
            $('#heart-particle').css({'display':'none'});
            isCuddle = false;
        },1000);
        
        // $('#textbubble').css({
        //     'display': `none`
        // });
    
        console.log(cuddle);
        if(cuddle >= 20) {
            isCuddle = false;
            cuddle = 0;

            return new Promise ((resolve, reject) => {
                $.ajax({
                    url: "/setPet",
                    method: "POST",  
                    data: {
                        action: "cuddle",
                    },
                    cache: false,
                    success: function(data){
                        alert("success cuddle");
                        
                        userProfile.coin += 10;
                        $('#coin').html(userProfile.coin);
                        $('#heart').css({'display':'block'});
                    
                        setTimeout(() => {
                            $('#heart').css({'display':'none'});
                        }, 3000);

                        resolve();
                    },
                    error: function(errMsg) {
                        alert(JSON.stringify(errMsg));
                    }
                });
            })
            .then(() => {
                getPet();
            })
           
        }
        cuddle++;
        
    }
}
// setInterval(() => {
    
//     if(!isCuddle) {
//         $('#textbubble').css({
//             'display': `flex`
//         });
        
//         setTimeout(() => {

//             $('#textbubble').css({
//                 'display': `none`
//             });
    
//         },4000);
//     }

// }, 10000);

// $('#game-container').on('mousemove', (e) =>{
//     var mouseX = e.pageX;
//     var mouseY = e.pageY;
//     console.log('mouse moving')

//     $('#model').on('mousedown', () => {
//         if(
//             mouseX > $('#model').offset().left && 
//             mouseX < $('#model').offset().left + $('#model').width() && 
//             mouseY > $('#model').offset().top &&
//             mouseY < $('#model').offset().top + $('#model').height()
//         ) {
//             clearTimeout(isCuddling);

//             heartParticle.style.display = 'block';
//             heartParticle.style.top = e.pageY - (heartParticle.clientHeight / 2);
//             heartParticle.style.left = e.pageX - (heartParticle.clientWidth / 2);
//             document.getElementById('game-container').appendChild(heartParticle);
            
//             isCuddling = setTimeout(() => {
//                 $('#heart-particle').css({'display':'none'});
//             },1000);
            
//             $('#textbubble').css({
//                 'display': `none`
//             });

//             console.log(cuddle);
//             if(cuddle > 5000) {
//                 cuddle = 0;
//                 userProfile.coin += 10;
//                 $('#coin').html(userProfile.coin);
//                 $('#heart').css({'display':'block'});
//                 setTimeout(() => {
//                     $('#heart').css({'display':'none'});
//                 }, 3000);
//             }
//             cuddle++;
//         } else {
//             console.log('detect1')
//         }
//     })
// }
$('#model-dirt1').on('click', (e) => {
    toggleMenu(e);
});
$('#model-dirt2').on('click', (e) => {
    toggleMenu(e);
});
$('#model-head').on('click', (e) => {
    toggleMenu(e);
});
$('#model-torso').on('click', (e) => {
    toggleMenu(e);
});
$('#model').on('click', (e) => {
    toggleMenu(e);
})
$('#menu-overlay').on("click", toggleMenu);
$('#item1').on("click", (e) => {
    e.stopPropagation();
    //window.location.href="/Minigames/feeding.html";    
});
$('#item2').on("click", (e) => {
    e.stopPropagation();
    console.log("bathing")
});
$('#item3').on("click", (e) => {
    e.stopPropagation();
    console.log("bathing")
});
$('#item4').on("click", (e) => {
    e.stopPropagation();
    console.log("bathing")
});
$('#item5').on("click", (e) => {
    e.stopPropagation();
    console.log("bathing")
});
$('#itemHelp').on("click", (e) => {
    e.stopPropagation();
    console.log("Show modal");    
});

function bathing() {
    console.log("redirecting")
    window.location.href="./Minigames/bathing.html";
}

function feeding() {
    console.log("hola");
    let coin = -200;
    if (userProfile.coin < 200) {
        alert("Not enough coin")
    } else {
        console.log("Enough money");
        return new Promise ((resolve, reject) => {
            $.ajax({
                url: "/updateCoin",
                method: "POST",  
                data: {
                    coin: coin,
                },
                cache: false,
                success: function(data){
                    // alert(data);
                    resolve();
                },
                error: function(errMsg) {
                    alert(JSON.stringify(errMsg));
                }
            });
        })
        .then(()=>{
            console.log("redirecting")
            window.location.href="./Minigames/feeding.html";
        })
        .catch((err) => {
            alert(err);
        });
        
    }
}