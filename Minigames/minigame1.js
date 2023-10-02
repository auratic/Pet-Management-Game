const video = document.getElementById('videoid');

var vcanvas = document.querySelector("#vcanvas");
vcanvas.setAttribute('width', video.clientWidth);
vcanvas.setAttribute('height', video.clientHeight);
var vctx = vcanvas.getContext("2d");

var gameState = 0;
var startCountdown;
var predict;

var finalHandSign;

function checkCountdown () {

   if(gameState == 1) {
      console.log("gamestate = 1")
      clearInterval(startCountdown);
      
      $("#counter").css({'display': 'block'});
      let counter = 5
      let countdown = setInterval(()=> {
         console.log("enter interval" + counter)
         counter--;
         if(counter < 0) {
            clearInterval(countdown);
            gameState = 2;
         } else {
            $("#counter").html(counter);
         }
      },1000);
   }
}
/*
(function() {
   console.log("load ht")
   $.ajax({
      type: 'post',
      //url: 'db.js',
      data: {
          message: "helo",
          action: "minigame",      
          minigame: "1"
      },
      success: function (result) {
          //alert(JSON.stringify(result));
          handTrack = result;
          setupHandtrack();
          //console.log(result)
          //setupHandtrack(result);
          //return Promise.resolve("Success")
      },
      error: function(errMsg) {
          alert(JSON.stringify(errMsg));
      }
  });
})();
*/

function openCam(){
    let All_mediaDevices=navigator.mediaDevices
    if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
       console.log("getUserMedia() not supported.");
       return;
    }
    All_mediaDevices.getUserMedia({
       audio: true,
       video: true
    })
    .then(function(vidStream) {
      
       if ("srcObject" in video) {
          video.srcObject = vidStream;
       } else {
          video.src = window.URL.createObjectURL(vidStream);
       }
       video.onloadedmetadata = function(e) {
          video.play();
       };
    })
    .catch(function(e) {
       console.log(e.name + ": " + e.message);
    });
 }

function result(player1) {
   gameState = 3;
    let handsign = ["stone","paper","scissor"];
    let player2 = handsign[(Math.floor(Math.random() * handsign.length))];
    
    if (player1 == "closed") {
        if (player2 == "stone") {alert ("Draw !"); $("#handsign-img2").attr("src","/Minigames/Assets/stone.jpg");}
        if (player2 == "paper") {alert ("Player 2 wins !"); $("#handsign-img2").attr("src","/Minigames/Assets/paper.jpg");}
        if (player2 == "scissor") {alert ("Player 1 wins !"); $("#handsign-img2").attr("src","/Minigames/Assets/scissor.jpg");}

        console.log(player1 +" and "+ player2)
    } else if (player1 == "open") {
        if (player2 == "stone"){ alert ("Player 1 wins  !"); $("#handsign-img2").attr("src","/Minigames/Assets/stone.jpg");}
        if (player2 == "paper"){ alert ("Draw !"); $("#handsign-img2").attr("src","/Minigames/Assets/paper.jpg");}
        if (player2 == "scissor") {alert ("Player 2 wins !"); $("#handsign-img2").attr("src","/Minigames/Assets/scissor.jpg");}
        console.log(player1 +" and "+ player2)
    } else if (player1 == "point") {
        if (player2 == "stone") {alert ("Player 2 wins  !"); $("#handsign-img2").attr("src","/Minigames/Assets/stone.jpg");}
        if (player2 == "paper") {alert ("Player 1 wins !"); $("#handsign-img2").attr("src","/Minigames/Assets/paper.jpg");}
        if (player2 == "scissor") {alert ("Draw !"); $("#handsign-img2").attr("src","/Minigames/Assets/scissor.jpg");}
        console.log(player1 +" and "+ player2)
    }
}


function drawGame(label) {

   if(gameState == 2) {
      $('#vcanvas').css({'display':'none'});
      $('#videoid').css({'display':'block', 'height': '100%'});
      clearInterval(predict);
      result(finalHandSign);
   } else {
      if(label == "point") {
         gameState = 1
         $("#handsign-img").attr("src","/Minigames/Assets/scissor.jpg");
         finalHandSign = "point";

      } else if(label == "closed") {
         gameState = 1
         $("#handsign-img").attr("src","/Minigames/Assets/stone.jpg")
         finalHandSign = "closed";

      } else if (label == "open") {
         gameState = 1
         $("#handsign-img").attr("src","/Minigames/Assets/paper.jpg")
         finalHandSign = "open";

      }
   }


    
}

/*
 *
 * Handtrackjs
 * 
 */

//import * as handTrack from 'handtrackjs';
//var handTrack = require('handtrackjs')
//import * as handTrack from 'handtrackjs';

const defaultParams = {
   flipHorizontal: true,
   outputStride: 16,
   imageScaleFactor: 1,
   maxNumBoxes: 1,
   iouThreshold: 0.2,
   scoreThreshold: 0.6,
   modelType: "ssd320fpnlite",
   modelSize: "large",
   bboxLineWidth: "2",
   fontSize: 17,
};

handTrack.load(defaultParams).then((lmodel) => {
   model = lmodel;
});

//const model = await handTrack.load(defaultParams);

//Run prediction and draws the video + predication box on a canvas
function runDetection() {
   
   model.detect(video).then((predictions) => {
      model.renderPredictions(predictions, vcanvas, vctx, video);

      if(predictions.length !== 0) {
         //console.log(predictions)
         //console.log("Class: " + predictions[0].class + " , Label: " + predictions[0].label)

         drawGame(predictions[0].label);
      }
   });
}


document.addEventListener("DOMContentLoaded", async function() {
//async function setupHandtrack () {
   //console.log(handTrack)
   
   handTrack.startVideo(video).then(async (status) => {
      if (status) {
         console.log("Camera loaded");
          
         //const predictions =  await model.detect(video); 
         
         predict = setInterval(runDetection, 100);
         startCountdown = setInterval(checkCountdown, 1000);
      } else
          console.log("HandtrackJs fail to start video")
   });
   
   //handTrack.stopVideo(video); 
   // stop camera input stream on the provided video tag.

});

