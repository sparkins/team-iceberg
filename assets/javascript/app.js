

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


//An array of players and scores for test purposes.  These will be replaced by real scores as they complete the game.  Save results as a player object (Username, Score and Game#)
var players = [
  { userName: "Alyssa", score: 1234, game: 1},
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

savePlayerScore (players);
retrieveAllTimeHighScores();
retrievePersonalHighScores("Alyssa");
getWeather ("London");


function savePlayerScore(playerObject) {
  database.ref().set({
    players: playerObject
  });
}

function retrieveAllTimeHighScores(gameIndex) {
  var highestScores = firebase.database().ref('players');
  highestScores.orderByChild("score").limitToLast(5).on('value', function (data) {
    console.log(data.val());
    return highestScores;
  });
}

function retrievePersonalHighScores(userName) {
  var personalTopScores = firebase.database().ref('players');
  personalTopScores.orderByChild("userName").equalTo(userName).limitToFirst(3).on('value', function (data) {
    console.log(data.val());
    return personalTopScores;
  });
}

function getWeather(cityPic) {
    //var cityPic = "San Francisco"
    // queryURL ="api.openweathermap.org/data/2.5/weather?q=London,uk";
    // queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=cd1c1bbe24ef0b92a983789f75cca3d7";
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

        function chooseTempPic (weather) {
            if (weather = cloud) {
                tempPic = cloud;
                return tempPic;
            }
            else if (weather = sun) {
                tempPic = sun;
                return tempPic;
            }
        }
    });
}

