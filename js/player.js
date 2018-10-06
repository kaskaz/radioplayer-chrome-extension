'use strict';

/**
 * classes
 */
const cPlay   = 'glyphicon glyphicon-play';
const cPause  = 'glyphicon glyphicon-pause';
const cMute   = 'glyphicon glyphicon-volume-off';
const cUnmute = 'glyphicon glyphicon-volume-up';

/**
 * identifiers
 */
const idPlayer  = 'player';
const idPlay    = 'button-play';
const idPause   = 'button-pause';
const idMenu    = 'button-menu';
const idPrevious= 'button-prev';
const idNext    = 'button-next';
const idMute    = 'button-mute';
const idUnmute  = 'button-unmute';
const idName    = 'label-name';
const idTime    = 'label-time';

let audioSources = [
  {name:"Metal", url:"http://streaming.radionomy.com/Hard-HeavyMetalHits"},
  {name:"Morabeza", url:"http://radios.vpn.sapo.pt/CV/radio3.mp3"},
  {name:"Crioula FM", url:"http://radios.vpn.sapo.pt/CV/radio5.mp3"},
  {name:"Praia FM", url:"http://radios.vpn.sapo.pt/CV/radio4.mp3"},
  {name:"RCV", url:"http://radios.vpn.sapo.pt/CV/radio7.mp3"}
];


/**
 * Build the player interface
 */
window.onload = function() {
  getPlayer(function(player) {
    
    var isPaused = player.paused;
    var isMuted = player.muted;

    getCurrentStation(function(station) {

      // set station name
      displayStationName(station);
      
      // set playing time
      updateTime();

      // set play/pause button status
      var buttonPlay = document.getElementById(idPlay);
      if(isPaused) {
        setButtonClass(buttonPlay,cPlay);
      } else {
        setButtonClass(buttonPlay,cPause);
      }
    
      // set mute/unmute button status
      var buttonMute = document.getElementById(idMute);    
      if(isMuted) {
        setButtonClass(buttonMute,cMute);
      } else {
        setButtonClass(buttonMute,cUnmute);
      }

    });      
  });
};

/**
 * Get the audio player 
 */
function getPlayer(callback) {
  chrome.runtime.getBackgroundPage(function(page) {
    var player = page.document.getElementById(idPlayer);
    callback(player);
  });
};

/**
 * Get the playing station
 */
function getCurrentStation(callback) {
  getIndex(function(index) {
    getList(function(list) {
      callback(list[index]);
    });
  });
};

/**
 * Load a given station in the player 
 */
function loadStation(station) {
  getPlayer(function(player) {
    player.src = station.url;
    player.load();
  });
};

/**
 * Displays the name of the given station in the details panel
 */
function displayStationName(station) {
  document.getElementById(idName).innerText = station.name;
}

/**
 * Set a class to the given button
 */
function setButtonClass(button, name) {
  button.getElementsByTagName('span')[0].className = name;
}

/**
 * Stop updating time 
 * Because HTML elements are no longer displayed, the update must be stoped. 
 */
chrome.windows.onFocusChanged.addListener(function(windowId) {
  getPlayer(function(player) {
    if(windowId == -1) {
      player.addEventListener('timeupdate',updateTime);
    } else {
      player.removeEventListener('timeupdate',updateTime);
    }
  });
});

/**
 * Update time
 */
function updateTime() {
  getPlayer(function(player) {
    var spanStationPlayingTime = document.getElementById(idTime);
    var time = player.currentTime;
    var minutes = Math.floor((time % (1000*60*60)) /60);
    var seconds = Math.floor((time % (1000 * 60)));
    seconds = checkSeconds(seconds,minutes);
    spanStationPlayingTime.innerText = checkTime(minutes) + ':' + checkTime(seconds);
  });
};

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
};

function checkSeconds(seconds, minutes) {
  if (seconds > 60) {
    seconds = seconds - (60*minutes);
  }
  return seconds;
};

/**
 * Mute/Unmute sound
 */
let muteButton = document.getElementById(idMute);
muteButton.onclick = function(e) {
  var button = e.currentTarget;
  getPlayer(function(player) {
    var clazz = cMute;
    if(player.muted) {
      clazz = cUnmute;
    }
    setButtonClass(button,clazz);
    player.muted = !player.muted;
  });
};

/**
 * Play/Pause audio
 */
let playButton = document.getElementById(idPlay);
playButton.onclick = function(e) {
  var button = e.currentTarget;
  
  getPlayer(function(player) {
    
    if(player.paused) {
      if(player.src == "") {
        getCurrentStation(function(station) {
          loadStation(station);
          displayStationName(station);
          // due to a known bug...
          player.oncanplay = function() {
            player.play();
          };
        });
      } else {
        player.play();
      }
  
      setButtonClass(button,cPause);
      
    } else {
      setButtonClass(button,cPlay);
      player.pause();
    }
  });
};

/**
 * Navigation - previous
 */
let prevButton = document.getElementById(idPrevious);
prevButton.onclick = function() {
  getPlayer(function(player) {
    var isPlaying = !player.paused;

    getIndex(function(index) {
      getList(function(list) {
        var i = index;
        if(index == 0) {
          i = list.length-1;
        } else {
          i = index-1;
        }
        setIndex(i);
        
        var station = list[i];
        loadStation(station);
        displayStationName(station);
      });
    });
  
    // continue playing if it was playing!
    if(isPlaying) {
      player.play();
    }
  });
};

/**
 * Navigation - next
 */
let nextButton = document.getElementById(idNext);
nextButton.onclick = function() {
  getPlayer(function(player) {
    var isPlaying = !player.paused;

    getIndex(function(index) {
      getList(function(list) {
        var i = index;
        if(index == list.length-1) {
          i = 0;
        } else {
          i = index+1;
        }
        setIndex(i);

        var station = list[i];
        loadStation(station);
        displayStationName(station);    
      });
    });

    // continue playing if it was playing!
    if(isPlaying) {
      player.play();
    }
  });
};

/**
 * Open options menu
 */
let buttonMenu = document.getElementById(idMenu);
buttonMenu.onclick = function(e) {
  var optionsUrl = chrome.extension.getURL('views/options.html');
  chrome.tabs.create({url:optionsUrl});
};

/**
 * Storage related
 */
function getList(callback) {
  chrome.storage.local.get(['stations'], function(result) {
    if(result.stations == undefined) {
      callback([{name:'empty list', url:''}]);
    } else {
      callback(result.stations);
    }
  });
}

function setIndex(index) {
  chrome.storage.local.set({'index': index}, function() {
      console.log('new index is ' + index + '!');
  });
}

function getIndex(callback) {
  chrome.storage.local.get(['index'], function(result) {
    if(result.index == undefined) {
      callback(0);
    }else {
      callback(result.index);
    }
  });
}

