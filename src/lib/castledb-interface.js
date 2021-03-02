import { default as data } from '../../data/base.json';

function getPlanet(type) {
  return getSheet('planets').find((planet) => planet.type === type);
}

function getSheet(name) {
  return data.sheets.find((sheet) => sheet.name === name).lines;
}

function getStar(starClass) {
  return getSheet('stars').find((star) => star.class === starClass);
}

export {
  getPlanet,
  getSheet,
  getStar
};
