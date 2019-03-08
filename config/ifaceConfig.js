global.obtain = (addr, func)=> {
  if (addr.length <= 0) func();
  else func.apply(null, addr.map(adr=>require(adr)));
};

obtain(['fs', `${__dirname}/../../configurator/src/utils.js`], (fs, utils)=> {

  var opts = process.argv;

  var cam = (~opts.indexOf('--cam')) ? opts[opts.indexOf('--cam')] : 'eth0';
  var net = (~opts.indexOf('--net')) ? opts[opts.indexOf('--net')] : 'eth1';

  console.log('setting netplan config...');

  utils.copyConfigFile(`${__dirname}/netplan.yaml`,
                        '/etc/netplan/01-netcfg.yaml',
                        { NET_IFACE: net, CAM_IFACE: cam });

});
