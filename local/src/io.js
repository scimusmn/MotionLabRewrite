var config = require('electron').remote.getGlobal('config');

var requests = [
  'µ/Arduino.js',
];

window.muse.app.io = {};
var store = window.muse.app.io;

obtain(requests, ({ Arduino })=> {

  if (!store.arduino) {
    store.arduino = new Arduino(config.io);
    var arduino = store.arduino;

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
        if (_this[which]) {
          clearInterval(_this.blinkInt);
          _this.blinkInt = setInterval(()=> {
            _this[which](!_this[which].state);
          }, int);
        }
      };

      this.stopBlink = ()=> clearInterval(this.blinkInt);

    };

    store.exitLights = new StopLight(4, 3);
    store.entranceLights = new StopLight(6, 5);

    store.pollLight = new function () {
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

    store.onCageButtonPress = ()=> {};

    store.onExitDoorOpen = ()=> {};

    store.onPracticeCageMotionSensor = ()=> {};

    store.onArduinoReady = ()=> {};

    arduino.onready = ()=> {
      // start the record countdown on button press.
      arduino.digitalWatch(2, (pin, state)=> {
        if (!state) store.onCageButtonPress();
      });

      // monitor the exit door sensor, and reset when it opens.
      arduino.digitalWatch(14, function (pin, state) {
        if (state) {
          store.onExitDoorOpen();
        }
      });

      // watch the practice cage motion sensor
      arduino.digitalWatch(16, function (pin, state) {
        if (!state) {
          store.onPracticeCageMotionSensor();
        }
      });

      store.onArduinoReady();
    };

    store.playPractice = ()=> {
      arduino.digitalWrite(13, 0);
      setTimeout(() => {
        arduino.digitalWrite(13, 1);
      }, 100);
    };

    store.playYourTurn = ()=> {
      arduino.digitalWrite(12, 0);
      setTimeout(() => {
        arduino.digitalWrite(12, 1);
      }, 100);
    };
  }

  module.exports = store;
});
