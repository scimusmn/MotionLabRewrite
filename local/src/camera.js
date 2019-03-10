
var remote = require('electron').remote;

var config = remote.getGlobal('config');

var vieworks = require('bindings')('vieworks');

var requests = [
  './src/files.js',
];

if (!window.muse.app.camera) window.muse.app.camera = {
  cam: {
    capture: ()=> {},
  },
};

var store = window.muse.app.camera;

obtain(requests, (files)=> {
  exports.init = (cb)=> {
    if (!store.cam.startCapture) {
      store.cam = new vieworks.camera(()=> {
        console.log('created camera objects');
        store.cam.setFrameRate(config.cam.frameRate);
        store.cam.setImageGain(config.cam.imageGain);

        store.cam.allocateBuffer(2 * config.cam.frameRate * config.record.time);

        store.cam.startCapture(function (val) {
          store.cam.ready = true;
          console.log('camera is ready');
          //optionally draw the camera image. See appOld.js for details

          var pre = document.querySelector('#predraw');
          var can = document.querySelector('#display');

          if (config.cam.livePreview) {
            var ctx = can.getContext('2d');
            var ptx = pre.getContext('2d');

            var w = Math.ceil(cam.getWidth());
            var h = Math.ceil(cam.getHeight());
            console.log(w + ' is w and h is ' + h);
            can.width = h;
            can.height = w;

            pre.width = w;
            pre.height = h;

            setInterval(()=> {
              if (!cam.isCapturing()) {
                var t = cam.getImage(function (t) {
                  if (t && t.length >= w * h * 3) {
                    var im = ptx.createImageData(w, h);
                    var con = new Uint8ClampedArray(w * h * 4);
                    for (let i = 0, j = 0; j < t.length; i += 4, j += 3) {
                      con[i] = t[j + 2];
                      con[i + 1] = t[j + 1];
                      con[i + 2] = t[j];
                      con[i + 3] = 255;
                    }

                    im.data.set(con);
                    ptx.fillStyle = 'black';
                    ptx.putImageData(im, 0, 0);

                    ctx.save();
                    ctx.translate(can.width / 2, can.height / 2);
                    ctx.rotate(Math.PI / 2);
                    ctx.drawImage(pre, -pre.width / 2, -pre.height / 2);
                    //ctx.drawImage(pre,-320,-240);
                    ctx.restore();
                  }
                });
              }
            }, 50);
          }
        });

        if (cb) cb();

        exports.capture = store.cam.capture;
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

      onSave();
    });
  };

});
