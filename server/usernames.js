const fs = require("fs");
let namesSet = new Set();
const filename = "rawNames.json";

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
    namesSet.add(newNames[i]);
  }

  return namesSet;
};

const fetchSet = () => {
  return readFromFile(filename);
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
