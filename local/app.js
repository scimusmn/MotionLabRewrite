
'use strict';

////////////////////////////////////////////////////////////////////////
// ######################## Require libraries ##########################
////////////////////////////////////////////////////////////////////////

var remote = require('electron').remote;

var process = remote.process;

var config = remote.getGlobal('config');

window.muse.app = {};

var requests = [
  './src/flow.js',
  './src/files.js',
  'µ/server/socket.js',
  'µ/server/files.js',
];

obtain(requests, (flow, files, { wss }, fileServer)=> {

  exports.app = {};

  fileServer.base.use('', express.static(path.join(__dirname, '../client')));
  fileServer.base.use('/common', express.static(path.join(__dirname, '../common')));

  wss.onClientConnect((ws)=> {
    var seqs = files.getFiles('app/sequences/');
    var cels = file.getFiles('app/celeb_seq/');

    seqs.forEach(seq=>ws.sendPacket('seq', seq));
    cels.forEach(cel=>ws.sendPacket('cel', cel));

    ws.addListener('delete', ({ data })=> {
      files.deleteFolder(data);
      wss.broadcast('reload', '1');
    });
  });

  exports.app.start = ()=> {
    flow.onAppReady();
  };
});

// var startBut = document.querySelector('#start');
// var saveBut = document.querySelector('#save');
//
// saveBut.onclick = (e)=> {
//   save(document.querySelector('#folder').value, true);
// };
//
// startBut.onclick = ()=> {
//   cageOccupied = false;
//   window.startCntdn();
// };

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
