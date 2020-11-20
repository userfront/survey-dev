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

Test.rsaPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDMb8XUyMG7SkLKImwog14vQKFVZ5/PPTrFOffcmSxj3VKn6N0C
OfLfA/e6Yy4VgXPYrRAHMEFwDieuZkoS+wuRztOYIoAmS7F8wft1WRHJo56OqDtc
WyCcttWMB0Ol7QrWM/z69+hmRUJJg2IU33tcLOPk/UonF7GA4iarEPQeBQIDAQAB
AoGBAKemQaXtvHHKxFrfP7M5h9NYPPW8tOFOZRO4JftR4YVDyrTH0fYxb2pT5qOD
EhewwT+/LJW4jPFHqmLqn3RRS3oemUruclOhnb19ykGPr+xbLFaPOrZkn8zIxUJU
g7o4InUno9wpz/opCXr0juZOLshxTWsCnfchEmSbdnhEvYYBAkEA+Evni9hrAf4m
W7/ifJNWezDE6jAi5FMQ8IQOhEPBiTf42fspZ8GoaF1UzBT0hycOapADdMR9D824
eWBsaEOWuQJBANLHgtLgbJ38WpzDsYcgzX5unj7qC4K9J0jwHPqzm9rO6ht4KNaX
Np4nUY2Q0/5MHgybifbWBcvJ1+QI1liP260CQQDDtsD6wEoIthXyOBwEafa+/8AX
gH3gT4GIs+7lXqsMyCvFVm5atJFUQkz22IWuiqCYao/u2HpjnJqOQezxemUxAkAp
vwIWKgTZNYXszoV2sfSBOf91jn1BI52IQKY8sR4JNDoBvsa32bMjl737P9f84a6B
6LxmevUi65MqwuVRHQzxAkEA4oY1Tez0dOBnwAvlO/f7by6CroSBl3ITvGFc3Vh6
++EpdjO7hf0lJC0/21rIMxp94J9b0l+y04Fl4p+aGfsUhA==
-----END RSA PRIVATE KEY-----`;

module.exports = Test;
