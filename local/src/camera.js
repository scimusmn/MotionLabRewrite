
var remote = require('electron').remote;

var config = remote.getGlobal('config');

var vieworks = require('bindings')('vieworks');

var requests = [
  './src/files.js',
];

if (!window.muse.app.camera) window.muse.app.camera = {
  cam: null,
};

var store = window.muse.app.camera;

obtain(requests, (files)=> {
  exports.init = (cb)=> {
    if (!store.cam) {
      store.cam = new vieworks.camera(()=> {
        store.cam.setFrameRate(config.cam.frameRate);
        store.cam.setImageGain(config.cam.imageGain);

        store.cam.allocateBuffer(2 * config.cam.frameRate * config.record.time);

        store.cam.startCapture(function (val) {
          store.cam.ready = true;
          //optionally draw the camera image. See appOld.js for details

        });

        if (cb) cb();
      });
    } else {
      if (store.cam.ready) cb();
    }
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

      cb();
    });
  };

});
