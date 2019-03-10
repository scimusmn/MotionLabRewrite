module.exports = {
  showDevTools: true,
  cam: {
    frameRate: 200,
    imageGain: 24,
  },
  record: {
    time: 3,
    setsToStore: 16,
  },
  brightsign: {
    practiceVideoLength: 25000,
    goVideoLength: 17000,
  },
  io: {
    manufacturer: 'FTDI',
  },
  // windows: [
  //   {
  //     label: 'main',
  //     fullscreen: false,
  //     alwaysOnTop: false,
  //     //displayId: '69733248', //manually specify
  //     file: 'app/local/index.html',
  //   },
  // ],
};
