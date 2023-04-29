function screenDetect () {

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
}

window.onload = screenDetect;
window.onresize = screenDetect;

var minigame_container = document.getElementById("minigame-container");

document.getElementById("minigame-open").onclick = () => {
    minigame_container.style.visibility = "visible";
}

document.getElementById("minigame-close").onclick = () => {
    minigame_container.style.visibility = "hidden";
};