const { sequelize, modelNames } = require("../database/instance.js");

const Test = {};

const resetTable = (modelName) => {
  if (!sequelize.models[modelName]) throw `modelName ${modelName} undefined`;
  return sequelize.models[modelName].sync({ force: true, logging: false });
};

Test.resetDb = async () => {
  let deferreds = [];
  modelNames.map((name) => {
    deferreds.push(resetTable(name));
  });
  return Promise.all(deferreds);
};

module.exports = Test;
