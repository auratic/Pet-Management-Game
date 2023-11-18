
var currentX = 0;
var currentY = 0;
var time = 10;

var gameState = 0; // 0 = stop, 1 = start
var gameMode = ''
var coin = 0;


$(document).ready(function(){
    
  $('#retry').on('click', () => {
    window.location.reload(true);
  });

  $('#menu').on('click', () => {
    window.location.replace("/");
  });

  $('#start').on('click', () => {

    gameMode = $('#gamemode input:radio:checked').val();
    console.log(gameMode)
    $('#start-overlay').css({'display':'none'});
    $('#countdown-overlay').css({'display':'flex'});
    let count = 2

    if(gameMode == "voice") {
      $('#voice-instruction').css({'display': 'flex'})
      getMicAccess();
    } else {
      $('#keyboard-instruction').css({'display': 'flex'})
    }

    let countdown = setInterval(() => {

      if(count <= 0) {
        clearInterval(countdown);
        $('#countdown-overlay').css({'display':'none'});
        gameState = 1;

        let gameTime = setInterval(() => {
          $('#point').html(coin);
          if (time <= 0) {
            $('#end-overlay').css({'display': 'flex'}); 
            gameState = 0; 
          } else {
            $('#time').html(`${time} seconds`); 
            time--;
          }

        }, 1000);

      } else {
        $('#countdown-overlay > h1').html(count);
        count--
      }
    }, 1000);

  });

    document.getElementById('kruskal').mazeRun(); 

    for (let i = 0; i < mazeSize ; i ++) {
      for (let j = 0; j < mazeSize ; j ++) {
        if(i != 0 || j != 0) $(`#kruskal_y${i}x${j}`).append('<img src="coin-nobg.gif" style="height:100%; image-rendering: pixelated; padding-top:1px; object-fit:scale-down">')
      }
    }
    let gridSize = (window.innerHeight > window.innerWidth) ? $('#maze-container').width() :  $('#maze-container').height();
    $('#kruskal_y0x0').append('<img src="cat-idle-nobg.gif" style="height:100%; image-rendering: pixelated; padding-top:1px">')
    $('.small .grid .box > div').css({'width': `${gridSize / mazeSize - 20}px`, 'height': `${gridSize / mazeSize - 20}px`})


});

function updateMaze(direction) {

  var entry = false;
  var element = document.getElementById(`kruskal_y${currentY}x${currentX}`);

  if (direction == 'w' || direction == 'W') {

    if(element.classList.contains('n')) {
      $(`#kruskal_y${currentY}x${currentX}`).empty()
      currentY -= 1;
      entry = true;
    
    } else {
      console.log('blocked');
    }

  } else if (direction == 'a' || direction == 'A') {

    if(element.classList.contains('w')) {
      $(`#kruskal_y${currentY}x${currentX}`).empty()
      currentX -= 1;
      entry = true;

    } else {
      console.log('blocked');
    }

  } else if (direction == 's' || direction == 'S') {

    if(element.classList.contains('s')) {
      $(`#kruskal_y${currentY}x${currentX}`).empty()
      currentY += 1;
      entry = true;
    
    } else {
      console.log('blocked');
    }

  } else if (direction == 'd' || direction == 'D') {

    if(element.classList.contains('e')) {
      $(`#kruskal_y${currentY}x${currentX}`).empty()
      currentX += 1;
      entry = true;

    } else {
      console.log('blocked');
    }

  } 
  if( entry == true ) {

    var divChildren = $(`#kruskal_y${currentY}x${currentX}`).children().length;
    if (divChildren > 0) { 
      coin++
      $('#coin').html(coin);
      $(`#kruskal_y${currentY}x${currentX}`).empty()
    }
    $(`#kruskal_y${currentY}x${currentX}`).append('<img src="cat-idle-nobg.gif" style="height:100%; image-rendering: pixelated; padding-top:1px;">')             

  } else {
    console.log("entry false")
  }

}

  

$(document).keypress(function(event){

    if ( gameState == 1 && gameMode == 'keyboard') {
      console.log(currentX);
      console.log(currentY);
      
      // event.which is deprecated, event.key is the modern approach
      var keyPressed = event.key; // Get the key that was pressed
      updateMaze(keyPressed);

      console.log("Key pressed: " + keyPressed);
    }

});
  

/*
 *
 * Voice Recognition
 * 
 */


var micCheck = false;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

navigator.getUserMedia =
navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia;

function getMicAccess () {

  navigator.getUserMedia(
    { audio: true },
    (stream) => {
      micCheck = true;
      setInterval(getMicAccess, 1000);
    },
    (err) => {
      console.log(err);
      // alert(
      //     "Please turn on your microphone and refresh\n" +
      //     "Tips: Click on the mic / video button by your URL"
      // );
      alert('Please enable your microphone')
    }
  );

}

const mic = document.querySelector("#mic");

recognition.onresult = (event) => {
  console.log(event);
  var last = event.results.length - 1;
  var command = event.results[last][0].transcript;
  //To remove all possible errors like "." and "," and upper cases
  command = command.toLowerCase();
  command = command.split(".").join("");
  command = command.split(",").join("");
  command = command.split("?").join("");
  command = command.split("$").join("");
  var confidence = event.results[0][0].confidence;
  var direction;

  console.log(command);
  $("#cmd-result").html(`${command}`);

  switch (command) {
    case "left":
      direction = 'a';
      break;
    case "right":
      direction = 'd';
      break;
    case "up":
      direction = 'w';
      break;
    case "down":
      direction = 's';
      break;
  }

  if(
    command == "left" || 
    command == "right" || 
    command == "up" || 
    command == "down") 
    { console.log(direction) ; updateMaze(direction); }

  // const color = event.results[0][0].transcript;
  // diagnostic.textContent = `Result received: ${color}.`;
  // bg.style.backgroundColor = color;
  // console.log(`Confidence: ${event.results[0][0].confidence}`);
};

recognition.onspeechend = () => {
  console.log('speech end');
  recognition.stop();
};

mic.onmousedown = () => {
    console.log('recognition starts')
    $('#mic').css({"opacity": 0.5})
    recognition.start();
}

mic.onmouseup = () => {
    console.log('recognition stops')
    $('#mic').css({"opacity": 1})
    recognition.stop();
}