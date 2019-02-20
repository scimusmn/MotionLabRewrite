
'use strict';

////////////////////////////////////////////////////////////////////////
// ######################## Require libraries ##########################
////////////////////////////////////////////////////////////////////////

var remote = require('electron').remote;

var process = remote.process;

var config = remote.getGlobal('config');

window.muse.app = {};

var requests = [
  //'./src/flow.js',
  './src/files.js',
  'µ/server/socket.js',
  'µ/server/express.js',
  'path',
];

obtain(requests, (files, { wss }, fileServer, path)=> {

  exports.app = {};

  console.log(path.join(__dirname + '/../client'));

  fileServer.staticRoute('/', path.join(__dirname + '/../client'));
  fileServer.staticRoute('/common', __dirname + '/../common');

  //fileServer.base.use('', fileServer.express.static(path.join(__dirname, '../client')));
  //fileServer.base.use('/common', fileServer.express.static(path.join(__dirname, '../common')));

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
    //flow.onAppReady();
    console.log('app start');
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
