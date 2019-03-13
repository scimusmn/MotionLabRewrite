var requests = [
  'fs',
  'child_process',
];

var store = window.muse.app.camera;

obtain(requests, (fs, { execSync })=> {
  exports.deleteFolder = (folderName)=> {
    if (fs.existsSync(folderName)) execSync(`rm -rf ${folderName}`);
  };

  exports.makeFolder = folderName=>fs.mkdirSync(folderName);

  exports.touchFolder = folderName => fs.utimesSync(folderName, Date.now(), Date.now()));

  exports.copyFolder = (src, dest)=> {
    execSync(`cp ${src} ${dest}`);
  };

  var getModTime = name=>fs.statSync(name).atime.getTime();

  exports.getFiles = (dir) => {
    console.log(dir);
    if (fs.existsSync(dir)) {
      var files = fs.readdirSync(dir);

      //rearrange files by modification date
      files.sort((a, b)=>getModTime(dir + a) - getModTime(dir + b));

      return files;
    } else return [];

  };
});
