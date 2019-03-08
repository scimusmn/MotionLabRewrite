exports.config = {
  machine: {
    autostart: {
      env: '/usr/bin/env GENICAM_ROOT_V2_3=/opt/genicam2.3.1/',
    },
    gitWatch: true,
    preventSleep: true,
    // softShutdown: {
    //   monitorPin: 24,
    //   controlPin: 25,
    //   delayTime: 1000,
    // },
    // wifi: {
    //   ssid: 'SensorServer',
    //   password: 'defaultPass',
    // },
    // wifiHotspot: {
    //   ssid: 'Template',
    //   password: 'template!',
    //   domainName: 'template.net',
    // },
  },
};
