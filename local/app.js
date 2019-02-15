
'use strict';

////////////////////////////////////////////////////////////////////////
// ######################## Require libraries ##########################
////////////////////////////////////////////////////////////////////////

var vieworks = require('bindings')('vieworks');

var requests = [
  'µ/Arduino.js',
  './config.js',
  'fs',
  './src/MuseServer/wsServer.js',
  './src/MuseServer/express.js',
];

obtain(requests, (Arduino, config, fs, { wss }, express)=> {

  exports.app = {};


  // create the flags used to control the flow of operation
  var timeoutFlag = true;
  var blinkInt = null;
  var blinkBool = 1;

  var redInt = null;

  let idleTO = null;
  var dirNum = 0;

  var goShown = false;
  var audioPracticePlaying = false;

  var goTimeout = null;

  var waitForSave = false;
  var cageOccupied = false;

  exports.app.start = ()=> {

    ////////////////////////////////////////////////////////////////////////
    // ################### Set arduino onready handler  ################# //
    ////////////////////////////////////////////////////////////////////////

    arduino.onready = ()=> {
      console.log('Connected to Arduino');

      // start the record countdown on button press.
      arduino.digitalWatch(2, window.startCntdn);

      // monitor the exit door sensor, and reset when it opens.
      arduino.digitalWatch(14, function (pin, state) {
        if (state) {
          setTimeout(cageReset, 1000);
        }
      });

      // watch the practice cage motion sensor
      arduino.digitalWatch(16, function (pin, state) {
        if (!state) {
          console.log('practice cage occupied');
          if (!audioPracticePlaying) {
            if (timeoutFlag) {
              console.log('show practive with audio');
              practiceThenGo(admitNext);
            } else if (!cageOccupied && !goShown) {
              admitNext();
            }
          }
        }
      });

      idle();
    };

    ////////////////////////////////////////////////////////////////////////
    // ################### Create camera and initialize ################# //
    ////////////////////////////////////////////////////////////////////////

    var cam = new vieworks.camera(()=> {
      cam.setFrameRate(200);
      cam.setImageGain(24);

      cam.allocateBuffer(1600);

      cam.startCapture(function (val) {
        cam.ready = true;
        //optionally draw the camera image. See appOld.js for details
      });

      output.textContent = 'Ready to record';
    });

    ////////////////////////////////////////////////////////////////////////
    // ########################### Audio files ############################
    ////////////////////////////////////////////////////////////////////////

    let clickTrack = document.querySelector('#click');
    clickTrack.load();

    let getReady = document.querySelector('#getReady');
    getReady.load();

    getReady.volume = .75;

    let exitTrack = document.querySelector('#exit');
    exitTrack.load();

    exitTrack.volume = .75;

    let audio = [];

    for (var i = 0; i < 4; i++) {
      audio.push(document.querySelector('#audio_' + (i)));
      audio[i].load();
    }
  };
});



////////////////////////////////////////////////////////////////////////
// ########################### Declarations ############################
////////////////////////////////////////////////////////////////////////

var idle = ()=> {
  timeoutFlag = true;
  cageReset();
  if (waitForSave) location.reload();
  redEntranceLight(1);
  greenEntranceLight(0);
};

let resetIdleTimeout = () => {
  timeoutFlag = false;
  if (idleTO) clearTimeout(idleTO);
  idleTO = setTimeout(idle, 60000);
};

var output = document.querySelector('#output');


////////////////////////////////////////////////////////////////////////
// ############### Practice Cage brightsign triggers ###################
////////////////////////////////////////////////////////////////////////

// window.loopPractice = () => {
//   arduino.digitalWrite(13, 0);
//   console.log('Loop practice');
//   setTimeout(() => {
//     arduino.digitalWrite(13, 1);
//   }, 100);
// };
//
// window.showGo = () => {
//   arduino.digitalWrite(12, 0);
//   console.log('Show go');
//   goShown = true;
//   setTimeout(() => {
//     arduino.digitalWrite(12, 1);
//     setTimeout(() => {
//       goShown = false;
//       //loopPractice();
//     }, 17000);
//   }, 100);
// };
//
// window.practiceThenGo = (fxn) => {
//   arduino.digitalWrite(13, 0);
//   console.log('practice audio');
//   audioPracticePlaying = true;
//   //resetIdleTimeout();
//   setTimeout(() => {
//     arduino.digitalWrite(13, 1);
//     goTimeout = setTimeout(() => {
//       audioPracticePlaying = false;
//       showGo();
//       if (fxn) fxn();
//     }, 25000);
//   }, 100);
// };

////////////////////////////////////////////////////////////////////////
// ######################## File manipulation ####################### //
////////////////////////////////////////////////////////////////////////

var deleteFolderRecursive = function (path) {
  if (path && fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(path);
  }
};

window.save = (dir, saveOther) => {
  if (fs.existsSync(dir)) deleteFolderRecursive(dir);
  fs.mkdirSync(dir);
  output.textContent = 'Saving...';
  cam.save(dir, function () {
    output.textContent = 'Done Saving.';
    //force folder to update it's modification time.
    fs.utimesSync(dir, NaN, NaN);
    //console.log('seq=' + dir.replace('./app/',''));
    //var num = fs.readdirSync('sequences/temp' + (dirNum - 1)).length;
    if (wss && !saveOther) wss.broadcast('seq=' + dir.replace('./app/', ''));
    console.log('saved to ' + dir);
    cam.ready = true;
    waitForSave = false;
  });
};

var countdown = (count) => {
  pollLight.setStage(count);

  if (count > 0) {
    output.textContent = count;
    if (count < 4) {
      audio[count].currentTime = 0;
      audio[count].play();
    }

    setTimeout(() => { countdown(count - 1); }, 1000);
    if (count == 1) cam.capture();
    else if (count == 5) getReady.play();
  } else {
    output.textContent = 'Recording...';
    audio[count].currentTime = 0;
    audio[count].play();
    clickTrack.currentTime = 0;
    clickTrack.play();
    pollLight.blink();
    console.log('start capture');

    setTimeout(function () {
      exitTrack.play();
      output.textContent = 'Done Recording';
      cam.stopCapture();
      pollLight.stopBlink();
      pollLight.setRed();
      console.log('done capturing');
      var dir = './app/sequences/temp' + dirNum++;
      if (dirNum >= cfg.setsToStore) dirNum = 0;
      greenExitLight(1);
      blinkInt = setInterval(()=> {
        blinkBool = !blinkBool;
        greenExitLight((blinkBool) ? 1 : 0);
      }, 500);
      clearInterval(redInt);
      redExitLight(0);
      save(dir);
    }, cfg.recordTime);
  }
};

window.resetCam = function () {
  waitForSave = false;
};

window.startCntdn = function (pin, state) {
  if (!state && cam.ready && !waitForSave && !cageOccupied) {
    //timeoutFlag = false;
    resetIdleTimeout();
    clearTimeout(goTimeout);
    audioPracticePlaying = false;
    clearInterval(blinkInt);
    waitForSave = true;
    cageOccupied = true;
    countdown(5);
    greenExitLight(0);
    clearInterval(redInt);
    redExitLight(0);
    greenEntranceLight(0);
    redEntranceLight(1);
  }

};

var startBut = document.querySelector('#start');
var saveBut = document.querySelector('#save');

saveBut.onclick = (e)=> {
  save(document.querySelector('#folder').value, true);
};

startBut.onclick = ()=> {
  cageOccupied = false;
  window.startCntdn();
};

window.admitNext = ()=> {
  showGo();
  resetIdleTimeout();
  greenExitLight(0);
  clearInterval(redInt);
  redInt = setInterval(()=> {
    blinkBool = !blinkBool;
    redExitLight((blinkBool) ? 1 : 0);
  }, 500);
  clearInterval(blinkInt);
  greenEntranceLight(1);
  redEntranceLight(0);
};

var cageReset = ()=> {
  cageOccupied = false;
  greenExitLight(0);
  clearInterval(redInt);
  redInt = setInterval(()=> {
    blinkBool = !blinkBool;
    redExitLight((blinkBool) ? 1 : 0);
  }, 500);
  clearInterval(blinkInt);
};

/////////////////////////////////////////////////////////////////////////////
//####################### Arduino Declarartions #############################
/////////////////////////////////////////////////////////////////////////////

arduino.connect(cfg.portName, function () {
  console.log('Connecting to Arduino');
  //pollLight.setStage(4);

  arduino.watchPin(2, window.startCntdn);

  arduino.watchPin(14, function (pin, state) {
    console.log(state + ' is the current state on ' + pin);
    if (state) {
      setTimeout(cageReset, 1000);
    }
  });

  arduino.watchPin(16, function (pin, state) {
    if (!state) {
      console.log('practice cage occupied');
      if (!audioPracticePlaying) {
        if (timeoutFlag) {
          console.log('show practive with audio');
          practiceThenGo(admitNext);
        } else if (!cageOccupied && !goShown) {
          admitNext();
        }
      }
    }
  });

  console.log('arduino start');

  /*greenExitLight(0);
  //redExitLight(1);
  clearInterval(redInt);
  redInt = setInterval(()=>{
    blinkBool = !blinkBool;
    redExitLight((blinkBool)?1:0);
  },500);
  greenEntranceLight( 1);
  redEntranceLight( 0);*/

  idle();
});

/////////////////////////////////////////////////////////////////////////////
//############################ File Handling ################################
/////////////////////////////////////////////////////////////////////////////

function readDir(path) {
  var files = fs.readdirSync(path);

  files.sort(function (a, b) {
    return fs.statSync('./' + path + a).atime.getTime() - fs.statSync('./' + path + b).atime.getTime();
  });

  for (var i = 0; i < files.length; i++) {
    files[i] = path + files[i];
  }

  return files;
}

//Tell the wsServer what to do on connnection to a client;

wss.on('connection', function (ws) {

  var files = readDir('app/sequences/');
  var celFiles = readDir('app/celeb_seq/');
  if (ws) {
    for (var i = 0; i < files.length; i++) {
      //var num = fs.readdirSync(files[i]).length;
      ws.send('seq=' + files[i].substring(4));
    }

    for (var i = 0; i < celFiles.length; i++) {
      //var num = fs.readdirSync(celFiles[i]).length;
      ws.send('cel=' + celFiles[i].substring(4));
    }
  }

  ws.on('message', function (message) {
    switch (message.split('=')[0]){
      case 'del':
        console.log('deleting folder ' + message.split('=')[1]);
        deleteFolderRecursive('app/' + message.split('=')[1] + '/');
        wss.broadcast('reload');
        //
        break;
    }
  });

  ws.on('close', function () {
    webSock = null;
  });

  ws.on('error', function (error) {
    webSock = null;
    console.log('Error: ' + error);
  });
});

/////////////////////////////////////////////////////////////////////////////
//############################ Keyboard input ###############################
/////////////////////////////////////////////////////////////////////////////

document.onkeypress = (e) => {
  var press = String.fromCharCode(e.keyCode);
  if (press == 'g') {
    showGo();
  } else if (press == 'c') startCntdn();
  else if (press == 'r') {
    if (wss) wss.broadcast('reload');
  }
};
