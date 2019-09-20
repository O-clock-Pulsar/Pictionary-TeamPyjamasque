const fs = require('fs');

const copyFiles = (error, files) => {
  if (error) {
    console.log(error);
    return;
  }

  const filteredFiles = files;
  const indexOfCurrentFile = files.indexOf('init.js');
  filteredFiles.splice(indexOfCurrentFile,
1);

  files.forEach((file) => {
    fs.copyFile(
      `${__dirname}/${file}`,
      `${__dirname}/../.git/hooks/${file}`,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            `${file} successfully copied to ${__dirname}/../.git/hooks/${file}`,
          );
        }
      },
    );
  });
};

fs.readdir(__dirname, copyFiles);
