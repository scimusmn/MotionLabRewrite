'use strict';

obtain(['src/flipbook.js', '/src/slider.js', 'src/toggleButton.js'], ({ Flipbook }, { Slider }, { Toggle })=> {
  //custom element for playing back the image sets.
  if (!customElements.get('video-player')) {

    class playerTag extends HTMLElement {
      constructor() {
        super();
        var _this = this;

        this.idleTimer = null;

        //create the header that holds celebrity athlete names and organizations.
        _this.header = µ('+div', _this);
        _this.header.className = 'athleteInfo sideBySide';
        _this.athlete = µ('+div', _this.header);
        _this.org = µ('+div', _this.header);

        //create the Flipbook element that actually plays back images
        _this.player = new Flipbook();
        _this.appendChild(_this.player);

        _this.player.setAttribute('is', 'flip-book');

        //init the players with 800 frames of storage.
        //TODO: pull this from config.js instead.
        _this.player.init(800);

        //create the play/pause button.
        //TODO: change ToggleButton to use CSS for active and inactive images.
        _this.button = new Toggle();
        _this.button.setAttribute('active', 'assets/pngs/play-one.png');
        _this.button.setAttribute('inactive', 'assets/pngs/pause-one.png');
        _this.button.className = 'justYou';

        //Create the video scrubber and set the orientation to horizontal
        _this.slider = new Slider();
        _this.slider.setAttribute('orient', 'horiz');

        //make a div to hold the play button and slider.
        _this.controls = µ('+div', _this);
        _this.controls.className = 'controls';
        _this.controls.appendChild(_this.button);
        _this.controls.appendChild(_this.slider);

        //add the controls div to the root element.
        _this.appendChild(_this.controls);

        //when the video ends in the player, set the play button, and make the
        // onVideoEnded callback.
        _this.player.onStop = function () {
          console.log('ended');
          _this.button.set();
          _this.onVideoEnd();
        };

        //set the player's onUpdate so that it updates the scrubber after each frame
        _this.player.onUpdate = () => {
          _this.slider.setPercent(_this.player.getPercentDone());
        };

        //when the play/pause button is set to show the 'play' button, stop the video
        _this.button.onSet = () => {
          _this.player.stop();
        };

        //and when it is set to show 'pause', reset the video if it's at the end of playback
        // and begin playing the video.
        _this.button.onReset = () => {
          if (_this.slider.getPercent() >= .99) _this.player.setFrameByPercent(0);
          _this.player.play();
        };

        //when the slider handle moves, set the frame in the player by the current
        // slider percentage, stop the video playback, and show the 'play' button.
        _this.slider.onMoved = () => {
          _this.player.setFrameByPercent(_this.slider.getPercent());
          _this.player.stop();
          _this.button.set();
        };

        _this.player.onLoad = () => {
          _this.onLoad();
        };
      }

      onLoad() {};

      onVideoEnd () {};

      onUnload () {};

      pause () {
        this.player.stop();
        this.button.set();
      }

      play () {
        this.player.play();
        this.button.reset();
      }

      loadSet (dir) {
        var _this = this;
        console.log(`Loading ${dir} in videoPlayer`);
        clearInterval(_this.idleTimer);
        this.idleTimer = setInterval(_this.player.idle, 50);
        get(dir + 'info.json', { type: 'json' }).then((req)=> {
          var info = req.response;
          if (info) {
            console.log(info.name);
            _this.athlete.textContent = info.name;
            _this.org.textContent = info.org;
          }
        });
        _this.player.loadSet(dir);
      };

      unload () {
        clearInterval(this.idleTimer);
        this.athlete.textContent = '';
        this.org.textContent = '';
        this.player.reset();
      }
    }

    customElements.define('video-player', playerTag);
  }

  exports.VideoPlayer = customElements.get('video-player');

  provide(exports);
});
