'use strict';

console.log('app');

let obtains = [
  'src/thumbnails.js',
  'µ/socket.js',
  'src/videoPlayer.js',
  'config.js',
];

obtain(obtains, (thumbs, sockets, vp, conf) => {
  console.log('loaded!');

  var ws = sockets.get(window.location.host, false);

  exports.app = {};

  var visGroup = null;
  var celebGroup = null;

  exports.app.start = ()=> {

    visGroup = µ('#thumbs');
    celebGroup = µ('#celebThumbs');

    //sets the class of the body, to make the just you screen visible
    visGroup.onChoose = (set)=> {
      µ('body')[0].className = 'JustYou';

      //if we're in admin mode, send a delete request of the selected set,
      // which forces a reload on all of the playback stations
      if (visGroup.adminMode) window.webSockClient.send('del', set.setName);
    };

    //function to get the index in the parent element of a child
    var elementIndex = el => Array.from(el.parentElement.children).indexOf(el) + 1;

    //create a blank string to hold the indices of the pressed child elements
    celebGroup.code = '';

    //when a celeb set is selected, store the index in the code variable
    celebGroup.onChoose = (set)=> {
      celebGroup.code += elementIndex(set);
    };

    ws.on('seq', (data)=> {
      visGroup.handleSetChange(data);
    });

    ws.on('cel', (data)=> {
      celebGroup.handleSetChange(data);
    });

    ws.on('reload', (data)=> {
      location.reload();
    });

    ws.connect();
  };

  //set the flag to cache the images for the celeb player
  µ('#celebPlayer').player.cached = true;

  //once the video loads in either the celeb or visitor players, play it.
  µ('#visitorPlayer').onLoad = () => {
    µ('#visitorPlayer').play();
  };

  µ('#celebPlayer').onLoad = () => {
    µ('#celebPlayer').play();
  };

  //when the play state of the videos changes, set the state of the playboth button accordingly.
  µ('#celebPlayer').player.onStateChange = ()=> {
    let celebState = µ('#celebPlayer').player.playing;
    let visitorState = µ('#visitorPlayer').player.playing;

    if (celebState || visitorState) {
      µ('#playBoth').reset();
    } else if (!celebState && !visitorState) {
      µ('#playBoth').set();
    }
  };

  //make the state change callback the same for the visitor player and celeb player
  µ('#visitorPlayer').player.onStateChange = µ('#celebPlayer').player.onStateChange;

  /////////////////////////////
  // mode selectors
  /////////////////////////////

  function showJustYou() {
    //set the body class to JustYou, and clear the admin mode flag.
    µ('body')[0].className = 'JustYou';
    visGroup.adminMode = false;
    µ('#celebPlayer').unload();
  }

  function showSideBySide() {
    //set the body class to SideBySide, and clear the admin mode flag.
    µ('body')[0].className = 'SideBySide';
    visGroup.adminMode = false;
  }

  function showSelect() {
    //clear the idle timeout and deselect any selected thumbnails.
    if (resetTimer) clearTimeout(resetTimer);
    visGroup.resetActive();
    celebGroup.resetActive();

    //unload any loaded videos and set the className to findYourVideo
    µ('#visitorPlayer').unload();
    µ('#celebPlayer').unload();
    µ('body')[0].className = 'findYourVideo';
  }

  //////////////////////////////
  // ui functions
  /////////////////////////////

  µ('#jy').onclick = showJustYou;

  µ('#sbs').onclick = showSideBySide;

  µ('#fyv').onclick = function () {
    //show the visitor thumbnail select screen
    showSelect();

    //if the celeb thumbnails were selected in the correct order
    // before touching the 'find your video' button, enter admin mode.
    if (celebGroup.code == '31415') {
      visGroup.adminMode = true;
      µ('body')[0].className += ' AdminMode';
    }

    //clear the code which stores the order that the celeb thumbs were pressed.
    celebGroup.code = '';
  };

  //leave admin mode when the 'exit admin mode button is pressed.'
  µ('#adminExit').onclick = function () {
    visGroup.adminMode = false;
    showSelect();
  };

  µ('#playBoth').onSet = function () {
    µ('#visitorPlayer').pause();
    µ('#celebPlayer').pause();
  };

  µ('#playBoth').onReset = function () {
    µ('#visitorPlayer').play();
    µ('#celebPlayer').play();
  };

  //////////////////////////////
  // idle timeout (if it hasn't been used recently)
  /////////////////////////////

  var resetTimer = null;

  //set a shorter timeout after the visitor video finishes playback
  µ('#visitorPlayer').onVideoEnd = ()=> {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(()=> {
      showSelect();
    }, 60000);
  };

  //set a longer timeout after each screenpress.
  µ('body')[0].onclick = ()=> {

    clearTimeout(resetTimer);
    resetTimer = setTimeout(()=> {
      showSelect();
    }, 120000);
  };

  provide(exports);
});
