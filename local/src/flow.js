var config = require('electron').remote.getGlobal('config');

var requests = [
  //'./src/io.js',
  './src/camera.js',
  './src/audio.js',
];

if(!window.muse.app.flow) window.muse.app.flow = {
  idleTO: null,
  idling: false,
  cageOccupied: false,
  waitingForSave: false,
  goShown: false,
};
var store = window.muse.app.flow;

obtain(requests, ( camera, audio)=> {

  /////////////////////////////////////////////////////////////////////////////
  //####################### brightsign interactions ###########################
  /////////////////////////////////////////////////////////////////////////////

  var showGo = ()=>{
    io.playYourTurn();
    store.goShown = true;
    setTimeout(() => {
      store.goShown = false;
    }, config.brightsign.goVideoLength);
  }

  var practiceThenGo = (fxn)=>{
    io.playPractice();
    store.waitForPractice = true;
    //delayIdleMode();
    setTimeout(() => {
      store.waitForPractice = false;
      showGo();
      if (fxn) fxn();
    }, config.brightsign.practiceVideoLength);
  }

  /////////////////////////////////////////////////////////////////////////////
  //########################## visitor flow ###################################
  /////////////////////////////////////////////////////////////////////////////

  var cageReset = ()=> {
    store.cageOccupied = false;
    io.exitLights.blink('red', 500);
  };

  var startIdleMode = ()=> {
    store.idling = true;
    cageReset();
    if (store.waitingForSave) location.reload();
    io.entranceLights.set('red');
  };

  let delayIdleMode = () => {
    store.idling = false;
    if (store.idleTO) clearTimeout(store.idleTO);
    store.idleTO = setTimeout(startIdleMode, 60000);
  };

  var admitNext = ()=> {
    io.playYourTurn();
    delayIdleMode();
    io.exitLights.blink('red', 500);
    io.entranceLights.set('green');
  };

  /////////////////////////////////////////////////////////////////////////////
  //########################## countdown handlers #############################
  /////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////
  // Handle countdown and manage the lights and audio.
  // also manage the actual recording of images.

  var countdown = (count) => {
    pollLight.setStage(count);

    audio[count].currentTime = 0;
    audio[count].play();

    if (count > 0) {
      if (count == 1) cam.capture();
      setTimeout(() => { countdown(count - 1); }, 1000);
    } else {
      audio.click.currentTime = 0;
      audio.click.play();

      pollLight.blink();

      setTimeout(function () {
        io.pollLight.stopBlink();
        io.pollLight.setRed();
        io.exitLights.blink('green', 500);

        audio.exit.play();

        var dir = './app/sequences/temp' + dirNum++;
        if (dirNum >= config.record.setsToStore) dirNum = 0;

        camera.endCapture(dir, ()=>{
          exports.onSave();
        });

      }, config.record.time);
    }
  };

  exports.startCountdown = ()=> {
    if (camera.base.ready && !store.waitingForSave && !store.cageOccupied) {
      store.waitingForSave = true;
      store.cageOccupied = true;

      delayIdleMode();
      audioPracticePlaying = false;
      clearInterval(blinkInt);
      countdown(5);

      exitLights.set('off');
      entranceLights.set('red');
    }

  };

  /////////////////////////////////////////////////////////////////////////////
  //########################## io event handlers ##############################
  /////////////////////////////////////////////////////////////////////////////

  io.onCageButtonPress = ()=>{
    exports.startCountdown();
  }

  io.onExitDoorOpen = ()=>{
    setTimeout(cageReset,1000);
  }

  io.onPracticeCageMotionSensor = ()=>{
    console.log('practice cage occupied');
    if (!store.waitForPractice) {
      if (store.idling) {
        practiceThenGo(admitNext);
      } else if (!store.cageOccupied && !store.goShown) {
        admitNext();
      }
    }
  }

  io.onArduinoReady = ()=>{
    startIdleMode();
  }

  exports.onSave = ()=>{
  }

  exports.onAppReady = ()=>{
    audio.load();
  }
});
