const fs = require("fs");
let namesSet = new Set();
const filename = "rawNames.json";
var Filter = require('bad-words'),
    filter = new Filter();

const writeToFile = (namesSet, filename) => {
  let data = JSON.stringify(Array.from(namesSet));
  fs.writeFileSync(filename, data);
  return data;
};

const readFromFile = (filename) => {
  let rawJSON = fs.readFileSync(filename);
  return new Set(JSON.parse(rawJSON));
};

const modifyNames = (newNames) => {
  for (let i = 0; i < newNames.length; i++) {
    namesSet.add(filter.clean(newNames[i]));
  }

  return namesSet;
};

const fetchSet = () => {
  return Array.from(readFromFile(filename));
};

const workflow = (newHandles) => {
  try {
    namesSet = readFromFile(filename);
    namesSet = modifyNames(newHandles);
    writeToFile(namesSet, filename);
    return namesSet;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { fetchSet, workflow };
