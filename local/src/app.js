
'use strict';

////////////////////////////////////////////////////////////////////////
// ######################## Require libraries ##########################
////////////////////////////////////////////////////////////////////////

var remote = require('electron').remote;

var process = remote.process;

//grab the config file from the main electron process
var config = remote.getGlobal('config');
var appRoot = remote.getGlobal('appRoot');

window.muse.app = {};

var requests = [
  './src/flow.js',
  './src/files.js',
  'µ/server/socket.js',
  'µ/server/express.js',
  'path',
];

obtain(requests, (flow, files, { wss }, fileServer, path)=> {

  exports.app = {};

  //setup what happens when a websocket client connects
  wss.onClientConnect(({ ws })=> {
    console.log(ws);

    //get a current listing of all the files in the celeb and visitor folders
    var seqs = files.getFiles(`${appRoot}/app/common/captures/visitors/`);
    var cels = files.getFiles(`${appRoot}/app/common/captures/celebs/`);

    //and send the folder names to the client
    seqs.forEach(seq=>ws.sendPacket('seq', '/common/captures/visitors/' + seq));
    cels.forEach(cel=>ws.sendPacket('cel', '/common/captures/celebs/' + cel));

    //if we get a delete request from a client, delete the specified folder, and reload clients
    ws.addListener('delete', ({ data })=> {
      files.deleteFolder(data);
      wss.broadcast('reload', '1');
    });
  });

  //when a new set is saved by the camera, broadcast the set name to the clients
  flow.onSave = (dir)=> {
    wss.broadcast('seq', dir);
  };

  exports.app.start = ()=> {

    //run the AppReady function from flow.js
    flow.onAppReady();
    console.log('app start');

    //grab the elements for the start and save buttons
    var startBut = µ('#start');
    var saveBut = µ('#save');

    //if the save button is clicked, and we've recorded at least once, copy to the
    //specified directory.
    saveBut.onclick = (e)=> {
      if (flow.lastVideo) {
        files.copyFolder(
          `${appRoot}/app/common/captures/visitors/${flow.lastVideo}`,
          `${appRoot}/app/common/captures/celebs/${µ('#folder').value}`
        );
      }

      //save(µ('#folder').value, true);
    };

    startBut.onclick = ()=> {
      flow.startCountdown();
    };
  };
});



/////////////////////////////////////////////////////////////////////////////
//############################ Keyboard input ###############################
/////////////////////////////////////////////////////////////////////////////

document.onkeypress = (e) => {
  var press = String.fromCharCode(e.keyCode);
  if (press == 'g') {
    //showGo();
  } else if (press == 'c') flow.startCountdown();
  else if (press == 'r') {
    if (wss) wss.broadcast('reload');
  }
};
