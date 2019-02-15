var requests = [
  './src/io.js',
  './src/camera.js',
  './src/audio.js',
];

obtain(requests, (io, camera, audio)=> {

  var idle = ()=> {
    timeoutFlag = true;
    cageReset();
    if (waitForSave) location.reload();
    io.entranceLights.set('red');
  };

  exports.showGo = ()=>{
    io.playYourTurn();
    goShown = true;
    setTimeout(() => {
      goShown = false;
    }, 17000);
  }

  exports.practiceThenGo = (fxn)=>{
    io.playPractice();
    console.log('practice audio');
    audioPracticePlaying = true;
    //resetIdleTimeout();
    setTimeout(() => {
      audioPracticePlaying = false;
      io.playYourTurn();
      if (fxn) fxn();
    }, 25000);
  }

  exports.onAppReady = ()=>{
    audio.load();
  }
});
