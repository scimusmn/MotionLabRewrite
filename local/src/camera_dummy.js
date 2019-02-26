
var remote = require('electron').remote;

var config = remote.getGlobal('config');

var requests = [
  './src/files.js',
];

if (!window.muse.app.camera) window.muse.app.camera = {
  cam: {
    capture: ()=> {},

    stopCapture: ()=> {},

    save: (folder, cb)=> {
      cb();
    },
  },
};

var store = window.muse.app.camera;

obtain(requests, (files)=> {
  exports.init = (cb)=> {
    store.cam.ready = true;
    cb();
  };

  exports.isReady = ()=>store.cam.ready;

  exports.base = store.cam;

  exports.capture = store.cam.capture;

  exports.endCapture = (folderName, onSave)=> {
    store.cam.stopCapture();

    files.deleteFolder(folderName);//deleteFolderRecursive(dir);
    files.makeFolder(folderName);
    store.cam.save(folderName, function () {
      files.touchFolder(folderName);
      store.cam.ready = true;

      onSave();
    });
  };

});
