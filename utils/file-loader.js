const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  loadDirectoryScripts: (directory, callback, useAbsolutePath = true) => {
    const scriptPath = useAbsolutePath
      ? path.join(__dirname, "..", directory)
      : directory;
    const files = fs
      .readdirSync(scriptPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(scriptPath, file);
      const object = require(filePath);

      callback(object, filePath);
    }
  },
};
