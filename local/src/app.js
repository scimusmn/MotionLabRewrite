
'use strict';

////////////////////////////////////////////////////////////////////////
// ######################## Require libraries ##########################
////////////////////////////////////////////////////////////////////////

var remote = require('electron').remote;

var process = remote.process;

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

  wss.onClientConnect(({ ws })=> {
    console.log(ws);

    var seqs = files.getFiles(`${appRoot}/app/common/captures/visitors/`);
    var cels = files.getFiles(`${appRoot}/app/common/captures/celebs/`);

    seqs.forEach(seq=>ws.sendPacket('seq', '/common/captures/visitors/' + seq));
    cels.forEach(cel=>ws.sendPacket('cel', '/common/captures/celebs/' + cel));

    ws.addListener('delete', ({ data })=> {
      files.deleteFolder(data);
      wss.broadcast('reload', '1');
    });
  });

  flow.onSave = (dir)=> {
    wss.broadcast('seq', dir);
  };

  exports.app.start = ()=> {
    flow.onAppReady();
    console.log('app start');

    var startBut = µ('#start');
    var saveBut = µ('#save');

    saveBut.onclick = (e)=> {
      if (flow.lastVideo) {
        files.copyFolder(
          `${appRoot}/app/common/captures/visitors/${flow.lastVideo}`,
          `${appRoot}/app/common/captures/celebs/${µ('#folder').value}`
        );
      }

      save(µ('#folder').value, true);
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
    showGo();
  } else if (press == 'c') startCntdn();
  else if (press == 'r') {
    if (wss) wss.broadcast('reload');
  }
};
