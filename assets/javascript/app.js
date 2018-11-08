

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
var cityPic = "San Francisco";
var hour = 0;
var myGameZeroScores = [];
var myGameOneScores = [];
var weather = "";
var gameIndex = 0;

//An array of players and scores for test purposes.  These will be replaced by real scores as they complete the game.  Save results as a player object (Username, Score and Game#)
var players = [
  // { userName: "Manny", score: 4321, game: 0 }
  // { userName: "Eric", score: 2345, game: 1 },
  // { userName: "Simon", score: 1212, game: 1 },
  // { userName: "Alyssa", score: 7234, game: 1 },
  // { userName: "Eric", score: 5345, game: 1 },
  // { userName: "Simon", score: 6212, game: 1 },
  // { userName: "Alyssa", score: 5234, game: 0 },
  // { userName: "Eric", score: 4345, game: 0 },
  // { userName: "Simon", score: 3122, game: 0 }
]

// console.log(players.userName);
// console.log(players.score);

// var newScore = { userName: "Manny", score: 2121 };
// players.push(newScore);

$("#city-select").change(function () {
  cityPic = $("#city-select").val();
  console.log("City Name: " + cityPic);

  if (hour<18){
    dayNight = "day";
  }
  else {
    dayNight = "night";
  }

  if (weather === "Cloud" || weather === "Haze" || weather === "Clear") {
    picType = "_clear.png";
  }
  
  else if (weather === "Rain" || weather === "Mist" || weather === "Drizzle") {
    picType = "_rain.png";
  }
  else if (weather === "Snow") {
    picType = "_snow.png"
  }
  else {
    picType = "_clear.png"
  }

  $("#cityName").html(cityPic);
  $("body").css("background", "url('assets/images/" + cityPic + "/" + cityPic + "_" + dayNight + picType + "') no-repeat center center fixed");
  $("body").css("-webkit-background-size", "cover", "-moz-background-size", "cover", "-o-background-size", "cover", "background-size", "cover");
  
  getWeather(cityPic);
  getLocalTime(cityPic);
});


$("#game-select").change(function () {
  var gamePic = $("#game-select").val();
  console.log("game= " + gamePic);
  var gameChosen = [];
  if (gamePic === ("Space Defender")) {
    $("#colTwo").html("<embed id='game1' src='gameOne.html'>");
    gameIndex = 0;
    retrieveAllTimeHighScores(gameIndex);
    retrievePersonalHighScores(localStorage.userName, gameIndex);
  }
  else if (gamePic === ("Fly High")) {
    $("#colTwo").html("<embed id='game2' src='gameTwo.html'>");
    gameIndex = 1;
    retrieveAllTimeHighScores(gameIndex);
    retrievePersonalHighScores(localStorage.userName, gameIndex);
  }
})

// addNewScore(players);

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
      // console.log("RetrievePersonalHS: ",player);
        $("#myScore"+i).html('<li id="myScore">'+player.score+ '</li>');
        i++
    });
        // console.log("Personal Top Scores: ",sortedByScore);
    
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
    if (minute<10) {minute=parseInt("0"+response[0].minute)}
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

    $("#temp").text(temp + "°F");

    chooseTempPic(weather);

    function chooseTempPic(weather) {
      if (weather === "Cloud" || weather === "Haze") {
        tempPic = "assets/images/cloud.png";
      }
      else if (weather === "Clear" && temp > 60) {
        tempPic = "assets/images/sun.png";
      }
      else if (weather === "Rain" || weather === "Mist" || weather === "Drizzle") {
        tempPic = "assets/images/rain.png";
      }

      console.log("tempPic: " + tempPic);
      $("#tempPic").html("<img src='" + tempPic + "' width='280px' height='210px'>");
    }
  });
}

