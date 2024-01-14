
var currentX = 0;
var currentY = 0;
var time = 30;

var gameState = 0; // 0 = stop, 1 = start
var gameMode = ''
var coin = 0;

// var coinSize = 5

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

function GUISetting () {
  if(	window.screen.height >= 4096 || window.screen.width >= 4096 ) {
      // (window.innerHeight > window.innerWidth) ? $("a").css({"font-size": "2em"}) : $("a").css({"font-size": "1em"});
      $("h1").css({"font-size": "5em"});
      $("h2").css({"font-size": "5em"});
      $("h3").css({"font-size": "4em"});
      $("h4").css({"font-size": "5em"});
      $("label").css({"font-size": "5em"});
      $("button").css({"font-size": "5em"});
      $("table").css({"font-size": "4em"});
  }else if(	window.screen.height >= 2560 || window.screen.width >= 2560 ) {
      // (window.innerHeight > window.innerWidth) ? $("a").css({"font-size": "2em"}) : $("a").css({"font-size": "1em"});
      $("h1").css({"font-size": "4em"});
      $("h2").css({"font-size": "4em"});
      $("h3").css({"font-size": "3em"});
      $("h4").css({"font-size": "4em"});
      $("label").css({"font-size": "4em"});
      $("button").css({"font-size": "4em"});
      $("table").css({"font-size": "4em"});
  } else if(	window.screen.height >= 1920 || window.screen.width >= 1920 ) {
      $("h1").css({"font-size": "3em"})
      $("h3").css({"font-size": "2.5em"});
      $("h4").css({"font-size": "3em"});
      $("label").css({"font-size": "3em"});
      $("button").css({"font-size": "3em"});
  } else if(	window.screen.height >= 1280 || window.screen.width >= 1280 ) {
      $("h1").css({"font-size": "2em"})
      $("h2").css({"font-size": "2em"});
      $("h3").css({"font-size": "1.5em"});
      $("h4").css({"font-size": "2em"});
      $("label").css({"font-size": "2em"});
      $("button").css({"font-size": "2em"});
      $("table").css({"font-size": "2em"});
  } else if(	window.screen.height >= 1024 || window.screen.width >= 1024 ) {
      $("h1").css({"font-size": "2em"})
      $("h2").css({"font-size": "2em"});
      $("h3").css({"font-size": "1.8em"});
      $("h4").css({"font-size": "2em"});
      $("label").css({"font-size": "2em"});
      $("button").css({"font-size": "2em"});
      $("table").css({"font-size": "2em"});
  } else {
      $("h1").css({"font-size": "2em"});
      $("table").css({"font-size": "2em"});
  }

}

$(document).ready(function(){
    
  GUISetting();

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
      $("#result-display").css({'display': 'block'})
      $("#tut-display").css({'display': 'none'})
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
          if (time <= 0 || coin == 48) {
            gameOver();
            clearInterval(gameTime);
          } else {
            time--;
            $('#time').html(`${formatTime(time)}`); 
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
        if(i != 0 || j != 0) $(`#kruskal_y${i}x${j}`).append(`<img src="coin-nobg.gif" style="height:70%; image-rendering: pixelated; padding-top:1px;">`)
      }
    }
    let gridSize = (window.innerHeight > window.innerWidth) ? $('#maze-container').width() :  $('#maze-container').height();
    $('#kruskal_y0x0').append(`<img src="cat-idle-nobg.gif" style="height:95%; image-rendering: pixelated; padding-top:1px">`)
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

function gameOver () {
  if(gameMode == 'voice') { coin = coin * 2; recognition.stop(); clearInterval(reqMic); }
  $('#point').html(coin);
  $('#end-overlay').css({'display': 'flex'}); 
  gameState = 0; 

  let getLeaderboard = new Promise ((res, rej) => {
    $.ajax({
      url: "/setLeaderboard",
      method: "POST",  
      data: {
          game: "mazegame",
          point: coin,
      },
      cache: false,
      dataType: 'json',
      success: function(data){
  
        res()
  
      },
      error: function(errMsg) {
          // alert(JSON.stringify(errMsg));
          console.log(JSON.stringify(errMsg));
          res()
      }
    });
  })
  .then(() => {

    $.ajax({
      url: "/getLeaderboard",
      method: "POST",  
      data: {
          game: "mazegame",
      },
      cache: false,
      dataType: 'json',
      success: function(data){

        let counter = 1;
        console.log(data);

        data.forEach((user) => {

          let html = `
          <tr>
            <th scope="row">${counter}</th>
            <td>${data[counter-1].username}</td>
            <td>${data[counter-1].mazegame}</td>
          </tr>`;
          $('#scoreboard > tbody').append(html);

          if(counter == 5) return;
          else counter++

        })

      },
      error: function(errMsg) {
          // alert(JSON.stringify(errMsg));
          console.log(JSON.stringify(errMsg));
          rej(errMsg)
      }
    });

  })
  .catch((result) => {
    // alert(JSON.stringify(result));
    console.log(JSON.stringify(result));
  });

  
  $.ajax({
    url: "/updateCoin",
    method: "POST",  
    data: {
        coin: coin,
    },
    cache: false,
    success: function(data){

      // alert(`${coin} coins added`);
      console.log(`${coin} coins added`);

    },
    error: function(errMsg) {
        // alert(JSON.stringify(errMsg));
        console.log(JSON.stringify(errMsg));
    }
  });
  
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

var reqMic;
function getMicAccess () {
 
  navigator.getUserMedia(
    { audio: true },
    (stream) => {
      micCheck = true;
      console.log("Mic granted")
      reqMic = setInterval(getMicAccess, 5000);
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
const commands = ["left", "right", "up", "down"]
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

  // because a command can contain multiple words
  // we need to split it.
  let words = command.split(" ");
  commandText = ""; // used for display to the users what speech is recognized
  var commandDetected = "";
  let isAdded = false; // to check if the word is to be highlighted. If true the highlighted word does not add multiple times
  var index = 0; // In case there are multiple commands. We are to differentiate them with different id index
  let textLength = 0;
  var displayText = ""

  for (let i = 0; i < words.length; i++) {
    textLength += words[i].length;
    if (textLength >= 10) {
      words.splice(i, words.length - i);
      words.push("...");
      return;
    }
  }

  for (let i = 0 ; i < words.length; i++) {
    if(commands.includes(words[i]) && !isAdded) {
      isAdded = true;
      displayText += `<span style="color:green">${words[i]}</span> `;
      commandDetected = words[i];
    } else {
      displayText += `${words[i]} `
    }
  }

  console.log(command);
  $("#cmd-result").html(`${displayText}`);

  switch (commandDetected) {
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
    commandDetected == "left" || 
    commandDetected == "right" || 
    commandDetected == "up" || 
    commandDetected == "down") 
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
// recognition.speechstart = () => {
//   recognition.start();
//   console.log("listening")
// };

recognition.start();
// mic.onmousedown = () => {
//     console.log('recognition starts')
//     $('#mic').css({"opacity": 0.5})
//     recognition.start();
// }

// mic.onmouseup = () => {
//     console.log('recognition stops')
//     $('#mic').css({"opacity": 1})
//     recognition.stop();
// }


var playBGM = false;
var BGM = new Audio('Assets/Audio/Fluffing-a-Duck.mp3');
BGM.volume= 0.8;
BGM.loop= true;

window.onclick = () => {

    if(!playBGM) {
        BGM.play();
        playBGM = true;
    }
}