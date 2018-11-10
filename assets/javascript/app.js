

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
var tempPic = ("assets/images/sun.png");  //pics available for Sun, rain, cloud, snow
var cityPic = "San Francisco";
var hour = 0;
var myGameZeroScores = [];
var myGameOneScores = [];
var weather = "";
var gameIndex = 0;
var dayNight = "";
var picType = "";

//An array of players and scores for test purposes.  These will be replaced by real scores as they complete the game.  Save results as a player object (Username, Score and Game#)
var players = [
  // { userName: "Manny", score: 4321, game: 0 }
  // { userName: "Eric", score: 2345, game: 1 },
  // { userName: "Simon", score: 1212, game: 1 },
  // { userName: "Alyssa", score: 7234, game: 1 },
]

//When you choose your city it updates the background image, gets the local time and weather via APIs
$("#city-select").change(function () {
  cityPic = $("#city-select").val();
  console.log("City Name: " + cityPic);
  chooseBackground();

// Function to determine background image
  function chooseBackground(hour) {

    getWeather(cityPic);
    getLocalTime(cityPic);

    //determines whether to show a day or night picture, based on the current time
    if (hour < 6 || hour > 18) {
      dayNight = "night";
    }
    else {
      dayNight = "day";
    }

    //This code determines whether to show a clear picture, rainy or another weather picture
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
  }
  // console.log("City Chosen: " + cityPic);
  // console.log("dayNight: " + dayNight);
  // console.log("Weather Pic: " + picType);

  console.log ("cityPic LOwerCase: "+cityPic);

  //Display the background image for the selected city 
  $("#cityName").html(cityPic);
  $("body").css("background", "url('assets/images/" + cityPic + "/" + cityPic + "_" + dayNight + picType + "') no-repeat center center fixed");
  $("body").css("-webkit-background-size", "cover", "-moz-background-size", "cover", "-o-background-size", "cover", "background-size", "cover");

});

// Code to determine which game was selected, and update the leaderboards (scores) appropriately
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

//Function to add the player's username, score and game played to firebase
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

// Function that queries firebase to populate the high score leaderboard
function retrieveAllTimeHighScores(gameIndex) {
  var highestScores = firebase.database().ref('players');
  highestScores.orderByChild("score").once('value', function (data) {
    console.log("GameIndex: " + gameIndex);
    console.log(typeof gameIndex);
    console.log(data.val());

    //filter the list of score by gameindex
    var selectedGame = _.filter(data.val(), function (element) {
      return element.game === gameIndex;
    });
    //Sorts the scores by highest to lowest
    var sortedByScore = _.sortBy(selectedGame, function (element) {
      return element.score;
    }).reverse();

   //write top 5 scores to the leaderboard and display them in UI
   var i = 1;
  _.each(_.first(sortedByScore, 5), function (player) {
    console.log(player);
    $("#user" + i).html('<li <span id="playerName"> ' + player.userName + '</span> <span id="playerScore">' + player.score + '</span></li>');
    i++
  });

 //for the 3 highest scores, style unique css and add gold star img to #1 score
     _.each(_.first(sortedByScore, 1), function (player) {
      console.log(player);
      $("#user1").html('<li <span id="playerName"> ' + player.userName + '</span> <img id="star" src="assets/images/goldstar.png" width="50px" height="50px"><span id="playerScore">' + player.score + '</span></li>');
      i++
    })
    $("#user1").css("background", "gold");
    $("#user1").css("border", "2px rgb(92, 80, 12) double")
    $("#user2").css("background", "rgb(235, 211, 78)");
    $("#user3").css("background", "rgb(250, 233, 140)");
  });

}

// Function to grab the current users top 3 scores for the chosen game
function retrievePersonalHighScores(userName, gameIndex) {
  var personalTopScores = firebase.database().ref('players');
  personalTopScores.orderByChild("userName").equalTo(userName).once('value', function (data) {
    console.log("GameIndex: " + gameIndex);
    console.log(data.val());
    // takes a list of scores filtered by the current user and the game selected
    var selectedGame = _.filter(data.val(), function (element) {
      return element.game === gameIndex;
    });
    // Sorts the list by highest to lowest
    var sortedByScore = _.sortBy(selectedGame, function (element) {
      return element.score;
    }).reverse();

    // takes the sorted list, grabs top 3 scores, writes them to appropriate html div for personal scores
    var i = 1;
    _.each(_.first(sortedByScore, 3), function (player) {
      // console.log("RetrievePersonalHS: ",player);
      $("#myScore" + i).html('<li id="myScore">' + player.score + '<img src="assets/images/best.png" width="30px" height="30px"></li>');
      i++
    });
    // console.log("Personal Top Scores: ",sortedByScore);
  });
}

//Function that takes the chosen city and adds it to the API query to return the local time 
function getLocalTime(cityPic) {
  queryURL = "https://api.okapi.online/datetime/lookup/time?timezone.addressLocality=" + cityPic + "&access_token=ngqrmaeNLzmwbFroz2aIWeeV";
  console.log("display-url: " + queryURL);

  // AJAX GET call for the specific timezone data requested
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    // console.log(response);
    // console.log(response[0].hour);

    //Grabs the month, day, year, hour and minute from the response
    var month = response[0].month;
    var year = response[0].year;
    var day = response[0].day;
    hour = response[0].hour;
    var minute = response[0].minute;
    if (minute < 10) { minute = parseInt("0" + response[0].minute) }
    var localTime = hour + ":" + minute;
    var localDate = month + "/" + day + "/" + year;

    // console.log(localDate);
    // console.log(hour + ":" + minute);

    // Writes the date and time data to the UI
    $("#localDate").html("Local Date: " + localDate);
    $("#localTime").html("Local Time: " + localTime);

  });
}

//Function that takes the chosen city and queries the openweather API to grab the current weather conditions
function getWeather(cityPic) {

  queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityPic + "&APPID=cd1c1bbe24ef0b92a983789f75cca3d7";

  // console.log("display-topic: " + queryURL);

  // AJAX GET call for the specific weather data for the chosen city
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    // console.log(response);

    //Grab the temperature, city name and weather from the response
    var temperature = response.main.temp;
    // Calculate the temperature in farenheit
    temp = parseInt((temperature - 273.15) / (5 / 9) + 32);
    var cityName = response.name;
    var weather = response.weather[0].main;

    // console.log(cityName);
    // console.log(temp);
    // console.log(weather);

    //Display the temperature in the UI
    $("#temp").text(temp + "°F");

    //Invoke ChooseTempPic function to find current weather
    chooseTempPic(weather);

    //Function to display an icon for the weather: either sun, cloud, snow or rain
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
      else if (weather === "Snow") {
        tempPic = "assets/images/snow.png"
      }
      else {
        tempPic = "assets/images/sun.png"
      }

      // Add a weather icon image to the UI
      // console.log("tempPic: " + tempPic);
      $("#tempPic").html("<img src='" + tempPic + "' width='280px' height='210px'>");
    }
  });
}
