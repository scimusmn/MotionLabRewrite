global.obtain = (addr, func)=> {
  if (addr.length <= 0) func();
  else func.apply(null, addr.map(adr=>require(adr)));
};

obtain(['fs', `${__dirname}/../../configurator/src/utils.js`], (fs, utils)=> {

  var args = (key)=>(~process.argv.indexOf(key)) ? process.argv[process.argv.indexOf(key) + 1] : false;

  var opts = process.argv;

  var cam = (args('--cam')) ? args('--cam') : 'eth0';
  var net = (args('--net')) ? args('--net') : 'eth1';

  console.log('setting netplan config...');

  utils.copyConfigFile(`${__dirname}/netplan.yaml`,
                        '/etc/netplan/01-netcfg.yaml',
                        { NET_IFACE: net, CAM_IFACE: cam });

});
