
window.addEventListener('keydown', function (e) {
  var audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  var key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  if(!audio)return; // stop function from running all together 
  audio.currentTime = 0;
  audio.play();
  // audio.volume = 0.2;
  key.classList.add('playing');
  console.log(keyCode);
});
function removeTransition(e) {
 if(e.propertyName !== 'transform') return;
 
  this.classList.remove('playing');
}
var keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));


//  This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
var muteAudio = document.getElementById('player');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: 'vNZnKsB9pVs',
    playerVars: { 'autoplay': 1, 'controls': 0 },
    events: {
      'onReady': onPlayerReady,
      'autoplay': 1,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    //  setTimeout(stopVideo, 60000;
    done = true;
    // console.log(event);
  }
}
function stopVideo() {
  player.stopVideo();
}
