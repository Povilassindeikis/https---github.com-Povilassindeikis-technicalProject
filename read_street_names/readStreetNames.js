const fs = require("fs");
const readline = require("readline");

/*
Display all the different street names from this JSON file
https://raw.githubusercontent.com/zemirco/sf-city-lots-json/master/citylots.json

*/

const street_names = [];

const parseStreetName = (line) => {
  const street = line.split('STREET": "')[1];
  if (street != undefined) {
    return street.split('"')[0];
  }
  return;
};

const rl = readline.createInterface({
  input: fs.createReadStream("citylots.json"),
  crlfDelay: Infinity,
});

rl.on("line", (line) => {
  const streetName = parseStreetName(line);
  if (streetName && !street_names.includes(streetName)) {
    street_names.push(streetName);
  }
});

rl.on("close", function () {
  console.table(street_names);
});
