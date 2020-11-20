## Start with Create React App

https://create-react-app.dev/docs/getting-started/

```
npx create-react-app survey-dev
cd survey-dev
npm start
```

![Create React App](https://res.cloudinary.com/component/image/upload/v1603496124/permanent/survey-tutorial-0.png)

## Add survey-react

https://surveyjs.io/Documentation/Library

```
npm install survey-react --save
```

Add questions.js

Update App.js

```js
// App.js
import * as Survey from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

Survey.StylesManager.applyTheme("modern");
const survey = new Survey.Model(questions);
survey.onComplete.add(function (result) {
  console.log(result.data);
});

function App() {
  return (
    <div className="App">
      <Survey.Survey model={survey} />
    </div>
  );
}

export default App;
```

## Add backend server

```
npm install express --save
touch server.js
```

```js
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));

app.all("/survey-responses", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/survey-responses", function (req, res) {
  return res.send("Coming soon");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`✅  Backend listening on port ${port}`)
);

module.exports = server;
```

Add to package.json:

```json
"proxy": "http://localhost:5000"
```

We also want our backend server to automatically reload any changes we make, and we can use `nodemon` to accomplish this during development.

```
npm install nodemon --save-dev
```

Now in one terminal, you can run `npm run serve` to start the frontend on localhost:3000. In another terminal you can run `nodemon server.js` to start the backend on localhost:5000.

With both of these running, visiting http://localhost:3000 should show the survey, and visiting http://localhost:5000/survey-responses should return "Coming soon".

### A note about servers

At this point, we have 2 servers running locally:

| Location              | Tech             | Command           | Purpose                                          |
| --------------------- | ---------------- | ----------------- | ------------------------------------------------ |
| http://localhost:3000 | Create React App | npm start         | Serve the hot-reloaded React files.              |
| http://localhost:5000 | Express.js       | nodemon server.js | Receive API requests and interact with database. |

In production, we will only use the Express server; it will serve both the API and the files for our frontend React application. The React files will be added to a new `/build` folder during deploy.

These lines in `server.js` will be responsible for serving the compiled React assets when in production:

```js
// server.js
// Serve assets in the /build folder
app.use(express.static(path.join(__dirname, "build")));

...

// Serve the /build/index.html file when the "/" path is requested
app.get("/", async (req, res) => {
  return res.sendFile(path.join(__dirname, "build", "index.html"));
});
```

## Add a database connection

Will be using Sequelize to connect to a Postgres database instance.

https://sequelize.org/master/manual/getting-started.html

```
npm install sequelize pg pg-hstore lodash dotenv --save
```

### Create the database

Download https://www.postgresql.org/download/

Install `psql`

```
psql
CREATE DATABASE survey_dev;
CREATE DATABASE survey_test;
\q
```

### Setup the development and test environments

```
mkdir api
mkdir api/database
touch api/database/config.js
```

```js
// api/database/config.js
module.exports = {
  production: {
    database: process.env.CLOUD_SQL_DATABASE,
    username: process.env.CLOUD_SQL_USERNAME,
    password: process.env.CLOUD_SQL_PASSWORD,
    host: process.env.CLOUD_SQL_HOST,
    dialect: "postgres",
  },
  development: {
    database: "survey_dev",
    dialect: "postgres",
    username: "postgres",
    password: null,
    host: "localhost",
    port: 5432,
  },
  test: {
    database: "survey_test",
    dialect: "postgres",
    username: "postgres",
    password: null,
    host: "localhost",
    port: 5432,
  },
};
```

### Use this information to create DB connection instance

```
touch api/database/instance.js
```

```js
// api/database/instance.js
const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("./config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host || "localhost",
    port: config.port || 5432,
  }
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
```

### Import the database instance into server.js

```js
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));

// Set up sequelize
const { sequelize } = require("./api/database/instance.js");

app.all("/survey-responses", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/survey-responses", async (req, res) => {
  // Check the DB connection
  await sequelize.authenticate();
  return res.send("Coming soon");
});

app.get("/", async (req, res) => {
  return res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`✅  Backend listening on port ${port}`)
);

module.exports = server;
```

Now when we have the server running with:

```
nodemon server.js
```

And visit http://localhost:5000/survey-responses

The terminal should initiate the database connection:

```
Executing (default): SELECT 1+1 AS result
```

### Add a table to the database

We will use Sequelize-CLI to add a table using migrations.

https://sequelize.org/master/manual/migrations.html

```
npm install sequelize-cli --save-dev
```

Add folders for the migrations and models

```
mkdir api/database/migrations
mkdir api/models
touch .sequelizerc
```

```js
// .sequelizerc
const path = require("path");

module.exports = {
  config: path.resolve("api", "database/config.js"),
  "models-path": path.resolve("api", "models"),
  "migrations-path": path.resolve("api", "database/migrations"),
};
```

Now we can create a migration that we will use to generate the database table

```
npx sequelize migration:create --name create-survey-response
```

Update the file that was created in `api/database/migrations/...`

```js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("SurveyResponses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      data: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("Responses", ["user_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("SurveyResponses");
  },
};
```

Run the migration

```
npx sequelize db:migrate
```

This created our DB table. If we wanted to undo this step, we could run `npx sequelize db:migrate:undo` (if you do this, be sure to re-run the initial migration again).

### Create DB model

```
touch api/models/survey-response.js
```

```js
// api/models/survey-response.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "SurveyResponse",
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "user_id",
      },
      data: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {}
  );
};
```

Update our sequelize instance to automatically read any files in the /models directory

```js
// api/database/instance.js
const fs = require("fs");
const path = require("path");
const modelsDirectory = path.join(__dirname, "../models");
const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("./config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host || "localhost",
    port: config.port || 5432,
  }
);

db.modelNames = [];

fs.readdirSync(modelsDirectory)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(modelsDirectory, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
    db.modelNames.push(model.name);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
```

### Read from DB in a route

```js
// Update server.js
app.get("/survey-responses", async (req, res) => {
  const surveyResponses = await sequelize.models.SurveyResponse.findAll();
  return res.send({ surveyResponses });
});
```

Now when we visit `http://localhost:5000/survey-responses` in the browser, it will read all the survey responses from the database and return them. Currently that is empty, so the response body looks like:

```
{
  surveyResponses: []
}
```

## Testing

At this point, it will be easier to develop our backend API using tests, instead of doing guess-and-check in the browser over and over.

```
npm i mocha chai --save-dev

mkdir api/test
touch api/test/test.config.js
touch api/test/mocha.config.js
touch api/test/survey-responses.crud.spec.js
```

Add to package.json

```json
// package.json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "test-backend": "NODE_ENV=test mocha ./api/test --exit",
  "test-backend:watch": "NODE_ENV=test mocha --watch ./api/test ./api --file ./api/test/mocha.config.js"
}
```

Now in the terminal we can run:

| Command                      | Action                                             |
| ---------------------------- | -------------------------------------------------- |
| `npm run test-backend`       | Run the API test suite one time.                   |
| `npm run test-backend:watch` | Run the API test suite whenever a file is changed. |

Mocha will start up the server each time we run it, so we want to make sure to stop the server after the test suite runs.

```js
// mocha.config.js
const server = require("../../server.js");

after(async () => {
  return new Promise((resolve, reject) => {
    server.close(() => {
      resolve();
    });
  });
});
```

In the `test.config.js` file, we can define a `resetDb` helper function for our tests

```js
// test.config.js
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
```

Now we can write our first test:

```js
// api/test/survey-responses.crud.spec.js
const request = require("request");
const chai = require("chai");
const expect = chai.expect;
const Test = require("./test.config.js");
const { sequelize } = require("../database/instance.js");

const uri = "http://localhost:3000";
const req = request.defaults({
  json: true,
  uri,
});

describe("SurveyResponses endpoints", () => {
  before(async () => {
    // Reset the database before running these tests
    await Test.resetDb();
    return Promise.resolve();
  });

  it("GET /survey-responses should read all survey responses", async () => {
    // Perform a GET request to /survey-responses
    const payload = {
      uri: `${uri}/survey-responses`,
    };
    const { res, body } = await new Promise((resolve) => {
      req.get(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 200 status code
    expect(res.statusCode).to.equal(200);

    // Check that the body has a surveyResponse array
    expect(body.surveyResponses).to.exist;

    // Check that the surveyResponses array has 3 survey responses in it
    expect(body.surveyResponses.length).to.equal(3);

    // Check that the surveyResponses have the correct structure
    const surveyResponse = body.surveyResponses[0];
    expect(surveyResponse.data).to.exist;
    return Promise.resolve();
  });
});
```

We've intentionally written this test to fail; it is checking that there will be 3 survey responses, but we don't have any survey responses recorded yet.

When we run the test suite with

```
npm run test-backend:watch
```

![Test suite fails](https://res.cloudinary.com/component/image/upload/v1603755834/permanent/survey-tutorial-test-0.png)

This is good because it means our test is working. There are not 3 survey responses, so the test should fail.

We can get the test passing by creating 3 survey responses in the `before` block of the test:

```js
// api/test/survey-responses.crud.spec.js
// Updated before block:
before(async () => {
  // Reset the database before running these tests
  await Test.resetDb();

  // Create 3 surveyResponses
  await sequelize.models.SurveyResponse.create({
    userId: 1,
    data: { technology: ["JS", "React"] },
  });
  await sequelize.models.SurveyResponse.create({
    userId: 2,
    data: { technology: ["Java", "Spring", "VS Code"] },
  });
  await sequelize.models.SurveyResponse.create({
    userId: 3,
    data: { technology: ["MySql"] },
  });
  return Promise.resolve();
});
```

Now our test passes because 3 survey responses are returned.

We can also verify that the `survey_test` database has those 3 survey responses as rows by using a tool like `Postico` (or any other postgres tool).

![](https://res.cloudinary.com/component/image/upload/v1603756491/permanent/survey-tutorial-db-0.png)

Visiting `http://localhost:5000/survey-responses` will still show no survey responses because when we run `nodemon server.js`, the application connects to the development database, not the test database.

### Create a survey response

We need our API to receive survey data from the frontend and save it in the database.

We'll do this with

`POST /survey-responses`

And our data will be in the payload.

We can start by adding a failing test:

```js
// Added to api/test/survey-responses.crud.spec.js

it("POST /survey-responses should create a survey response", async () => {
  // Perform a POST request to /survey-responses
  const payload = {
    uri: `${uri}/survey-responses`,
    body: {
      data: {
        favoriteColor: "green",
        technology: ["Vue", "Node.js"],
      },
    },
  };
  const { res, body } = await new Promise((resolve) => {
    req.post(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 200 status code
  expect(res.statusCode).to.equal(200);

  // Check that the survey response is returned
  expect(body.id).to.exist;
  expect(body.data).to.deep.equal(payload.body.data);

  // Check that a survey response was created in the database
  const surveyResponse = await sequelize.models.SurveyResponse.findOne({
    where: { id: body.id },
  });
  expect(surveyResponse).to.exist;
  expect(surveyResponse.userId).to.equal(1);
  expect(surveyResponse.data).to.deep.equal(payload.body.data);

  return Promise.resolve();
});
```

This test initially fails with a `404` instead of returning a `200` status code here:

```js
expect(res.statusCode).to.equal(200);
```

because we haven't implemented our API endpoint yet.

We can "fix" this by adding the route:

```js
// Added to server.js, immediately after app.get("/survey-responses", ...)
app.post("/survey-responses", async (req, res) => {
  return res.send("Hello");
});
```

Now the test passes our `res.statusCode` check but fails on the next assertions because nothing is actually created.

```js
// Check that the survey response is returned
expect(body.id).to.exist;
expect(body.data).to.deep.equal(payload.body.data);
```

We can fix these by updating the route to actually create a `surveyResponse` record and return it:

```js
// Update the app.post block in server.js
app.post("/survey-responses", async (req, res) => {
  const surveyResponse = await sequelize.models.SurveyResponse.create({
    userId: 1,
    data: req.body.data,
  });
  return res.send(surveyResponse);
});
```

Now our tests are passing because the route creates a `surveyResponse` record and then sends it back to the requestor.

## Save a survey response from the frontend

Our backend is set up to receive and save a survey response when we `POST` to `/survey-responses`, so we can make our frontend do that.

```
npm install axios --save-dev
```

```js
// src/App.js
// Add axios and use it to send the data with survey.onComplete
import axios from "axios";
import * as Survey from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

Survey.StylesManager.applyTheme("modern");
const survey = new Survey.Model(questions);

survey.onComplete.add((result) => {
  axios.post("http://localhost:5000/survey-responses", {
    data: result.data,
  });
});

function App() {
  return (
    <div className="App">
      <Survey.Survey model={survey} />
    </div>
  );
}

export default App;
```

Now when we submit a survey response from the frontend, it is saved to the database on the backend.

### React router

```
npm i react-router-dom --save
```

### Bootstrap nav

```html
<!-- Add in the <head> of public/index.html -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
  integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
  crossorigin="anonymous"
/>
```

## Login & Signup

Create an account at https://userfront.com

```
npm i @userfront/react --save
```

```js
import Toolkit from "@userfront/react";
const Login = Toolkit.build({
  toolId: "nadrrd",
  tenantId: "5xbpy4nz",
});
```

```js
const Signup = Toolkit.build({
  toolId: "mnbrak",
  tenantId: "5xbpy4nz",
});
```

### Change the redirection route to /survey

In test mode, visit project settings and update "Login path" redirect

## Send the token with the survey submission

We'll send the access token when we submit a survey response, which will allow the API to know what user is making the request. We'll use a bearer token in the request header, which will look like:

`Authorization: Bearer eyJhbGciOiJ...`

### Set up the backend

We need to set the backend to accept the `Authorization` header.

Update the `Access-Control-Allow-Headers` setting in `server.js` to allow the `Authorization` header.

```js
// server.js
res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
```

### Send the token with request

We need to read the access token from the cookies, then attach it to our request.

`npm install --save-dev js-cookie`

```js
// App.js
// Import the Cookie library
import Cookie from "js-cookie";

// Update our post method to include the header
axios.post(
  "http://localhost:5000/survey-responses",
  {
    data: result.data,
  },
  {
    headers: {
      Authorization: `Bearer ${Cookie.get("access.5xbpy4nz")}`,
    },
  }
);
```

## Verify the Authorization token

Now that the client sends an Authorization JWT, we need to verify and decode it on the backend.

`npm install --save jsonwebtoken`

`npm run test-backend:watch`

In order to write tests, we need to create JWTs, which we will sign with an RSA key. For that, we need a key pair: private key used for signing the JWT and a public key used to verify it.

```
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----

-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMb8XUyMG7SkLKImwog14vQKFV
Z5/PPTrFOffcmSxj3VKn6N0COfLfA/e6Yy4VgXPYrRAHMEFwDieuZkoS+wuRztOY
IoAmS7F8wft1WRHJo56OqDtcWyCcttWMB0Ol7QrWM/z69+hmRUJJg2IU33tcLOPk
/UonF7GA4iarEPQeBQIDAQAB
-----END PUBLIC KEY-----
```

```js
// api/test/test.config.js
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

Test.rsaPublicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMb8XUyMG7SkLKImwog14vQKFV
Z5/PPTrFOffcmSxj3VKn6N0COfLfA/e6Yy4VgXPYrRAHMEFwDieuZkoS+wuRztOY
IoAmS7F8wft1WRHJo56OqDtcWyCcttWMB0Ol7QrWM/z69+hmRUJJg2IU33tcLOPk
/UonF7GA4iarEPQeBQIDAQAB
-----END PUBLIC KEY-----`;
```

Now we can update our test for `POST /survey-responses`.

We create a `token`, which is a signed JWT, and then include it in the test request's header as `authorization: Bearer ${token}`.

Then we assert that the `userId` of the created survey response should equal `88`, which is the `userId` from the token.

```js
// api/test/surveyResponses.crud.spec.js
it("POST /survey-responses should create a survey response", async () => {
  // Create a JWT and sign it with the RSA private key
  const token = jwt.sign(
    {
      userId: 88,
    },
    Test.rsaPrivateKey,
    { algorithm: "RS256" }
  );

  // Perform a POST request to /survey-responses
  const payload = {
    uri: `${uri}/survey-responses`,
    body: {
      data: {
        favoriteColor: "green",
        technology: ["Vue", "Node.js"],
      },
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const { res, body } = await new Promise((resolve) => {
    req.post(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 200 status code
  expect(res.statusCode).to.equal(200);

  // Check that the surveyResponse is returned
  expect(body.id).to.exist;
  expect(body.userId).to.equal(88);
  expect(body.data).to.deep.equal(payload.body.data);

  // Check that a surveyResponse was created in the database
  const surveyResponse = await sequelize.models.SurveyResponse.findOne({
    where: { id: body.id },
  });
  expect(surveyResponse).to.exist;
  expect(surveyResponse.userId).to.equal(88);
  expect(surveyResponse.data).to.deep.equal(payload.body.data);

  return Promise.resolve();
});
```

This test should be failing now, because the model isn't saving the `userId` from the token yet:

![Failing test](https://res.cloudinary.com/component/image/upload/v1605899038/permanent/failing-test-1.png)

### Save the token's userId with the survey response

We can get the test passing by updating the route to verify the JWT and include it when saving the survey response:

```js
// server.js
const jwt = require("jsonwebtoken");
const rsaPublicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMb8XUyMG7SkLKImwog14vQKFV
Z5/PPTrFOffcmSxj3VKn6N0COfLfA/e6Yy4VgXPYrRAHMEFwDieuZkoS+wuRztOY
IoAmS7F8wft1WRHJo56OqDtcWyCcttWMB0Ol7QrWM/z69+hmRUJJg2IU33tcLOPk
/UonF7GA4iarEPQeBQIDAQAB
-----END PUBLIC KEY-----`;

...

app.post("/survey-responses", async (req, res) => {
  // Get the JWT from the header named "authorization"
  const token = req.headers.authorization.replace("Bearer ", "");

  // Verify the token using the RSA public key
  const verified = jwt.verify(token, rsaPublicKey, { algorithms: ["RS256"] });

  // Use the userId from the token when creating the database record
  const surveyResponse = await sequelize.models.SurveyResponse.create({
    userId: verified.userId,
    data: req.body.data,
  });
  return res.send(surveyResponse);
});
```

### Handle cases where the JWT is incorrect or missing

In order to build a secure system, we want to make sure that we don't permit access to unauthorized users. We can write tests to assert the following:

- Should return 401 error when JWT is expired
- Should return 401 error when JWT is signed with a different key
- Should return 401 error when authorization header is missing
