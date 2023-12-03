const fs = require('fs');

const lowerAndTrim = text => `${text || ''}`.trim().toLowerCase();
const xsleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const logRespOf = (resp) => console.log("@resp", JSON.stringify(resp, null, 2));
const writeRespOf = (resp, file) => fs.writeFileSync(['./response', file].join('/'), JSON.stringify(resp, null, 2));

const parseJson = text => {
  try {
    if (typeof next === 'object') return text;
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return null;
  }
}

const xhelpers = {
  lowerAndTrim,
  writeRespOf,
  logRespOf,
  parseJson,
  xsleep,
};

module.exports = xhelpers;