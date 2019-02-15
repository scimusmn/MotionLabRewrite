var requests = [
  'µ/Arduino.js',
];

obtain(requests, (Arduino)=> {

  if (!window.muse) window.muse = {};
  if (!window.muse.arduino) window.muse.arduino = new Arduino({ manufacturer: 'FTDI' });
  var arduino = window.muse.arduino;

  var StopLight = function (rd, gn) {
    var _this = this;

    this.red = (state)=> {
      _this.red.state = state;
      arduino.digitalWrite(rd, state);
    };

    this.green = (state)=> {
      _this.green.state = state;
      arduino.digitalWrite(gn, state);
    };

    this.set = (which)=> {
      clearInterval(this.blinkInt);
      this.red(which == 'red');
      this.green(which == 'green');
    };

    this.blink = (which, int)=> {
      if (this[which]) {
        _this.blinkInt = setInterval(()=> {
          _this[which](!_this[which].state);
        }, int);
      }
    };

    this.stopBlink = ()=> clearInterval(this.blinkInt);

  };

  exports.exitLights = new StopLight(4, 3);
  exports.entranceLights = new StopLight(6, 5);

  exports.pollLight = new function () {
    var cInt = null;

    var pole = [7, 8, 9, 10, 15];
    var cArr = [[0, 1, 1, 1, 1],
                [0, 0, 1, 1, 1],
                [0, 0, 0, 1, 1],
                [0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
              ];

    var cCount = 0;

    this.setGreen = function () {
      for (let i = 0; i < 5; i++) {
        arduino.digitalWrite(pole[i], 0);
      }

      arduino.digitalWrite(8, 1);
    };

    this.setRed = function () {
      for (let i = 0; i < 5; i++) {
        arduino.digitalWrite(pole[i], 0);
      }

      arduino.digitalWrite(7, 1);
    };

    this.setStage = function (count) {
      for (let i = 0; i < 5; i++) {
        arduino.digitalWrite(pole[i], cArr[count][i]);
      }
    };

    this.blink = function () {
      cCount = 1;
      cInt = setInterval(()=> {
        for (let i = 1; i < 5; i++) {
          arduino.digitalWrite(pole[i], ((cCount) ? 1 : 0));
        }

        cCount = !cCount;
      }, 250);
    };

    this.stopBlink = function () {
      clearInterval(cInt);
    };
  };

  exports.onCageButtonPress = ()=> {};

  exports.onExitDoorOpen = ()=> {};

  exports.onPracticeCageMotionSensor = ()=> {};

  exports.onArduinoReady = ()=> {};

  arduino.onready = ()=> {
    // start the record countdown on button press.
    arduino.digitalWatch(2, exports.onCageButtonPress);

    // monitor the exit door sensor, and reset when it opens.
    arduino.digitalWatch(14, function (pin, state) {
      if (state) {
        exports.onExitDoorOpen();
      }
    });

    // watch the practice cage motion sensor
    arduino.digitalWatch(16, function (pin, state) {
      if (!state) {
        // console.log('practice cage occupied');
        // if (!audioPracticePlaying) {
        //   if (timeoutFlag) {
        //     console.log('show practive with audio');
        //     practiceThenGo(admitNext);
        //   } else if (!cageOccupied && !goShown) {
        //     admitNext();
        //   }
        // }
        exports.onPracticeCageMotionSensor();
      }
    });

    //idle();
    exports.onArduinoReady();
  };

  exports.playPractice = ()=> {
    arduino.digitalWrite(13, 0);
    setTimeout(() => {
      arduino.digitalWrite(13, 1);
    }, 100);
  };

  exports.playYourTurn = ()=> {
    arduino.digitalWrite(12, 0);
    setTimeout(() => {
      arduino.digitalWrite(12, 1);
    }, 100);
  };
});
