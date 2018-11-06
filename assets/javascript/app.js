

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

//An array of players and scores for test purposes.  These will be replaced by real scores as they complete the game.  Save results as a player object (Username, Score and Game#)
var players = [
  { userName: "Alyssa", score: 1234, game: 1 },
  { userName: "Eric", score: 2345, game: 1 },
  { userName: "Simon", score: 1212, game: 1 },
  { userName: "Alyssa", score: 7234, game: 1 },
  { userName: "Eric", score: 5345, game: 1 },
  { userName: "Simon", score: 6212, game: 1 },
  { userName: "Alyssa", score: 5234, game: 0 },
  { userName: "Eric", score: 4345, game: 0 },
  { userName: "Simon", score: 3122, game: 0 }
]

// console.log(players[1].userName);
// console.log(players[1].score);

// var newScore = { userName: "Manny", score: 2121 };
// players.push(newScore);

$("#city-select").change(function () {
  cityPic = $("#city-select").val();
  console.log("City Name: " + cityPic);

  $("#cityName").html(cityPic);
  $("body").css("background", "url('" + cityPic + ".png') center no-repeat");

  getWeather(cityPic);

});

savePlayerScore(players);
retrieveAllTimeHighScores();
retrievePersonalHighScores("Alyssa");


function savePlayerScore(playerObject) {
  database.ref().set({
    players: playerObject
  });
}

function retrieveAllTimeHighScores(gameIndex) {
  var highestScores = firebase.database().ref('players');
  highestScores.orderByChild("userName").once('value', function (data) {
    data.forEach(function (element) {
      console.log(element.val());
    });
  });
}

function retrievePersonalHighScores(userName) {
  var personalTopScores = firebase.database().ref('players');
  personalTopScores.orderByChild("userName").equalTo(userName).once('value', function (data) {
    data.forEach(function (element) {
      console.log(element.val());
  });
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
      else if (weather === "Rain" || weather === "Mist") {
        tempPic = "rain.png";
      }

      console.log("tempPic: " + tempPic);
      $("#tempPic").html("<img src='" + tempPic + "' width='280px' height='210px'>");
    }
  });
}

