'use strict';

if (!window.muse.app.audio) window.muse.app.audio = {
  byIndex: [],
  click: null,
  exit: null,
  ready: null,
  load: ()=> {},
};
var store = window.muse.app.audio;

module.exports = store;

obtain([], ()=> {
  exports.load = ()=> {
    store.byIndex.length = 0;

    var lastAudio = ()=>store.byIndex[store.byIndex.length - 1];

    store.click = document.querySelector('#click');
    store.click.load();

    store.ready = µ('#getReady');
    store.ready.load();
    store.ready.volume = 0.75;

    store.exit = document.querySelector('#exit');
    store.exit.load();
    store.exit.volume = 0.75;

    for (var i = 0; i < 4; i++) {
      store.byIndex.push(document.querySelector('#audio_' + (i)));
      lastAudio().load();
    }

    store.byIndex.push(getReady);

  };
});
