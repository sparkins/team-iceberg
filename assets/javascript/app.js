

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAPBjfbWjYgZsJ00tgPQPkRmjNpy6I3qpQ",
  authDomain: "team-iceberg.firebaseapp.com",
  databaseURL: "https://team-iceberg.firebaseio.com",
  projectId: "team-iceberg",
  storageBucket: "team-iceberg.appspot.com",
  messagingSenderId: "997146402050"
};
firebase.initializeApp(config);

//Global Variables
var database = firebase.database();
var temp = 0;
var tempPic = ("sun");  //pics available for Sun, rain, cloud, snow
var cityPic = "SF";

var myGameZeroScores = [];
var myGameOneScores = [];

var gameIndex = 0;

//An array of players and scores for test purposes.  These will be replaced by real scores as they complete the game.  Save results as a player object (Username, Score and Game#)
var players = [
//   // { userName: "Manny", score: 4321, game: 0 }
//   // { userName: "Eric", score: 2345, game: 1 },
//   // { userName: "Simon", score: 1212, game: 1 },
//   // { userName: "Alyssa", score: 7234, game: 1 },
//   // { userName: "Eric", score: 5345, game: 1 },
//   // { userName: "Simon", score: 6212, game: 1 },
//   // { userName: "Alyssa", score: 5234, game: 0 },
//   // { userName: "Eric", score: 4345, game: 0 },
//   // { userName: "Simon", score: 3122, game: 0 }
]

// console.log(players.userName);
// console.log(players.score);

// var newScore = { userName: "Manny", score: 2121 };
// players.push(newScore);

$("#city-select").change(function () {
  cityPic = $("#city-select").val();
  console.log("City Name: " + cityPic);

  $("#cityName").html(cityPic);
  $("body").css("background", "url('assets/images/" + cityPic + ".png') center no-repeat");

  getWeather(cityPic);
  getLocalTime(cityPic);
});

$("#game-select").change(function () {
  var gamePic = $("#game-select").val();
  console.log("game= " + gamePic);
  if (gamePic === ("Game 1: Space Defender")) {
    $("#colTwo").html("<embed id='game1' src='gameOne.html'>");
    gameIndex = 0;
  }
  else if (gamePic === ("Game 2: Helicopter Game")) {
    $("#colTwo").html("<embed id='game2' src='gameTwo.html'>");
    gameIndex = 1;
  }
})

addNewScore(players);
retrieveAllTimeHighScores(gameIndex);
retrievePersonalHighScores("Alyssa", gameIndex);


function addNewScore(playerObject) {
  var database = firebase.database().ref();
  var playersRef = database.child('players');
  var newPlayerScore = playersRef.push();
  playerObject.forEach(function (element) {
    newPlayerScore.set({
      userName: element.userName,
      score: element.score,
      game: element.game
    });
    console.log("Added score for ", element.userName);
  });
}

function retrieveAllTimeHighScores(gameIndex) {
  var highestScores = firebase.database().ref('players');
  highestScores.orderByChild("score").once('value', function (data) {
    console.log("GameIndex: "+gameIndex);
    console.log(typeof gameIndex);
    console.log (data.val());
    var selectedGame = _.filter(data.val(), function(element){
      return element.game === gameIndex;  
    });
    var sortedByScore = _.sortBy(selectedGame, function(element){
      return element.score; 
    }).reverse();

    var i = 1;
    _.each(_.first(sortedByScore, 5), function(player){
      console.log(player);
      $("#user"+i).html('<li <span id="playerName"> ' +player.userName+'</span> <span id="playerScore">'+player.score+ '</span></li>');
      i++
    })
    });
}

function retrievePersonalHighScores(userName, gameIndex) {
  var personalTopScores = firebase.database().ref('players');
  personalTopScores.orderByChild("userName").equalTo(userName).once('value', function (data) {
    console.log("GameIndex: "+gameIndex);
    console.log (data.val());
    var selectedGame = _.filter(data.val(), function(element){
      return element.game === gameIndex;  
    });
    var sortedByScore = _.sortBy(selectedGame, function(element){
      return element.score; 
    }).reverse();
    
    var i = 1;
    _.each(_.first(sortedByScore, 3), function(player){
      console.log("RetrievePersonalHS: ",player);
        // $("#user"+i).text(player.userName);
        $("#myScore"+i).html('<li id="myScore">'+player.score+ '</li>');
        i++
    });
          
    // $("#currentUser").text(player.userName);
    console.log("Personal Top Scores: ",sortedByScore);
    
  });
}

function getLocalTime(cityPic) {
  queryURL = "https://api.okapi.online/datetime/lookup/time?timezone.addressLocality=" + cityPic + "&access_token=ngqrmaeNLzmwbFroz2aIWeeV";
  console.log("display-url: " + queryURL);

  // AJAX GET call for the specific topic buttons being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    console.log(response);
    console.log(response[0].hour);

    var month = response[0].month;
    var year = response[0].year;
    var day = response[0].day;
    var hour = response[0].hour;
    var minute = response[0].minute;
    var localTime = hour + ":" + minute;
    var localDate = month + "/" + day + "/" + year;

    console.log(localDate);
    console.log(hour + ":" + minute);

    $("#localDate").html("Local Date: " + localDate);
    $("#localTime").html("Local Time: " + localTime);

  });
}

function getWeather(cityPic) {
  //var cityPic = "San Francisco"

  queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityPic + "&APPID=cd1c1bbe24ef0b92a983789f75cca3d7";

  console.log("display-topic: " + queryURL);

  // AJAX GET call for the specific topic buttons being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    console.log(response);

    var temperature = response.main.temp;
    temp = parseInt((temperature - 273.15) / (5 / 9) + 32);
    var cityName = response.name;
    var weather = response.weather[0].main;

    console.log(cityName);
    console.log(temp);
    console.log(weather);

    $("#temp").text(temp);

    chooseTempPic(weather);

    function chooseTempPic(weather) {
      if (weather === "Cloud" || weather === "Haze") {
        tempPic = "cloud.png";
      }
      else if (weather === "Clear" && temp > 60) {
        tempPic = "sun.png";
      }
      else if (weather === "Rain" || weather === "Mist" || weather === "Drizzle") {
        tempPic = "rain.png";
      }

      console.log("tempPic: " + tempPic);
      $("#tempPic").html("<img src='" + tempPic + "' width='280px' height='210px'>");
    }
  });
}

